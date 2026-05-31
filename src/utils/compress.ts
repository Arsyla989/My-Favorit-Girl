/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Compresses an image Base64 string to a lower resolution and quality to save localStorage space.
 * Default max width/height is 800px, quality 0.7.
 */
export function compressImage(base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> {
  return new Promise((resolve) => {
    // If it's not a data URL or it's SVGs/gifs, return as-is
    if (!base64Str.startsWith('data:image/')) {
      resolve(base64Str);
      return;
    }

    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Keep aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        // Compress as JPEG with 0.75 quality for a great balance of size (usually 60-150KB) and visual clarity
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.75);
        resolve(compressedBase64);
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
}
