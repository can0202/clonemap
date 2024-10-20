import SearchComponent from 'components/SearchComponent';
import React from 'react';
import PropsTypes from 'prop-types';

const RentBDS = ({postsCate, url}) => {
  const searchParam = {
    types: 'bds-cho-thue',
  };
  return (
    <SearchComponent
      searchParam={searchParam}
      postsCate={postsCate}
      url={url}
    />
  );
};

export default React.memo(RentBDS);
RentBDS.propTypes = {
  postsCate: PropsTypes.any,
  url: PropsTypes.any,
};
