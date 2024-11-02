from LLM.ChatLLM import ChatLLM


def main():
    script = ChatLLM()

    history = ''
    while 1:
        message = input("Enter a message: ")

        answer, history = script.send_message(message, history)


if __name__ == '__main__':
    main()