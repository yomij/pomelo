export function readImage(src: string, width: number, height: number): Promise<ImageData> {
  const { ctx2D} = createCanvas(width, height)
  const image = new Image();
  image.src = src;

  return new Promise((resolve, reject) => {
    image.onload = () => {
      console.log('onload')
      ctx2D.drawImage(image, 0, 0, width, height);
      const imageData = ctx2D.getImageData(0,0, width, height);
      console.log(imageData)
      resolve(imageData)
    };
    image.onerror = reject
  })
}

export function drawImage (
  pixels: Uint8ClampedArray = new Uint8ClampedArray([]),
  width: number,
  height: number
) {
  const { canvas, ctx2D } = createCanvas(width, height)
  const imageData = new ImageData(pixels, width, height);
  ctx2D.putImageData(imageData, 0, 0);
  return canvas
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
    // pixels[i + 3] = 255
  }
  return new ImageData(pixels, img.width, img.height)
}

function createCanvas(width: number, height: number) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return {
    canvas,
    ctx2D: canvas.getContext('2d')
  }
}
