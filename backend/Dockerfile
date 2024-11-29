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

RUN apt install -y python3.9-venv
RUN python3.9 -m venv venv
RUN . /venv/bin/activate
RUN venv/bin/pip install -r app/requirements.txt
RUN venv/bin/pip install opencv-python


RUN apt install -y golang-go

WORKDIR /app/backend/

EXPOSE "8080"

RUN go build -o main cmd/main.go

CMD ["/app/backend/main"]