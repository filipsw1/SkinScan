import numpy as np
from PIL import Image
import io

IMG_SIZE = 128


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """
    Preprocesses an uploaded image identically to how training images
    were processed (see load_and_preprocess in training.ipynb).
    Takes raw image bytes, returns a batch-ready array shaped
    (1, 128, 128, 3), values in [0, 1], float32.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((IMG_SIZE, IMG_SIZE))
    arr = np.array(img, dtype=np.float32) / 255.0
    return np.expand_dims(arr, axis=0)