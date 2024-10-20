import SearchComponent from 'components/SearchComponent';
import React from 'react';
import PropsTypes from 'prop-types';

const SaleBDS = ({postsCate, url}) => {
  const searchParam = {
    types: 'bds-ban',
  };
  return (
    <SearchComponent
      searchParam={searchParam}
      postsCate={postsCate}
      url={url}
    />
  );
};

export default React.memo(SaleBDS);
SaleBDS.propTypes = {
  postsCate: PropsTypes.any,
  url: PropsTypes.any,
};
