FROM ubuntu:24.04
RUN apt update
RUN apt -y upgrade

RUN apt install -y software-properties-common
RUN add-apt-repository ppa:deadsnakes/ppa
RUN apt update
RUN apt -y upgrade

RUN apt install -y python3.9
RUN apt install -y pip

RUN mkdir -p /app/backend
RUN mkdir -p /app/CV
RUN mkdir -p /app/LLM

ADD backend/ /app/backend

ADD CV/ /app/CV/
ADD LLM/ /app/LLM/
ADD inference.py /app/
ADD requirements.txt /app/

WORKDIR /app

RUN apt install -y python3.9-venv
RUN python3.9 -m venv venv
RUN . /app/venv/bin/activate
RUN /app/venv/bin/pip install opencv-python
RUN /app/venv/bin/pip install -r requirements.txt 
RUN ["/bin/bash", "-c", "source venv/bin/activate"]
ENV PATH="/app/venv/bin:$PATH"

RUN apt install -y golang-go

WORKDIR /app/backend/

EXPOSE "8080"

RUN go build -o main cmd/main.go

CMD ["/app/backend/main"]