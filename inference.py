# inference.py

import argparse
from CV.DocumentOCR import DocumentOCR
from LLM.ChatLLM import ChatLLM


def main(image_path, save_path='processed_output'):
    # Initialize OCR processor with save path
    ocr_processor = DocumentOCR(save_path=save_path)

    # Initialize LLM processor
    llm = ChatLLM()

    # Run OCR on the provided image
    print("Running OCR...")
    ocr_result = ocr_processor.run(image_path)

    # Print the detected OCR text for debugging
    print(f"Detected OCR text:\n{ocr_result}")

    # Prepare prompt for LLM
    prompt = ("I've done OCR but I have some mistakes and noise. "
              "Can you make this text better? Do not change the idea and sense of the text. "
              "Answer with only refined text and nothing else. Answer should be given in the language of original text. "
              "If you understand a word, replace it with proper spelling.\n"
              f"Original text: {ocr_result}")

    # Send OCR result to LLM for refinement
    print("Refining text with LLM...")
    refined_text, _ = llm.send_message(prompt, "")

    # Output the refined text
    print(f"Refined text:\n{refined_text}")

    # Save the refined text
    ocr_processor.save_detected_text(refined_text)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process an image with OCR and refine the text with LLM.")
    parser.add_argument('image_path', type=str, help="Path to the image file to process")
    parser.add_argument('--save_path', type=str, default='processed_output', help="Directory to save results")
    args = parser.parse_args()

    main(args.image_path, args.save_path)
