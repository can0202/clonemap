import React from 'react';
import PropTypes from 'prop-types';
import HomeComponent from 'components/Home';

const Home = ({
  url,
  menus,
  subCate,
  postsData,
  topData,
  realEstateData,
  reportData,
  varsRealData,
  realEstateBigData,
  newsData,
  sectionConfig,
  representativesData,
  categoryFooter,
  provinces,
}) => {
  return (
    <HomeComponent
      url={url}
      menus={menus}
      subCate={subCate}
      postsData={postsData}
      topData={topData}
      realEstateData={realEstateData}
      reportData={reportData}
      varsRealData={varsRealData}
      realEstateBigData={realEstateBigData}
      newsData={newsData}
      sectionConfig={sectionConfig}
      representativesData={representativesData}
      categoryFooter={categoryFooter}
      provinces={provinces}
    />
  );
};
export default Home;
Home.propTypes = {
  url: PropTypes.any,
  menus: PropTypes.any,
  subCate: PropTypes.any,
  postsData: PropTypes.any,
  topData: PropTypes.any,
  realEstateData: PropTypes.any,
  reportData: PropTypes.any,
  varsRealData: PropTypes.any,
  realEstateBigData: PropTypes.any,
  newsData: PropTypes.any,
  sectionConfig: PropTypes.any,
  representativesData: PropTypes.any,
  categoryFooter: PropTypes.any,
  provinces: PropTypes.any,
};
