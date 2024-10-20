import React from 'react';
import PropsTypes from 'prop-types';
import DetailV2Component from 'components/DetailV2';

const Detail = ({
  url,
  postsData,
  relatedBottomData,
  newsData,
  isWaitingToken,
}) => {
  return (
    <>
      <DetailV2Component
        postsData={postsData}
        relatedBottomData={relatedBottomData}
        url={url}
        isWaitingToken={isWaitingToken}
        newsData={newsData}
      />
    </>
  );
};

export default Detail;
Detail.propTypes = {
  url: PropsTypes.any,
  isWaitingToken: PropsTypes.bool,
  postsData: PropsTypes.any,
  relatedBottomData: PropsTypes.any,
  newsData: PropsTypes.array,
  pageType: PropsTypes.any,
};
