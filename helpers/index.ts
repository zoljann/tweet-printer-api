import htmlToImage from 'node-html-to-image';
import { transporter } from '../index';
import {
  Product,
  ProductColor,
  ProductPrintSide,
  ITweetData,
} from '../interface';

export const extractTweetIdFromUrl = (tweetUrl: any) => {
  const cleanUrl = tweetUrl.split('?')[0];
  const match = cleanUrl.match(/\/(\d+)$/);

  return match ? match[1] : null;
};

export const formatTweetDataContent = (content: string) => {
  const formattedContent = content.replace(
    /(?:@[^\s]+)|(?:https?:\/\/\S+)|(?:http?:\/\/\S+)/g,
    ''
  );

  return formattedContent.trim();
};

export const formatCreatedAtDate = (dateString: string) => {
  const date = new Date(dateString);

  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const day = date.getUTCDate().toString().padStart(2, '0');
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = date.getUTCFullYear().toString().slice(-2);

  return `${hours}:${minutes} ‧ ${month}/${day}/${year}`;
};

export async function generateTweetImageBuffer(
  tweetData: ITweetData,
  productColor: ProductColor
): Promise<void> {
  try {
    const image = await htmlToImage({
      html: createHtmlFromTweetData(tweetData, productColor),
      transparent: true,
      puppeteerArgs: {
        args: [
          `--no-sandbox`,
          `--headless`,
          `--disable-gpu`,
          `--disable-dev-shm-usage`,
        ],
        defaultViewport: {
          width: 400,
          height: 300,
        },
      },
    });

    // @ts-ignore
    return image;
  } catch (error: any) {
    console.log('Error converting html to image:', error?.data || error);
  }
}
export const generateProductPrice = (product: Product) => {
  let productPrice;

  if (product === Product.SHIRT) {
    return (productPrice = 45);
  } else if (product === Product.MUG) {
    return (productPrice = 20);
  }
};

export const calculateTotalPrice = (items: any) => {
  let total = 0;

  items.forEach((item: { product: Product }) => {
    if (item.product === Product.MUG) total += 20;
    else if (item.product === Product.SHIRT) total += 45;
  });

  return total;
};

export const generateProductImageUrl = (
  product: Product,
  color: ProductColor,
  side: ProductPrintSide
) => {
  let productImageUrl;

  if (product === Product.SHIRT) {
    if (color === ProductColor.BLACK) {
      if (side === ProductPrintSide.FRONT) {
        return (productImageUrl = 'https://i.imgur.com/Cp2wyBj.jpg');
      } else if (side === ProductPrintSide.BACK) {
        return (productImageUrl = 'https://i.imgur.com/KyINBpL.jpg');
      }
    } else if (color === ProductColor.WHITE) {
      if (side === ProductPrintSide.FRONT) {
        return (productImageUrl = 'https://i.imgur.com/YDzuLdB.jpg');
      } else if (side === ProductPrintSide.BACK) {
        return (productImageUrl = 'https://i.imgur.com/X10RteB.jpg');
      }
    }
  } else if (product === Product.MUG) {
    if (color === ProductColor.BLACK) {
      return (productImageUrl = 'https://i.imgur.com/8zPfLJT.jpg');
    } else if (color === ProductColor.WHITE) {
      return (productImageUrl = 'https://i.imgur.com/oCH9WGT.jpg');
    }
  }
};

export const calculateTweetImagePosition = (
  canvas: any,
  tweetImage: any,
  product: Product
) => {
  let tweetImageX = 135;
  let tweetImageY = 188;
  let tweetImageWidth = canvas.width;
  let tweetImageHeight =
    tweetImage.height * (tweetImageWidth / tweetImage.width);

  if (product === Product.SHIRT) {
    tweetImageX = 155;
    tweetImageY = 188;
    tweetImageWidth = canvas.width / 1.95;
    tweetImageHeight = tweetImage.height * (tweetImageWidth / tweetImage.width);
  } else if (product === Product.MUG) {
    tweetImageX = 85;
    tweetImageY = 185;
    tweetImageWidth = canvas.width * 0.45;
    tweetImageHeight = tweetImage.height * (tweetImageWidth / tweetImage.width);
  }

  return {
    tweetImageWidth,
    tweetImageHeight,
    tweetImageX,
    tweetImageY,
  };
};

