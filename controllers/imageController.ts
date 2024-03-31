import { createCanvas, loadImage } from 'canvas';
import { Product, ProductColor, ProductPrintSide } from '../interface';
import { Rettiwt } from 'rettiwt-api';

export const generateProductImagePreview = async (req: any, res: any) => {
  const rettiwt = new Rettiwt();
  const { product, tweetUrl, color, side } = req.query;

  console.log(product, tweetUrl, color, side);

  let imageUrl = '';
  let productPrice;
  let tweetData = {
    username: '',
    fullName: '',
    content: '',
    retweetCount: 0,
    likeCount: 0,
  };

  try {
    const tweetDetails = await rettiwt.tweet.details(
      extractTweetIdFromUrl(tweetUrl)
    );
    tweetData.username = tweetDetails.tweetBy.userName;
    tweetData.fullName = tweetDetails.tweetBy.fullName;
    tweetData.content = tweetDetails.fullText.replace(/\n/g, '');
    tweetData.retweetCount = tweetDetails.retweetCount;
    tweetData.likeCount = tweetDetails.likeCount;

    console.log(tweetData);
  } catch (error) {
    console.log('Error fetching tweet details:', error);
    res
      .status(500)
      .json({ error: 'Link tvita koji si proslijedio nije validan' });

    return;
  }

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

    const buffer = canvas.toBuffer();

    res.json({ image: buffer.toString('base64'), pricePreview: productPrice });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Greška prilikom kreiranja majice' });
  }
};

const extractTweetIdFromUrl = (tweetUrl: any) => {
  const match = tweetUrl.match(/\/(\d+)$/);

  return match ? match[1] : null;
};
