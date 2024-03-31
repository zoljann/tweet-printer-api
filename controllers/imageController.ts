import { createCanvas, loadImage } from 'canvas';
import { Product, ProductColor, ProductPrintSide } from '../interface';

export const generateProductImagePreview = async (req: any, res: any) => {
  const { product, tweetUrl, color, side } = req.query;

  console.log(product, tweetUrl, color, side);

  //potrazi tweetUrl na apiju ako ne nadjes vrati nie dobar u try catch isto

  let imageUrl = '';
  let productPrice;

  if (product === Product.SHIRT) {
    productPrice = 35;

    if (color === ProductColor.BLACK) {
      if (side === ProductPrintSide.FRONT) {
        imageUrl = 'https://i.imgur.com/Cp2wyBj.jpg';
      } else if (side === ProductPrintSide.BACK) {
        imageUrl = 'https://i.imgur.com/KyINBpL.jpg';
      }
    } else if (color === ProductColor.WHITE) {
      if (side === ProductPrintSide.FRONT) {
        imageUrl = 'https://i.imgur.com/YDzuLdB.jpg';
      } else if (side === ProductPrintSide.BACK) {
        imageUrl = 'https://i.imgur.com/X10RteB.jpg';
      }
    }
  } else if (product === Product.MUG) {
    productPrice = 20;
    if (color === ProductColor.BLACK) {
      imageUrl = 'https://i.imgur.com/8zPfLJT.jpg';
    } else if (color === ProductColor.WHITE) {
      imageUrl = 'https://i.imgur.com/oCH9WGT.jpg';
    }
  }

  try {
    const image = await loadImage(imageUrl);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

    // Na majici
    const externalImage = await loadImage('https://i.imgur.com/IlWwkq3.jpg');

    // Calculate text width
    const x = (canvas.width - externalImage.width) / 2;
    const y = (canvas.height - externalImage.height) / 2;

    ctx.drawImage(externalImage, x, y);

    const buffer = canvas.toBuffer();

    res.json({ image: buffer.toString('base64'), pricePreview: productPrice });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Error while generating image' });
  }
};
