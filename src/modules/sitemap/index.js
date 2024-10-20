import React from 'react';
import PropTypes from 'prop-types';
import SiteMapComponent from 'components/SiteMap';

const SiteMap = ({url, sitemapConfig}) => {
  return <SiteMapComponent url={url} sitemapConfig={sitemapConfig} />;
};
export default SiteMap;
SiteMap.propTypes = {
  url: PropTypes.any,
  sitemapConfig: PropTypes.any,
};
