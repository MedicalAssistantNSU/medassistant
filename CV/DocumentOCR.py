import cv2
import easyocr
import os
from exceptions import *
from typing import Optional


class DocumentOCR:
    def __init__(self, image_path: str, save_path: str = 'processed_images'):
        """
        Initialize the DocumentOCR class.

        :param image_path: Path to the input image file.
        :param save_path: Path to save the processed images and OCR output.
        :raises OCRProcessError: If OCR reader initialization fails.
        """
        self.image_path = image_path
        self.save_path = save_path
        os.makedirs(self.save_path, exist_ok=True)
        try:
            self.reader = easyocr.Reader(['ru', 'en'], gpu=False)
        except Exception as e:
            raise OCRProcessError(f"Failed to initialize OCR reader: {e}")

    def preprocess_document(self) -> Optional:
        """
        Preprocess the input document by converting to grayscale, applying Gaussian blur

        :return: Preprocessed image or None if reading fails.
        :raises OCRProcessError: If preprocessing fails.
        :raises ImageReadError: If image reading fails.
        """
        # Read the image
        image = cv2.imread(self.image_path)

        if image is None:
            raise ImageReadError(f"Error reading image at {self.image_path}")

        try:
            # Convert to grayscale
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

            # Apply Gaussian Blur
            blurred = cv2.GaussianBlur(gray, (1, 1), 0)

            # Save the processed image for reference
            processed_image_path = os.path.join(self.save_path, 'processed_image.jpg')
            cv2.imwrite(processed_image_path, blurred)

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

            # Filter text by confidence
            threshold = 0.5
            filtered_texts = [text for (_, text, prob) in result if prob > threshold]
            merged_text = " ".join(filtered_texts)

            # Clean up extra spaces
            merged_text = " ".join(merged_text.split())

            return merged_text
        except Exception as e:
            raise OCRProcessError(f"Error during OCR processing: {e}")

    def save_detected_text(self, text: str, filename: str = 'detected_text.txt') -> None:
        """
        Save the detected text to a file.

        :param text: The text to save.
        :param filename: The file name to save the text as.
        :raises SaveError: If the text could not be saved.
        """
        try:
            text_file_path = os.path.join(self.save_path, filename)
            with open(text_file_path, 'w', encoding='utf-8') as file:
                file.write(text)
            print(f"OCR result saved to {text_file_path}")
        except Exception as e:
            raise SaveError(f"Failed to save detected text: {e}")

    def run(self) -> None:
        """
        Execute the entire OCR process: preprocessing, OCR, and saving results.

        :raises CVException: If something went wrong.
        """
        try:
            # Preprocess the document
            processed_image = self.preprocess_document()

            if processed_image is not None:
                # Perform OCR
                ocr_result = self.ocr_image(processed_image)

                # Save the OCR result
                self.save_detected_text(ocr_result)
        except CVException as e:
            print(f"An error occurred during OCR processing: {e}")

