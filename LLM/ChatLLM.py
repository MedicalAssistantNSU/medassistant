import json
from langchain.prompts import PromptTemplate
from langchain_community.llms.llamafile import Llamafile


class ChatLLM:
    def __init__(self, task='chat', config_file='LLM/prompts_config.json'):
        """
        Initialize the ChatLLM class with a task-based system prompt.
        The system prompt is selected based on the task provided.

        :param task: The task for which to load the system prompt (e.g., 'ocr', 'chat').
        :param config_file: Path to the configuration file with system prompts.
        """
        self.model = Llamafile(base_url='http://localhost:8080')
        self.username = 'User'

        with open(config_file, 'r') as file:
            prompts = json.load(file)

        self.system_prompt = prompts.get(task, prompts['chat'])

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
                                        stop=['</s>', self.username + ':', self.username.lower() + ':', '<|eot_id|>']
                                        ):
            print(chunks, end="", flush=True)
            answer += chunks

        new_history = (history + self.history_template
                       .invoke({"message": message, "answer": answer})
                       .to_string()
                       )

        return {'answer': answer, 'history': new_history}
