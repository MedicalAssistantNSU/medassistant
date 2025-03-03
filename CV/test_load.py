import random
import time
import subprocess

# List of image files
image_files = [
    "benchmark/benchmark_cv/1.jpeg",
    "benchmark/benchmark_cv/2.jpg",
    "benchmark/benchmark_cv/3.jpg",
    "benchmark/benchmark_cv/4.jpg",
    "benchmark/benchmark_cv/5.png",
    "benchmark/benchmark_cv/6.jpeg",
    "benchmark/benchmark_cv/7.jpg",
    "benchmark/benchmark_cv/8.jpg",
    "benchmark/benchmark_cv/9.jpg"
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

    # Random sleep interval between 1 and 10 seconds
    sleep_time = random.randint(1, 10)
    print(f"Sleeping for {sleep_time} seconds...\n")
    time.sleep(sleep_time)
