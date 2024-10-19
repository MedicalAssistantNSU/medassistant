import cv2
import easyocr
import os
import argparse
from exceptions import *  # noqa: F401
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
        except Exception as e:
            raise OCRProcessError(f"Failed to initialize OCR reader: {e}")

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
            raise ImageReadError(f"Error reading image at {image_path}")

        try:
            # Convert to grayscale and apply Gaussian Blur
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            blurred = cv2.GaussianBlur(gray, (1, 1), 0)

            return blurred
        except Exception as e:
            raise OCRProcessError(f"Error during image preprocessing: {e}")

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
        except Exception as e:
            raise OCRProcessError(f"Error during OCR processing: {e}")

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
            print(f"OCR result saved to {text_file_path}")
        except Exception as e:
            raise SaveError(f"Failed to save detected text: {e}")

    def run(self, image_path: str) -> None:
        """
        Execute the OCR process: preprocessing, OCR, and saving results.

        :param image_path: Path to the input image file.
        :raises CVException: If something goes wrong.
        """
        try:
            # Preprocess the document
            processed_image = self.preprocess_document(image_path)

            if processed_image is not None:
                # Perform OCR
                ocr_result = self.ocr_image(processed_image)

                # Save the OCR result
                self.save_detected_text(ocr_result)
        except Exception as e:
            raise CVException(f"An error occurred during OCR processing: {e}")


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
