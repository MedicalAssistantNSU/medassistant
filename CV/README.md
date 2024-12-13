# DocumentOCR Exit Codes Documentation

This documentation explains the exit codes used in the **DocumentOCR** script. These codes are emitted when the script encounters specific errors, providing valuable insights for debugging and error handling.

---

## **Exit Codes and Their Meaning**

| Exit Code | Error Type           | Description                                                                 |
|-----------|----------------------|-----------------------------------------------------------------------------|
| **2**     | `OCRProcessError`    | General OCR processing error. This may occur in the following scenarios:    |
|           |                      | - Initialization of the EasyOCR reader fails.                              |
|           |                      | - Errors occur during OCR text extraction.                                 |
| **3**     | `ImageReadError`     | The input image file cannot be read.                                        |
|           |                      | - The file path is incorrect, or the file does not exist.                  |
|           |                      | - The file format is unsupported.                                          |
| **4**     | `BlurryTextError`    | The image contains blurry or unreadable text, detected via edge density.   |
| **5**     | `SaveError`          | Failed to save the detected text to the specified output file or directory. |
|           |                      | - Possible causes: insufficient permissions or invalid save path.          |
| **6**     | `CVException`        | A general error occurred during the OpenCV preprocessing pipeline.         |
|           |                      | - This may include image corruption or unexpected OpenCV errors.           |

---

## **When Exit Codes Occur**

### **Exit Code 2: OCRProcessError**
- **Causes:**
  - EasyOCR reader initialization failed due to missing dependencies or incorrect configurations.
  - OCR failed to extract text from the preprocessed image.
- **Suggested Fix:**
  - Ensure EasyOCR is installed and functional.
  - Verify the image clarity and format.

### **Exit Code 3: ImageReadError**
- **Causes:**
  - Image file path is incorrect or the file does not exist.
  - The file format is not supported by OpenCV.
- **Suggested Fix:**
  - Check the input file path and ensure the image is accessible.
  - Convert the image to a compatible format (e.g., PNG, JPEG).

### **Exit Code 4: BlurryTextError**
- **Causes:**
  - The text on the image is blurry, making OCR processing ineffective.
- **Suggested Fix:**
  - Use a sharper image with clearer text.

### **Exit Code 5: SaveError**
- **Causes:**
  - The script could not save the detected text to the specified file.
  - This could be due to insufficient write permissions or an invalid directory.
- **Suggested Fix:**
  - Check the output directory and ensure you have write permissions.

### **Exit Code 6: CVException**
- **Causes:**
  - General errors in the OpenCV preprocessing steps, such as:
    - Corrupted image data.
    - Unexpected exceptions during grayscale conversion, blurring, or edge detection.
- **Suggested Fix:**
  - Validate the image integrity before processing.

---

## **How to Handle Exit Codes in Parent Scripts**

If you are calling the **DocumentOCR** module from another script, you can catch and handle the `SystemExit` exceptions to log or take appropriate actions without terminating the entire program. Example:

```python
import sys
from DocumentOCR import DocumentOCR

try:
    ocr_processor = DocumentOCR(save_path="output_directory")
    detected_text = ocr_processor.run("path_to_image.jpg")
except SystemExit as e:
    exit_code = e.code
    print(f"Error occurred. Exit code: {exit_code}")
    # Handle specific errors based on exit codes
    if exit_code == 3:
        print("Image file could not be read. Please check the file path.")
    elif exit_code == 4:
        print("The image text is too blurry to process.")
    elif exit_code == 5:
        print("Failed to save the detected text.")
```

---

## **Contact**

For additional support, provide the error code and logs to the development team.