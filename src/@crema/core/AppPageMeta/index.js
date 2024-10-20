import React from 'react';
import PropTypes from 'prop-types';
import {NextSeo} from 'next-seo';
import Logo from 'assets/img/land-logo-red.png';

const SITE_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://varsland.vn/';

const defaultTitle =
  'Chuyên trang thông tin Bất động sản uy tín - Thành viên Hiệp hội Bất động sản Việt Nam - Thành Viên Hội Môi Giới Bất Động Sản Việt Nam';
const defaultGenerator = 'CÔNG TY CỔ PHẦN CÔNG NGHỆ VARS VIỆT NAM';
const defaultKeywords =
  'VARs, VARS TECH, bđs, đăng tin bđs, rao vặt nhà đất, cộng đồng bđs, miễn phí, mua bán sát nhập, bất động sản, mua bán bất động sản, cho thuê bất động sản, mua bán nhà đất, bán đất nền, dự án bất động sản';
const defaultDescription =
  'Trang đăng tin Bất động sản | Thông tin quy hoạch Bất động sản | Tin Nhanh Bất động sản | Nhận định thị trường Bất động sản | Đào tạo môi giới Bất động sản | Cộng đồng môi giới Bất động sản';
const defaultImage = `${Logo.src}`;
const defaultTwitter =
  'Chuyên trang thông tin Bất động sản uy tín - Thành viên Hiệp hội Bất động sản Việt Nam - Thành Viên Hội Môi Giới Bất Động Sản Việt Nam';
const defaultSep = ' | ';
const AppPageMeta = ({children, ...rest}) => {
  const {title, description, image, category = 'VARs Land'} = rest;
  const theTitle = title
    ? title?.length > 48
      ? title
      : title + defaultSep + defaultTitle
    : defaultTitle;
  const theDescription = description
    ? description.substring(0, 155)
    : defaultDescription;
  const theImage = image ? `${Logo.src}` : defaultImage;

  return <>{children}</>;
};

export default AppPageMeta;

AppPageMeta.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};
