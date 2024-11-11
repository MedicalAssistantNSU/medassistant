import json
import argparse
from langchain.prompts import PromptTemplate
from langchain_community.llms.llamafile import Llamafile


"""
Usage: python3 LLM/ChatLLM.py <url> <username> <message> <history>
Output: None
"""


class ChatLLM:
    def __init__(
            self,
            url: str = 'http://localhost:8080',
            username: str = 'User',
            config_file='LLM/prompts_config.json'):
        """
        Initialize the ChatLLM class with a task-based system prompt.
        The system prompt is selected based on the task provided.

        :param task: The task for which to load the system prompt (e.g., 'ocr', 'chat').
        :param config_file: Path to the configuration file with system prompts.
        """
        base_url = url
        min_p: float = 0.05
        n_keep: int = 0  # 0 = tokens are kept when context size is exceeded. -1  = retain all tokens from the prompt.
        n_predict: int = -1  # -1 = infinity

        self.model = Llamafile(
            base_url=base_url,
            min_p=min_p,
            n_keep=n_keep,
            n_predict=n_predict,
        )
        self.username = username

        with open(config_file, 'r') as file:
            self.prompts = json.load(file)

        self.contextualize_prompt = self.prompts.get('contextualize')

        self.prompt_template = PromptTemplate.from_template(
            """
            {prompt}\n
            {history}
            {name}: {message}
            """
        )
        self.history_template = PromptTemplate.from_template(
            """
            User: {message}
            MedAssistant: {answer}
            """
        )

    def send_message(self, message: str, history: str, task: str) -> dict:
        """
        Method for sending a question from the user to the model.
        Receives both new question and context from previous interactions.
        Parameters will be passed to prompt template and then to the model.

        :param task: task to be performed
        :param message: message to the model
        :param history: previous interactions
        :return: the answer and updated history for further interactions
        """
        formatted_prompt = self.prompt_template.invoke(
            {
                "prompt": self.prompts.get(task),
                "name": self.username,
                "message": message,
                "history": history
            }
        )

        answer = ''
        for chunks in self.model.stream(formatted_prompt,
                                        stop=['</s>', self.username + ':', self.username.lower() + ':', '<|eot_id|>']
                                        ):
            # print(chunks, end="", flush=True)
            answer += chunks

        new_history = (history + self.history_template
                       .invoke({"message": message, "answer": answer})
                       .to_string()
                       )

        result = {'answer': answer, 'history': new_history}
        print(result)
        return result

    # def contextualize(self, context: str):


def main():
    parser = argparse.ArgumentParser(description="Sending and receiving messages to/from model on localhost")
    parser.add_argument('url', type=str, help="Url that model is hosted on")
    parser.add_argument('username', type=str, help="Username that will be shown in chat")
    parser.add_argument('message', type=str, default='', help="Message from user")
    parser.add_argument('history', type=str, default='', help="History of interactions, fully handled by this script")

    args = parser.parse_args()

    model = ChatLLM(
        url=args.url,
        username=args.username
    )

    model.send_message(args.message, args.history)


if __name__ == "__main__":
    main()
