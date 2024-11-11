import argparse
import os
from CV.DocumentOCR import DocumentOCR
from LLM.ChatLLM import ChatLLM


def load_detected_text(file_path):
    """Load detected text from file if it exists."""
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    return None


def main(user_id="user_test", chat_id="chat_test", image_path=None, prompt=None):
    """
    Main function to process OCR and interact with a language model (LLM).

    Parameters:
    - user_id (str): Unique identifier for the user.
    - chat_id (str): Unique identifier for the chat session.
    - image_path (str): Path to the new image file to process.
    - prompt (str): Custom prompt to send to LLM if a specific question needs to be asked.
    """
    # Set up paths and initialize LLM
    user_save_path = os.path.join("processed_output", user_id, chat_id)
    os.makedirs(user_save_path, exist_ok=True)
    llm = ChatLLM()

    # Initialize context list to store detected texts from previous images
    context_texts = []

    # Load all previous detected text files in this session directory
    for file in os.listdir(user_save_path):
        if file.startswith("detected_text_") and file.endswith(".txt"):
            text = load_detected_text(os.path.join(user_save_path, file))
            if text:
                context_texts.append(text)

    # Process the new image if provided
    if image_path:
        detected_text_filename = f"detected_text_{os.path.basename(image_path)}.txt"
        detected_text_path = os.path.join(user_save_path, detected_text_filename)

        # Check if the new image has already been processed
        detected_text = load_detected_text(detected_text_path)
        if detected_text is None:
            # Perform OCR on the new image
            ocr_processor = DocumentOCR(save_path=user_save_path)
            ocr_result = ocr_processor.run(image_path)
            prompt_for_llm = f"Original text: {ocr_result}"
            refined_text_response = llm.send_message(prompt_for_llm, "", task="ocr")

            # Check if LLM returned a valid response
            if refined_text_response and "answer" in refined_text_response:
                refined_text = refined_text_response["answer"]

                # Save refined text for future reference
                with open(detected_text_path, 'w', encoding='utf-8') as f:
                    f.write(refined_text)
                detected_text = refined_text
            else:
                raise ValueError("LLM did not return a valid response with 'answer' key.")

        # Add the detected text from the new image to context
        context_texts.append(detected_text)

    # Create a combined context string from all detected texts
    combined_context = "\n\n".join(
        [f"Detected text from image {i + 1}: {text}" for i, text in enumerate(context_texts)])

    # Chat task - interpret detected text or respond with prompt
    if prompt is None:
        # Default prompt to simplify the text in Russian
        prompt = ("Explain what is written in the last document by a doctor in simpler terms for easier"
                  " understanding in Russian.")

    # Send the prompt to LLM with combined context
    chat_response = llm.send_message(prompt, combined_context, task="chat")

    # Check if LLM returned a valid response
    if chat_response and "answer" in chat_response:
        answer = chat_response["answer"]

        # Save prompt and answer to history file
        history_path = os.path.join(user_save_path, "history.txt")
        with open(history_path, 'a', encoding='utf-8') as history_file:
            history_file.write(f"Prompt: {prompt}\n")
            history_file.write(f"Answer: {answer}\n\n")
    else:
        raise ValueError("LLM did not return a valid response with 'answer' key.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process an image with OCR and refine the text with LLM.")
    parser.add_argument('user_id', type=str, help="Unique identifier for the user")
    parser.add_argument('chat_id', type=str, help="Unique identifier for the chat session")
    parser.add_argument('--image_path', type=str, help="Path to the new image file to process")
    parser.add_argument('--prompt', type=str, help="Custom prompt to send to the LLM")

    args = parser.parse_args()
    main(args.user_id, args.chat_id, args.image_path, args.prompt)
