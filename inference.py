import argparse
from CV.DocumentOCR import DocumentOCR
from LLM.ChatLLM import ChatLLM


def main(image_path=None, save_path='processed_output', task='chat', prompt=None):
    """
    Main function to process OCR or chat tasks with a language model (LLM).

    Parameters:
    - image_path (str): Path to the image file to process (required for 'ocr' task).
    - save_path (str): Directory path where results will be saved (default is 'processed_output').
    - task (str): Type of task to perform, either 'ocr' or 'chat'. Defaults to 'chat'.
      - 'ocr': Runs OCR on an image and refines the text using LLM.
      - 'chat': Sends a prompt directly to the LLM for response.
    - prompt (str): Custom prompt to send to LLM if task is 'chat'. Required for 'chat' task.
    """
    llm = ChatLLM(task=task)

    if task == "ocr":
        ocr_processor = DocumentOCR(save_path=save_path)
        if image_path is None:
            print("No image path provided for ocr task.")
            return
        print("Running OCR...")
        ocr_result = ocr_processor.run(image_path)
        print(f"Detected OCR text:\n{ocr_result}")

        # Use OCR result as input prompt for LLM
        prompt = f"Original text: {ocr_result}"
        print("Refining text with LLM...")
        refined_text = llm.send_message(prompt, "")
        ocr_processor.save_detected_text(refined_text["answer"])
    else:
        # For chat task, send the provided prompt to LLM
        if prompt is None:
            print("No prompt provided for chat task.")
            return
        print("Sending prompt to LLM...")
        llm.send_message(prompt, "")

    print("\nDone.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process an image with OCR and refine the text with LLM.")
    parser.add_argument('--image_path', type=str, help="Path to the image file to process (required for 'ocr' task)")
    parser.add_argument('--save_path', type=str, default='processed_output', help="Directory to save results")
    parser.add_argument('--task', type=str, choices=['ocr', 'chat'], default='chat',
                        help="Task for LLM prompt selection, e.g., 'ocr' for OCR processing or 'chat' for direct LLM interaction")
    parser.add_argument('--prompt', type=str, help="Prompt to send to the LLM if task is 'chat'")

    args = parser.parse_args()
    main(args.image_path, args.save_path, args.task, args.prompt)
