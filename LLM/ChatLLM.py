from langchain.prompts import PromptTemplate
from langchain_community.llms.llamafile import Llamafile


class ChatLLM:
    def __init__(self):
        """
        Init the ChatLLM class.
        This class connects to a model running at some url
        and then performs all chains to interact with this model.
        """

        self.model = Llamafile(base_url='http://localhost:8080')
        self.system_prompt = """This is a conversation between User and MedAssistant, a friendly chatbot. \
        MedAssistant is helpful, kind, honest, good at writing, and never fails to answer any \
        requests immediately and with precision."""
        self.username = 'User'

        self.prompt_template = PromptTemplate.from_template(
            """
            {prompt}
    
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

    def send_message(self, message: str, history: str) -> dict[str: str]:
        """
        Method for sending a question from the user to the model.
        Receives both new question and context from previous interactions.
        Parameters will be passed to prompt template and then to the model.

        :param message: message to the model
        :param history: previous interactions
        :return: the answer and updated history for further interactions
        """

        # form a prompt for the model
        formatted_prompt = self.prompt_template.invoke(
            {
                "prompt": self.system_prompt,
                "name": self.username,
                "message": message,
                "history": history
            }
        )

        # collect answer with printing
        answer = ''
        for chunks in self.model.stream(formatted_prompt,
                                        stop=['</s>', self.username+':', self.username.lower()+':', '<|eot_id|>']
                                        ):
            print(chunks, end="", flush=True)
            answer += chunks
        print()

        # update history
        new_history = (history + self.history_template
                       .invoke({"message": message, "answer": answer})
                       .to_string()
                       )

        return {'answer': answer, 'history': new_history}
