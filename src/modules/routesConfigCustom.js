import Link from 'next/link';
const routesConfigCustom = [
  {
    label: <Link href='/'>Trang chủ</Link>,
    key: 'home',
  },
  {
    label: <Link href='/du-an'>Dự án</Link>,
    key: 'du-an',
  },
  {
    label: <Link href='/bds-ban'>Mua bán</Link>,
    key: 'bds-ban',
  },
  {
    label: <Link href='/bds-cho-thue'>Cho thuê</Link>,
    key: 'bds-cho-thue',
  },
  {
    label: <Link href='/m-a'>Mua bán - Sáp nhập (M&A)</Link>,
    key: 'm-a',
  },
  {
    label: <Link href='https://news.vars.vn/'>Tin tức</Link>,
    key: 'news',
  },
];
export default routesConfigCustom;
