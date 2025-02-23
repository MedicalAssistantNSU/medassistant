import argparse
import os
import sys
import json
import logging
from dotenv import load_dotenv
from CV.DocumentOCR import DocumentOCR
from LLM.ChatLLM import ChatLLM

# Load environment variables from .env file
load_dotenv()

# Set up logging
log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(
    level=getattr(logging, log_level, logging.INFO),
    format='%(asctime)s - %(levelname)s - %(message)s',
)
logger = logging.getLogger(__name__)


def save_to_history(user_save_path, text):
    """Save information in chat history file"""
    history_path = os.path.join(user_save_path, "history.txt")
    with open(history_path, 'a', encoding='utf-8') as history_file:
        history_file.write(f"{text}\n")


def load_detected_text(file_path):
    """Load detected text from file if it exists."""
    if os.path.exists(file_path):
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    return None


def main(user_id="user_test", chat_id="chat_test", history="", image_path=None, prompt=None):
    """
    Main function to process OCR and interact with a language model (LLM).

    Parameters:
    - user_id (str): Unique identifier for the user.
    - chat_id (str): Unique identifier for the chat session.
    - history (str): History of the chat.
    - image_path (str): Path to the new image file to process.
    - prompt (str): Custom prompt to send to LLM if a specific question needs to be asked.
    """
    logger.info(f"Starting processing for user: {user_id}, chat: {chat_id}")

    user_save_path = os.path.join("processed_output", user_id, chat_id)
    os.makedirs(user_save_path, exist_ok=True)
    llm = ChatLLM()
    history = "" if history is None else history
    detected_text = None

    # Chat task - interpret detected text or respond with prompt
    if prompt is None:
        # Default prompt to simplify the text in Russian
        prompt = ("Tell the same what is written in the last document by a doctor but in simpler terms for easier"
                  " understanding in Russian. It should remain all the details. "
                  "The answer should be in Russian.")

    if image_path:
        logger.info(f"Processing image: {image_path}")
        ocr_processor = DocumentOCR(save_path=user_save_path)
        detected_text = ocr_processor.run(image_path)

        if detected_text is None:
            logger.error("OCR failed to detect any text.")
            sys.exit(1)

    # Send the prompt to LLM with combined context
    chat_response = llm.send_message(
        message=prompt,
        history=history,
        document=detected_text
    )

    # Check if LLM returned a valid response
    if not chat_response:
        logger.error("LLM returned an empty response.")
        sys.exit(1)

    logger.info("Processing completed successfully.")
    print(json.dumps(chat_response))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Process an image with OCR and refine the text with LLM.")
    parser.add_argument('user_id', type=str, help="Unique identifier for the user")
    parser.add_argument('chat_id', type=str, help="Unique identifier for the chat session")
    parser.add_argument('--history', type=str, help="History of chat")
    parser.add_argument('--image_path', type=str, help="Path to the new image file to process")
    parser.add_argument('--prompt', type=str, help="Custom prompt to send to the LLM")

    args = parser.parse_args()
    main(args.user_id, args.chat_id, args.history, args.image_path, args.prompt)

# python3 inference.py 0 0 --history "" --image_path "./test3.jpg"