export const createHtmlFromTweetData = (
  tweetData: ITweetData,
  productColor: ProductColor
): string => {
  const textColor = productColor === ProductColor.BLACK ? 'white' : 'black';

  const htmlContent = `
    <div class="tweet-wrap" style="color: ${textColor};">
      <div class="tweet-header">
        <img src="${tweetData.profileImage}" class="avatar"/>
        <div class="tweet-header-info">
          <span>${tweetData.fullName}</span>
          <div>@${tweetData.username}</div>
        </div>
        <button class="follow-button">Follow</button>
      </div>
      <p class="tweet-header-content">${tweetData.content}</p>
      <div class="date-time">${tweetData.createdAt}</div>
      <div class="tweet-info-counts">
        <div class="comments">
          <svg class="feather feather-message-circle sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
          </svg>
          <div class="comment-count">${tweetData.commentCount}</div>
        </div>
        <div class="retweets">
          <svg class="feather feather-repeat sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="17 1 21 5 17 9"></polyline>
            <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
            <polyline points="7 23 3 19 7 15"></polyline>
            <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
          </svg>
          <div class="retweet-count">${tweetData.retweetCount}</div>
        </div>
        <div class="likes">
          <svg class="feather feather-heart sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <div class="likes-count">${tweetData.likeCount}k</div>
        </div>
        <div class="message">
          <svg class="feather feather-send sc-dnqmqq jxshSx" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <line x1="22" y1="2" x2="11" y2="13"></line>
            <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
          </svg>
        </div>
      </div>
    </div>`;

  const cssStyles = `
  .avatar {
    border-radius: 100px;
    width: 48px;
    margin-right: 15px;
  }
  .tweet-wrap {
    width: 380px;
    font-family: Arial, Helvetica, sans-serif;
  }
  .tweet-header {
    display: flex;
    align-items: center;
    position: relative;
    font-size: 14px;
  }
  .tweet-header-info span {
    font-weight: bold;
  }
  .tweet-header-info div {
    opacity: 0.7;
  }
  .tweet-header-content {
    margin-top: 10px;
    margin-bottom: 0;
  }
  .tweet-info-counts {
    display: flex;
    margin-top: 10px;
  }
  .tweet-info-counts div {
    display: flex;
    margin-right: 20px;
  }
  .tweet-info-counts div svg {
    color: #657786;
    margin-right: 6px;
  }
  .comment-count,
  .retweet-count,
  .likes-count {
    font-size: 14px;
  }
  .follow-button {
    position: absolute;
    right: 0;
    margin-right: 1.5rem;
    border: none;
    outline: none;
    padding: 5px 12px;
    font-size: 16px;
    border-radius: 20px;
    background-color: transparent;
    border: 1px solid #146ba1;
    color: #146ba1;
    font-weight: bold;
    font-size: 14px;
  }
  .date-time {
    margin-top: 10px;
    font-size: 12px;
    opacity: 0.7;
  }`;

  return `<style>${cssStyles}</style>${htmlContent}`;
};

export const formatProductName = (product: Product) => {
  switch (product) {
    case Product.SHIRT:
      return 'Majica';
    case Product.MUG:
      return 'Šolja';
  }
};

export const formatColorName = (color: ProductColor) => {
  switch (color) {
    case ProductColor.BLACK:
      return 'Crna';
    case ProductColor.WHITE:
      return 'Bijela';
  }
};

export const sendConfirmationMail = async (
  email: string,
  items: any,
  name: string,
  mobileNumber: string,
  state: string,
  city: string,
  address: string
) => {
  const itemListHTML = items
    .map(
      (item: any) =>
        `<li>1x <strong>${formatProductName(
          item.product
        )}</strong> - ${formatColorName(item.color)}  ${
          item.product !== 'mug'
            ? `, ${item.printSide}, veličina ${item.size}`
            : ''
        }, tweet: ${item.tweetUrl}`
    )
    .join('');

  await transporter.sendMail({
    from: 'isprintajsvojtvit@gmail.com',
    to: email,
    subject: 'Potvrda narudžbe - @isprintajsvojtvit',
    text: 'Potvrda narudžbe',
    html: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
      <h2 style="color: #007bff">Potvrda narudžbe</h2>
      <div>Dragi/a ${name},</div>
      <div>
        Vaša narudžba je uspješno primljena i u procesu obrade. Detalji:
      </div>
      <ul>
        ${itemListHTML}
      </ul>
      <span
        >Ukupna cijena sa dostavom:
        <span style="color: tomato"><strong>${calculateTotalPrice(
          items
        )}KM</strong></span></span
      >
      <p>Adresa na koju šaljemo:</p>
      <ul>
        <li>${name}</li>
        <li>${mobileNumber}</li>
        <li>${state}, ${city}, ${address}</li>
      </ul>
      <p>
        Ukoliko bilo što od ovoga nije tačno molimo te da nam odgovoriš na ovaj
        mail ili kontaktiraš na instagramu
        <a
          style="color: tomato"
          href="https://www.instagram.com/isprintajsvojtvit"
          target="_blank"
          >@isprintajsvojtvit</a
        >.
      </p>
      <div>Srdačan pozdrav,</div>
      <div>@isprintajsvojtvit team</div>
    </body>
  </html>
  `,
  });
};

export const sendConfirmationMailToEmployee = async (
  email: string,
  items: any,
  name: string,
  mobileNumber: string,
  state: string,
  city: string,
  address: string
) => {
  const itemListHTML = items
    .map(
      (item: any) =>
        `<li>1x <strong>${formatProductName(
          item.product
        )}</strong> - ${formatColorName(item.color)}  ${
          item.product !== 'mug'
            ? `, ${item.printSide}, veličina ${item.size}`
            : ''
        }, tweet: ${item.tweetUrl}, base64: ${item.tweetImageBase64}</li><br>`
    )
    .join('');

  await transporter.sendMail({
    from: 'isprintajsvojtvit@gmail.com',
    to: email,
    subject: 'Pristigla narudžba',
    text: 'Pristigla narudžba',
    html: `<!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </head>
    <body>
      <h2 style="color: #007bff">Pristigla narudžba</h2>
      <div>
       Zaprimljena je narudžba. Detalji:
      </div>
      <ul>
        ${itemListHTML}
      </ul>
      <span
        >Ukupna cijena sa dostavom:
        <span style="color: tomato"><strong>${calculateTotalPrice(
          items
        )}KM</strong></span></span
      >
      <p>Adresa na koju se šalje:</p>
      <ul>
        <li>${name}</li>
        <li>${mobileNumber}</li>
        <li>${state}, ${city}, ${address}</li>
      </ul>
    </body>
  </html>
  `,
  });
};
