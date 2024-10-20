import DetailComponent from 'components/Details';
import React from 'react';
import PropsTypes from 'prop-types';

const DetailMa = ({
  postsData,
  relatedBottomData,
  isWaitingToken,
  url,
  newsData,
}) => {
  return (
    <DetailComponent
      postsData={postsData}
      relatedBottomData={relatedBottomData}
      isWaitingToken={isWaitingToken}
      url={url}
      newsData={newsData}
    />
  );
};

export default DetailMa;
DetailMa.propTypes = {
  postsData: PropsTypes.any,
  relatedBottomData: PropsTypes.any,
  isWaitingToken: PropsTypes.bool,
  url: PropsTypes.string,
  newsData: PropsTypes.any,
};
