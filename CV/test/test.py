import os
import sys

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from DocumentOCR import DocumentOCR  # noqa: E402


def main():
    test_image_path = "test.jpeg"
    save_path = "./"  # Directory where results will be saved

    try:
        # Initialize the DocumentOCR processor
        ocr_processor = DocumentOCR(save_path=save_path)

        # Run OCR on the test image
        detected_text = ocr_processor.run(test_image_path)
        text_file_path = os.path.join(save_path, 'test_text.txt')
        with open(text_file_path, 'w', encoding='utf-8') as file:
            file.write(detected_text)

    except SystemExit as e:
        exit_code = e.code
        sys.exit(exit_code)


if __name__ == "__main__":
    main()
