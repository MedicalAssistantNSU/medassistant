class CVException(Exception):
    """Base exception class for CV errors."""
    pass


class ImageReadError(CVException):
    """Raised when an image cannot be read."""
    pass


class OCRProcessError(CVException):
    """Raised when there is an error during the OCR process."""
    pass


class SaveError(CVException):
    """Raised when there is an error saving the OCR output."""
    pass
