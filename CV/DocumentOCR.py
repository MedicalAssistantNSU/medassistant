import cv2
import easyocr
import os
import sys
import argparse
import numpy as np  # noqa: F401
import logging
import time
from dotenv import load_dotenv

from prometheus_client import CollectorRegistry, Histogram, push_to_gateway

# Load environment variables from .env file
load_dotenv()

# Set up logging
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, log_level, logging.INFO),
    format='%(asctime)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)

# Create a registry for Prometheus metrics
registry = CollectorRegistry()

# Define Prometheus Histograms for performance monitoring with the custom registry
PREPROCESS_TIME = Histogram('document_preprocess_seconds', 'Time spent preprocessing document', registry=registry)
OCR_TIME = Histogram('document_ocr_seconds', 'Time spent on OCR process', registry=registry)
TOTAL_TIME = Histogram('document_total_seconds', 'Total time for OCR process', registry=registry)

PUSH_GATEWAY = "0.0.0.0:9091"  # default value, if you need to - fix it


def push_metrics_and_exit(exit_code: int):
    """
    Push metrics to Prometheus and force exit with the given exit code.
    :param exit_code: The exit code to use.
    """
    if PUSH_GATEWAY:
        try:
            push_to_gateway(PUSH_GATEWAY, job='ocr_job', registry=registry)
            logger.info("Metrics pushed before exiting.")
        except Exception as e:
            logger.error("Failed to push metrics before exiting: %s", e)

    sys.exit(exit_code)  # Force exit with the given exit code


class DocumentOCR:
    def __init__(self, save_path: str = 'processed_output'):
        """
        Initialize the DocumentOCR class.
        :param save_path: Path to save the processed images and OCR output.
        """
        self.save_path = save_path
        os.makedirs(self.save_path, exist_ok=True)
        try:
            logger.info("Initializing OCR reader...")
            start_time = time.time()
            self.reader = easyocr.Reader(['ru', 'en'], gpu=True)
            elapsed = time.time() - start_time
            logger.info(f"OCR reader initialized successfully in {elapsed:.2f} seconds.")
        except Exception:
            logger.error("Failed to initialize OCR reader.")
            push_metrics_and_exit(2)  # Exit with code 2

    @staticmethod
    def preprocess_document(image_path: str):
        """
        Preprocess the input document by converting to grayscale and applying Gaussian blur.
        :param image_path: Path to the input image file.
        :return: Preprocessed image.
        """
        logger.info(f"Preprocessing document: {image_path}")
        image = cv2.imread(image_path)
        if image is None:
            logger.error("Failed to read image file.")
            push_metrics_and_exit(3)  # Exit with code 3

        try:
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (1, 1), 0)
            logger.info("Image preprocessing completed.")
            # edges = cv2.Canny(blurred, 100, 200)
            # edge_density = np.sum(edges)
            # threshold_edge_density = 10000000

            # if edge_density < threshold_edge_density:
            #     sys.exit(4)  # BlurryTextError
            return blurred
        except Exception:
            logger.error("Image preprocessing failed.")
            push_metrics_and_exit(2)  # Exit with code 2

    def ocr_image(self, image) -> str:
        """
        Perform Optical Character Recognition (OCR) on the processed image.
        :param image: Preprocessed image to perform OCR on.
        :return: Detected text as a string.
        """
        logger.info("Performing OCR on the image...")
        try:
            result = self.reader.readtext(image, detail=1)
            threshold = 0.5
            filtered_texts = [text for (_, text, prob) in result if prob > threshold]
            logger.info("OCR processing completed.")
            return " ".join(filtered_texts).strip()
        except Exception:
            logger.error("OCR processing failed.")
            push_metrics_and_exit(2)  # Exit with code 2

    def save_detected_text(self, text: str) -> None:
        """
        Save the detected text to 'detected_text.txt'.
        :param text: The text to save.
        """
        logger.info("Saving detected text...")
        try:
            text_file_path = os.path.join(self.save_path, 'detected_text.txt')
            with open(text_file_path, 'w', encoding='utf-8') as file:
                file.write(text)
            logger.info("Detected text saved successfully.")
        except Exception:
            logger.error("Failed to save detected text.")
            push_metrics_and_exit(5)  # Exit with code 5

    def run(self, image_path: str) -> str:
        """
        Execute the OCR process and exit on error while ensuring metrics are pushed.
        :param image_path: Path to the input image file.
        :return: Detected text as a string.
        """
        logger.info(f"Starting OCR process for: {image_path}")

        with TOTAL_TIME.time():
            with PREPROCESS_TIME.time():
                processed_image = self.preprocess_document(image_path)  # May exit

            with OCR_TIME.time():
                ocr_result = self.ocr_image(processed_image)  # May exit

            self.save_detected_text(ocr_result)  # May exit

        logger.info("OCR process completed successfully.")

        if PUSH_GATEWAY:
            try:
                push_to_gateway(PUSH_GATEWAY, job='ocr_job', registry=registry)
                logger.info("Metrics pushed successfully.")
            except Exception as e:
                logger.error("Failed to push metrics to Pushgateway: %s", e)

        return ocr_result


def main():
    parser = argparse.ArgumentParser(
        description="Run OCR on an image and save the result to detected_text.txt."
    )
    parser.add_argument('image_path', type=str, help="Path to the image file to process")
    parser.add_argument('--save_path', type=str, default='processed_images', help="Directory to save results")
    args = parser.parse_args()

    ocr_processor = DocumentOCR(save_path=args.save_path)
    ocr_processor.run(args.image_path)


if __name__ == "__main__":
    main()
