import os
import random
import time
import subprocess

# List of image files
image_files = [
    "/Users/a1/PycharmProjects/medassistant/CV/benchmark/benchmark_cv/1.jpeg",
    "/Users/a1/PycharmProjects/medassistant/CV/benchmark/benchmark_cv/2.jpg",
    "/Users/a1/PycharmProjects/medassistant/CV/benchmark/benchmark_cv/3.jpg",
    "/Users/a1/PycharmProjects/medassistant/CV/benchmark/benchmark_cv/4.jpg",
    "/Users/a1/PycharmProjects/medassistant/CV/benchmark/benchmark_cv/5.png",
    "/Users/a1/PycharmProjects/medassistant/CV/benchmark/benchmark_cv/6.jpeg",
    "/Users/a1/PycharmProjects/medassistant/CV/benchmark/benchmark_cv/7.jpg",
    "/Users/a1/PycharmProjects/medassistant/CV/benchmark/benchmark_cv/8.jpg",
    "/Users/a1/PycharmProjects/medassistant/CV/benchmark/benchmark_cv/9.jpg"
]

# Infinite loop
while True:
    # Select a random image file
    image_file = random.choice(image_files)

    # Construct the command
    command = [
        "python3", "DocumentOCR.py", image_file,
        "--save_path=output"
    ]

    # Execute the command
    print(f"Executing: {' '.join(command)}")
    subprocess.run(command)

    # Random sleep interval between 10 and 30 seconds
    sleep_time = random.randint(10, 30)
    print(f"Sleeping for {sleep_time} seconds...\n")
    time.sleep(sleep_time)
