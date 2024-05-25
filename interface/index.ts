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
  status: string;
  payer: object;
  paypalOrderId: string;
  email: string;
  total: number;
  createdAt: any;
  items: [];
}

export interface ITweetData {
  username: string;
  fullName: string;
  createdAt: string;
  content: string;
  profileImage: string;
  retweetCount: number;
  likeCount: string;
  commentCount: number;
}
