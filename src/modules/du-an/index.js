import React from 'react';
import SearchComponent from 'components/SearchComponent';
import PropsTypes from 'prop-types';

const Project = ({postsCate, url}) => {
  const searchParam = {
    types: 'du-an',
  };
  return (
    <SearchComponent
      searchParam={searchParam}
      postsCate={postsCate}
      url={url}
    />
  );
};

export default React.memo(Project);
Project.propTypes = {
  postsCate: PropsTypes.any,
  url: PropsTypes.any,
};
