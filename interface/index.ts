export enum Product {
  SHIRT = 'shirt',
  MUG = 'mug',
}

export enum ProductColor {
  BLACK = 'black',
  WHITE = 'white',
}

export enum ProductPrintSide {
  FRONT = 'Natpis naprijed',
  BACK = 'Natpis pozadi',
}

export interface ITweetData {
  userId: string;
  username: string;
  fullName: string;
  content: string;
  retweetCount: number;
  likeCount: string;
  commentCount: number;
}
