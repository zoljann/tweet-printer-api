import { Request, Response } from 'express';
import { Schema, model } from 'mongoose';
import { IImage } from '../interface';

const imageSchema = new Schema<IImage>(
  {
    image: { type: String, required: true },
    tweetUrl: { type: String, required: true },
  },
  { versionKey: false }
);

const Image = model<IImage>('Image', imageSchema);

export const getAllImages = async (req: Request, res: Response) => {
  try {
    const images = await Image.find();

    res.json(images);
  } catch (error) {
    console.log('Failed to get images', error);
    res.status(500).json({ error: 'Neuspješno dohvaćanje slika' });
  }
};
