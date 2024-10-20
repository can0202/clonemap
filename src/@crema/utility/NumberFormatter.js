// Format number tỷ / triệu
export const nFormatter = (num) => {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + ' tỷ';
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, '') + ' triệu';
  }
  return num;
};

// Format price (.)
export const currencyFormat = (number) => {
  let formattedNumber = 'err';
  formattedNumber = parseInt(number).toLocaleString('vi-VN');
  return formattedNumber;
};
