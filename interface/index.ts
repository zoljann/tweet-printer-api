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

export interface IOrder {
  name: string;
  mobileNumber: string;
  state: string;
  city: string;
  address: string;
  shipping: string;
  total: number;
  items: [];
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
