import htmlToImage from 'node-html-to-image';
import {
  Product,
  ProductColor,
  ProductPrintSide,
  ITweetData,
} from '../interface';

export const extractTweetIdFromUrl = (tweetUrl: any) => {
  const match = tweetUrl.match(/\/(\d+)$/);

  return match ? match[1] : null;
};

export async function generateTweetImageBuffer(
  tweetData: ITweetData,
  productColor: ProductColor
): Promise<void> {
  const image = await htmlToImage({
    html: createHtmlFromTweetData(tweetData, productColor),
    transparent: true,
  });

  // @ts-ignore
  return image;
}

export const generateProductPrice = (product: Product) => {
  let productPrice;

  if (product === Product.SHIRT) {
    return (productPrice = 45);
  } else if (product === Product.MUG) {
    return (productPrice = 20);
  }
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

export const createHtmlFromTweetData = (
  tweetData: ITweetData,
  productColor: ProductColor
) => {
  let textColorStyle;

  if (productColor === ProductColor.BLACK) {
    textColorStyle = 'color: white;';
  } else if (productColor === ProductColor.WHITE) {
    textColorStyle = 'color: black;';
  }

  const htmlContent: string = `
    <div class="tweet-wrap" style="${textColorStyle}">
    <div class="tweet-header">
      <img
        src="https://pbs.twimg.com/profile_images/1012717264108318722/9lP-d2yM_400x400.jpg"
        class="avatar"
      />
      <div class="tweet-header-info">
        <span>${tweetData.fullName}</span>
        <div>@${tweetData.username}</div>
        </div>
        </div>
     <p class="tweet-header-content">
        ${tweetData.content}
     </p>
    <div class="tweet-info-counts">
      <div class="comments">
        <svg
          class="feather feather-message-circle sc-dnqmqq jxshSx"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
          ></path>
        </svg>
        <div class="comment-count">${tweetData.commentCount}</div>
      </div>
  
      <div class="retweets">
        <svg
          class="feather feather-repeat sc-dnqmqq jxshSx"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <polyline points="17 1 21 5 17 9"></polyline>
          <path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
          <polyline points="7 23 3 19 7 15"></polyline>
          <path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
        </svg>
        <div class="retweet-count">${tweetData.retweetCount}</div>
      </div>
  
      <div class="likes">
        <svg
          class="feather feather-heart sc-dnqmqq jxshSx"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path
            d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
          ></path>
        </svg>
        <div class="likes-count">${tweetData.likeCount}k</div>
      </div>
  
      <div class="message">
        <svg
          class="feather feather-send sc-dnqmqq jxshSx"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <line x1="22" y1="2" x2="11" y2="13"></line>
          <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
        </svg>
      </div>
    </div>
  </div>
  `;

  const cssStyles: string = `
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
    margin-top: 20px;
  }
  .tweet-info-counts div {
    display: flex;
    margin-right: 20px;
  }
  .tweet-info-counts div svg {
    color: #657786;
    margin-right: 10px;
  }
  `;

  return `<style>${cssStyles}</style>${htmlContent}`;
};
