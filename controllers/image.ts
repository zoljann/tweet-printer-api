import { Router } from 'express';
import { createCanvas, loadImage } from 'canvas';

const router = Router();

enum Product {
  SHIRT = 'shirt',
  MUG = 'mug',
}

enum ProductColor {
  BLACK = 'black',
  WHITE = 'white',
}

router.get('/generate', async (req, res) => {
  const { product, tweetUrl, color } = req.query;

  console.log(product, tweetUrl, color);

  //potrazi tweetUrl na apiju ako ne nadjes vrati nie dobar u try catch isto

  let imageUrl = '';

  if (product === Product.SHIRT) {
    if (color === ProductColor.BLACK) {
      imageUrl = 'https://i.imgur.com/LwYY1i9.jpg';
    } else if (color === ProductColor.WHITE) {
      imageUrl = 'https://i.imgur.com/5dSN2Hr.jpg';
    }
  } else if (product === Product.MUG) {
    imageUrl = 'https://i.imgur.com/5dSN2Hr.jpg'; //handle mug
  }

  try {
    const image = await loadImage(imageUrl);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Na majici
    const text = 'MAJICA 50 MARAKA';
    ctx.fillStyle = color === ProductColor.BLACK ? 'white' : 'black';
    ctx.font = '50px Arial';

    // Calculate text width
    const textWidth = ctx.measureText(text).width;
    const x = (canvas.width - textWidth) / 2;
    const y = canvas.height / 2;
    ctx.fillText(text, x, y);

    const buffer = canvas.toBuffer();

    res.json({ image: buffer.toString('base64') });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Error while generating image' });
  }
});

export default router;
