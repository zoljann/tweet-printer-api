import { Response } from 'express';
import { createCanvas, loadImage } from 'canvas';
import { Rettiwt } from 'rettiwt-api';
import {
  extractTweetIdFromUrl,
  generateTweetImageBuffer,
  generateProductImageUrl,
  generateProductPrice,
  calculateTweetImagePosition,
  formatTweetDataContent,
} from '../helpers';

export const generateProductImagePreview = async (req: any, res: Response) => {
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

  try {
    const tweetDetails = await rettiwt.tweet.details(
      extractTweetIdFromUrl(tweetUrl)
    );

    tweetData.userId = tweetDetails.id;
    tweetData.username = tweetDetails.tweetBy.userName;
    tweetData.fullName = tweetDetails.tweetBy.fullName;
    tweetData.content = formatTweetDataContent(tweetDetails.fullText);
  } catch (error: any) {
    console.log('Error fetching tweet details:', error?.data || error);
    res.status(500).json({ error });

    return;
  }

  try {
    const tweetImageBuffer = await generateTweetImageBuffer(tweetData, color);
    const [productImage, tweetImage] = await Promise.all([
      loadImage(productImageUrl),
      //@ts-ignore
      loadImage(tweetImageBuffer),
    ]);
    const canvas = createCanvas(productImage.width, productImage.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(productImage, 0, 0, canvas.width, canvas.height);

    const { tweetImageWidth, tweetImageHeight, tweetImageX, tweetImageY } =
      calculateTweetImagePosition(canvas, tweetImage, product);

    ctx.drawImage(
      tweetImage,
      tweetImageX,
      tweetImageY,
      tweetImageWidth,
      tweetImageHeight
    );

    res.json({
      image: canvas.toBuffer().toString('base64'),
      pricePreview: productPrice,
    });
  } catch (error: any) {
    console.log('Error generating image preview:', error?.data || error);
    res.status(500).json({ error });
  }
};
