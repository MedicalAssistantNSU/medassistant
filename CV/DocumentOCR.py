import cv2
import easyocr
import numpy as np
import os
import sys
import argparse
from typing import Optional

"""
Usage: python3 DocumentOCR.py <path> (--save_path=<path>)
Output: <path> if specified, otherwise "processed_output"
"""


class DocumentOCR:
    def __init__(self, save_path: str = 'processed_output'):
        """
        Initialize the DocumentOCR class.

        :param save_path: Path to save the processed images and OCR output.
        :raises OCRProcessError: If OCR reader initialization fails.
        """
        self.save_path = save_path
        os.makedirs(self.save_path, exist_ok=True)
        try:
            self.reader = easyocr.Reader(['ru', 'en'], gpu=False)
        except Exception:
            sys.exit(2)  # OCRProcessError

    @staticmethod
    def preprocess_document(image_path: str) -> Optional:
        """
        Preprocess the input document by converting to grayscale, applying Gaussian blur

        :param image_path: Path to the input image file.
        :return: Preprocessed image or None if reading fails.
        :raises OCRProcessError: If preprocessing fails.
        :raises ImageReadError: If image reading fails.
        """
        # Read the image
        image = cv2.imread(image_path)

        if image is None:
            sys.exit(3)  # ImageReadError

        try:
            # Convert to grayscale and apply Gaussian Blur
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (1, 1), 0)

            edges = cv2.Canny(blurred, 100, 200)
            edge_density = np.sum(edges)
            threshold_edge_density = 10000000

            if edge_density < threshold_edge_density:
                sys.exit(4)  # BlurryTextError

            return blurred
        except Exception:
            sys.exit(2)  # OCRProcessError

    def ocr_image(self, image) -> str:
        """
        Perform Optical Character Recognition (OCR) on the processed image.

        :param image: Preprocessed image to perform OCR on.
        :return: Detected text as a string.
        :raises OCRProcessError: If OCR fails.
        """
        try:
            result = self.reader.readtext(image, detail=1)

            # Filter text by confidence threshold
            threshold = 0.5
            filtered_texts = [text for (_, text, prob) in result if prob > threshold]

            # Merge detected text
            return " ".join(filtered_texts).strip()
        except Exception:
            sys.exit(2)  # OCRProcessError

    def save_detected_text(self, text: str) -> None:
        """
        Save the detected text to 'detected_text.txt'.

        :param text: The text to save.
        :raises SaveError: If the text could not be saved.
        """
        try:
            text_file_path = os.path.join(self.save_path, 'detected_text.txt')
            with open(text_file_path, 'w', encoding='utf-8') as file:
                file.write(text)
        except Exception:
            sys.exit(5)  # SaveError

    def run(self, image_path: str) -> str:
        """
        Execute the OCR process: preprocessing and OCR.

        :param image_path: Path to the input image file.
        :return: Detected text as a string.
        :raises CVException: If something goes wrong.
        """
        try:
            # Preprocess the document
            processed_image = self.preprocess_document(image_path)

            if processed_image is not None:
                # Perform OCR and return result
                ocr_result = self.ocr_image(processed_image)
                return ocr_result
            else:
                sys.exit(2)  # OCRProcessError
        except Exception:
            sys.exit(6)  # CVException


def main():
    parser = argparse.ArgumentParser(description="Run OCR on an image and save the result to detected_text.txt.")
    parser.add_argument('image_path', type=str, help="Path to the image file to process")
    parser.add_argument('--save_path', type=str, default='processed_images', help="Directory to save results")

    args = parser.parse_args()

    # Initialize DocumentOCR with the save path
    ocr_processor = DocumentOCR(save_path=args.save_path)

    # Run the OCR process on the specified image path
    ocr_processor.run(args.image_path)


if __name__ == "__main__":
    main()
