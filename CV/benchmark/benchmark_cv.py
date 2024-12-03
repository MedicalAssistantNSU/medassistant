import json
import sys
import os
from nltk.metrics.distance import edit_distance

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from DocumentOCR import DocumentOCR  # noqa: E402

# Paths
images_folder = "benchmark_cv"
true_text_file = "true_labels.txt"
results_file = "benchmark_results.json"


# Normalize text
def normalize_text(text):
    return ' '.join(text.lower().split())


# Calculate metrics
def calculate_metrics(true_text, detected_text):
    true_text_norm = normalize_text(true_text)
    detected_text_norm = normalize_text(detected_text)

    cer = edit_distance(true_text_norm, detected_text_norm) / max(len(true_text_norm), 1)
    true_words = true_text_norm.split()
    detected_words = detected_text_norm.split()
    wer = edit_distance(true_words, detected_words) / max(len(true_words), 1)
    exact_match = true_text_norm == detected_text_norm
    lev_distance = edit_distance(true_text_norm, detected_text_norm)

    return {
        "Character Error Rate (CER)": cer,
        "Word Error Rate (WER)": wer,
        "Exact Match Accuracy": exact_match,
        "Edit Distance": lev_distance
    }


# Read true text for images
with open(true_text_file, 'r') as f:
    true_texts = {line.split(' ')[0]: ' '.join(line.split(' ')[1:]) for line in f.readlines()}

# Initialize the OCR processor
ocr_processor = DocumentOCR(save_path="../user_save_path")

# Process images
results = {}
for image_file in os.listdir(images_folder):
    if image_file.lower().endswith(('.png', '.jpg', '.jpeg', '.tiff', '.bmp', '.gif')):
        image_path = os.path.join(images_folder, image_file)
        image_name = os.path.basename(image_path)

        try:
            # Perform OCR
            detected_text = ocr_processor.run(image_path)

            # Normalize detected text
            detected_text = normalize_text(detected_text)

            # Get true text
            true_text = true_texts.get(image_name, "")

            # Calculate metrics
            metrics = calculate_metrics(true_text, detected_text)
            results[image_name] = metrics

        except Exception as e:
            error_message = str(e).strip().lower()
            if "edge density" in error_message:
                results[image_name] = "failed, blurry"
            else:
                results[image_name] = f"error: {error_message}"

# Save results
with open(results_file, 'w') as f:
    json.dump(results, f, indent=4)

print(f"Benchmark results saved to {results_file}")
