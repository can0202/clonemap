import SearchComponent from 'components/SearchComponent';
import React from 'react';
import PropsTypes from 'prop-types';

const MaBDS = ({postsCate, url}) => {
  const searchParam = {
    types: 'm-a',
  };
  return (
    <SearchComponent
      searchParam={searchParam}
      postsCate={postsCate}
      url={url}
    />
  );
};

export default React.memo(MaBDS);
MaBDS.propTypes = {
  postsCate: PropsTypes.any,
  url: PropsTypes.any,
};
