import htmlToImage from 'node-html-to-image';
import { transporter } from '../index';
import { Readable } from 'stream';
import {
  Product,
  ProductColor,
  ProductPrintSide,
  ITweetData,
} from '../interface';

export const generateProductPrice = (product: Product) => {
  if (product === Product.SHIRT) {
    return 30;
  } else if (product === Product.MUG) {
    return 20;
  }
};

export const calculateTotalPrice = (items: any, state: string) => {
  let total = 0;
  const shipping = state === 'BiH' ? 5 : 10;

  items.forEach((item: { product: Product }) => {
    if (item.product === Product.MUG) total += 20;
    else if (item.product === Product.SHIRT) total += 30;
  });

  return total + shipping;
};

export const extractTweetIdFromUrl = (tweetUrl: any) => {
  const cleanUrl = tweetUrl.split('?')[0];
  const match = cleanUrl.match(/\/(\d+)$/);

  return match ? match[1] : null;
};

export const formatTweetDataContent = (content: string) => {
  const emojiRegex =
    /[\u{1F600}-\u{1F64F}|\u{1F300}-\u{1F5FF}|\u{1F680}-\u{1F6FF}|\u{2600}-\u{26FF}|\u{2700}-\u{27BF}]/gu;
  const stringWithoutEmojis = content.replace(emojiRegex, '');
  const formattedContent = stringWithoutEmojis.replace(
    /(?:@[^\s]+)|(?:https?:\/\/\S+)|(?:http?:\/\/\S+)/g,
    ''
  );
  const contentWithLineBreaks = formattedContent.replace(/\n/g, '<br>');

  return contentWithLineBreaks.trim();
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

export const generateProductImageUrl = (
  product: Product,
  color: ProductColor,
  side: ProductPrintSide
) => {
  if (product === Product.SHIRT) {
    if (color === ProductColor.BLACK) {
      if (side === ProductPrintSide.FRONT) {
        return 'https://i.imgur.com/Cp2wyBj.jpg';
      } else if (side === ProductPrintSide.BACK) {
        return 'https://i.imgur.com/KyINBpL.jpg';
      }
    } else if (color === ProductColor.WHITE) {
      if (side === ProductPrintSide.FRONT) {
        return 'https://i.imgur.com/YDzuLdB.jpg';
      } else if (side === ProductPrintSide.BACK) {
        return 'https://i.imgur.com/X10RteB.jpg';
      }
    }
  } else if (product === Product.MUG) {
    if (color === ProductColor.BLACK) {
      return 'https://i.imgur.com/8zPfLJT.jpg';
    } else if (color === ProductColor.WHITE) {
      return 'https://i.imgur.com/oCH9WGT.jpg';
    }
  }
};

export const calculateTweetImagePosition = (
  canvas: any,
  tweetImage: any,
  product: Product
) => {
  let tweetImageX;
  let tweetImageY;
  let tweetImageWidth;
  let tweetImageHeight;

  if (product === Product.SHIRT) {
    tweetImageX = 165;
    tweetImageY = 188;
    tweetImageWidth = canvas.width / 1.95;
    tweetImageHeight = tweetImage.height * (tweetImageWidth / tweetImage.width);
  } else if (product === Product.MUG) {
    tweetImageX = 95;
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
          <div class="likes-count">${tweetData.likeCount}K</div>
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
    width: 350px;
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
    white-space: pre-line;
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
    opacity: 0.8;
  }
  .follow-button {
    position: absolute;
    right: 0;
    margin-right: 0.5rem;
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
          items,
          state
        )}KM</strong></span></span
      >
      <p>Adresa na koju šaljemo:</p>
      <ul>
        <li>Ime i prezime: ${name}</li>
        <li>Broj mobitela: ${mobileNumber}</li>
        <li>Adresa: ${state}, ${city}, ${address}</li>
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
  const attachments = [];

  items.forEach((item: any, index: number) => {
    const imageStream = new Readable();
    imageStream.push(Buffer.from(item.tweetImageBase64, 'base64'));
    imageStream.push(null);

    attachments.push({
      filename: `image_${index}.png`,
      content: imageStream,
      cid: `image_${index}`,
    });
  });

  const itemListHTML = items
    .map(
      (item: any, index: number) =>
        `<li>1x <strong>${formatProductName(
          item.product
        )}</strong> - ${formatColorName(item.color)}  ${
          item.product !== 'mug'
            ? `, ${item.printSide}, veličina ${item.size}`
            : ''
        }, tweet: ${
          item.tweetUrl
        }, slika:</li><br><img src="cid:image_${index}" alt="Tweet Image">`
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
          items,
          state
        )}KM</strong></span></span
      >
      <p>Adresa na koju se šalje:</p>
      <ul>
        <li>Ime i prezime: ${name}</li>
        <li>Broj mobitela: ${mobileNumber}</li>
        <li>Adresa: ${state}, ${city}, ${address}</li>
      </ul>
    </body>
  </html>
  `,
    attachments: attachments,
  });
};

export const sendConfirmationMailPaypal = async (
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
        Vaša narudžba je primljena i uspješno plaćena. Detalji:
      </div>
      <ul>
        ${itemListHTML}
      </ul>
      <span
        >Plaćeni iznos:
        <span style="color: tomato"><strong>${calculateTotalPrice(
          items,
          state
        )}KM / ${(calculateTotalPrice(items, state) * 0.52).toFixed(
      2
    )}€</strong></span></span
      >
      <p>Adresa na koju šaljemo:</p>
      <ul>
        <li>Ime i prezime: ${name}</li>
        <li>Broj mobitela: ${mobileNumber}</li>
        <li>Adresa: ${state}, ${city}, ${address}</li>
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

export const generatePaypalAccessToken = async () => {
  try {
    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ':' + process.env.PAYPAL_CLIENT_SECRET
    ).toString('base64');
    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`,
      {
        method: 'POST',
        body: 'grant_type=client_credentials',
        headers: {
          Authorization: `Basic ${auth}`,
        },
      }
    );

    const data = await response.json();

    return data.access_token;
  } catch (error) {
    console.error('Failed to generate Paypal access token:', error);
  }
};

export const createPaypalOrder = async (totalPrice: any) => {
  const accessToken = await generatePaypalAccessToken();

  try {
    const response = await fetch(
      `${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        method: 'POST',
        body: JSON.stringify({
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: (totalPrice * 0.52).toFixed(1),
              },
            },
          ],
          application_context: {
            shipping_preference: 'NO_SHIPPING',
          },
        }),
      }
    );

    let res = await response.json();

    if (!res.id) {
      console.log('Error creating paypal order', res);
    }

    return { paypalOrderCreated: true, orderId: res.id };
  } catch (error) {
    console.log('Error creating paypal order', error.message || error.code);
    return error;
  }
};
