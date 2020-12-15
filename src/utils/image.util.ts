export function readImage(src: string, width: number, height: number): Promise<ImageData> {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const image = new Image();
  image.src = src;
  return new Promise((resolve, reject) => {
    image.onload = () => {
      ctx.drawImage(image, 0, 0, width, height);
      const imageData = ctx.getImageData(0,0, width, height);
      resolve(imageData)
    };
    image.onerror = reject
  })
}

export function grayscale(R: number, G: number, B: number) {
  return (R * 19595 + G * 38469 + B * 7472) >> 16
}

export function getGrayscaleImage(img: ImageData): ImageData {
  let pixels: Uint8ClampedArray = new Uint8ClampedArray(img.data.length)
  for (let i = img.data.length; i >= 0; i -= 4) {
    pixels[i] = pixels[i + 1] = pixels[i + 2] = grayscale(
      img.data[i],
      img.data[i + 1],
      img.data[i + 2]
    )
    pixels[i + 3] = 255
  }
  return new ImageData(pixels, img.width, img.height)
}
