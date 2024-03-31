import { createCanvas, loadImage } from 'canvas';
import { Rettiwt } from 'rettiwt-api';
import {
  extractTweetIdFromUrl,
  generateTweetImageBuffer,
  generateProductImageUrl,
  generateProductPrice,
} from '../helpers';

export const generateProductImagePreview = async (req: any, res: any) => {
  const rettiwt = new Rettiwt();

  const { product, tweetUrl, color, side } = req.query;
  const productImageUrl = generateProductImageUrl(product, color, side) || '';
  const productPrice = generateProductPrice(product);
  let tweetData = {
    userId: '',
    username: '',
    fullName: '',
    content: '',
    retweetCount: Math.floor(Math.random() * (150 - 50 + 1)) + 50,
    likeCount: (Math.random() * (3.0 - 1.0) + 1.0).toFixed(2),
    commentCount: Math.floor(Math.random() * (60 - 10 + 1)) + 10,
  };

  console.log(product, tweetUrl, color, side);

  try {
    const tweetDetails = await rettiwt.tweet.details(
      extractTweetIdFromUrl(tweetUrl)
    );

    tweetData.userId = tweetDetails.id;
    tweetData.username = tweetDetails.tweetBy.userName;
    tweetData.fullName = tweetDetails.tweetBy.fullName;
    tweetData.content = tweetDetails.fullText.replace(/\n/g, '');
  } catch (error) {
    console.log('Error fetching tweet details:', error);
    res
      .status(500)
      .json({ error: 'Link tvita koji si proslijedio nije validan' });

    return;
  }

  try {
    const tweetImageBuffer = await generateTweetImageBuffer(tweetData, color); //ovo je najsporije
    const [productImage, tweetImage] = await Promise.all([
      loadImage(productImageUrl),
      //@ts-ignore
      loadImage(tweetImageBuffer),
    ]);
    const canvas = createCanvas(productImage.width, productImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(productImage, 0, 0, canvas.width, canvas.height);

    const { tweetImageWidth, tweetImageHeight, tweetImageX, tweetImageY } =
      calculateTweetImagePosition(canvas, tweetImage);

    ctx.drawImage(
      tweetImage,
      tweetImageX,
      tweetImageY,
      tweetImageWidth,
      tweetImageHeight
    );

    const buffer = canvas.toBuffer();

    res.json({
      image: buffer.toString('base64'),
      pricePreview: productPrice,
    });
  } catch (error) {
    console.error('Error generating image:', error);
    res.status(500).json({ error: 'Greška prilikom kreiranja majice' });
  }
};

const calculateTweetImagePosition = (canvas: any, tweetImage: any) => {
  const tweetImageX = 162;
  const tweetImageY = 188;
  const tweetImageWidth = canvas.width;
  const tweetImageHeight =
    tweetImage.height * (tweetImageWidth / tweetImage.width);

  return {
    tweetImageWidth,
    tweetImageHeight,
    tweetImageX,
    tweetImageY,
  };
};
