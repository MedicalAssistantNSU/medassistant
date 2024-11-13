import json
import argparse
from langchain.prompts import PromptTemplate
from langchain_community.llms.llamafile import Llamafile


"""
Usage: python3 LLM/ChatLLM.py <url> <username> <message> <history>
Output: None (everything now goes to stdout)
"""


class ChatLLM:
    def __init__(
            self,
            url: str = 'http://localhost:8080',
            username: str = 'User',
            task='chat',
            config_file='LLM/prompts_config.json'):
        """
        Initialize the ChatLLM class with a task-based system prompt.
        The system prompt is selected based on the task provided.

        :param task: The task for which to load the system prompt (e.g., 'ocr', 'chat').
        :param config_file: Path to the configuration file with system prompts.
        """
        self.base_url = url
        self.min_p: float = 0.05
        self.n_keep: int = 0  # 0 = no tokens are kept when context size is exceeded. -1  = retain all tokens.
        self.n_predict: int = -1  # -1 = infinity
        self.context_length = 131072
        self.max_history_length = 3 * self.context_length
        self.cache = False

        self.model = Llamafile(
            base_url=self.base_url,
            min_p=self.min_p,
            n_keep=self.n_keep,
            n_predict=self.n_predict,
            cache=self.cache,
        )
        self.username = username

        with open(config_file, 'r') as file:
            prompts = json.load(file)

        self.system_prompt = prompts.get(task)
        self.contextualize_prompt = prompts.get('contextualize')

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
        self.contextualize_template = PromptTemplate.from_template(
            """
            {contextualize_prompt}
            Chat history: {context}
            """
        )

    def send_message(self, message: str, history: str) -> dict:
        """
        Method for sending a question from the user to the model.
        Receives both new question and context from previous interactions.
        Parameters will be passed to prompt template and then to the model.

        :param message: message to the model
        :param history: previous interactions
        :return: the answer and updated history for further interactions
        """
        formatted_prompt = self.prompt_template.invoke(
            {
                "prompt": self.system_prompt,
                "name": self.username,
                "message": message,
                "history": history
            }
        )

        answer = ''
        for chunks in self.model.stream(formatted_prompt,
                                        stop=[
                                            '</s>',
                                            self.username + ':',
                                            self.username.lower() + ':',
                                            '<|eot_id|>',
                                            '<|endoftext|>',
                                        ]
                                        ):
            # print(chunks, end="", flush=True)
            answer += chunks

        new_history = (history + self.history_template
                       .invoke({"message": message, "answer": answer})
                       .to_string()
                       )

        if len(new_history) > self.max_history_length:
            # print('CONTEXTUALIZE')
            new_history = self.contextualize(new_history)
            # print(f'NEW HISTORY: {new_history}')

        print({'answer': answer, 'history': new_history})
        return {'answer': answer, 'history': new_history}

    def contextualize(self, context: str):
        formatted_prompt = self.contextualize_template.invoke(
            {
                "contextualize_prompt": self.contextualize_prompt,
                "context": context,
            }
        )
        return self.model.invoke(formatted_prompt)


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
