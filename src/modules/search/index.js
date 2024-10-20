import SearchComponent from 'components/SearchComponent';
import React from 'react';
import PropsTypes from 'prop-types';

const Search = ({postsCate, totalPost, url, titleSeo, typesKey}) => {
  const searchParam = {
    types: typesKey || null,
  };

  return (
    <SearchComponent
      searchParam={searchParam}
      postsCate={postsCate}
      totalPost={totalPost}
      url={url}
      titleSeo={titleSeo}
    />
  );
};

export default Search;
Search.propTypes = {
  postsCate: PropsTypes.any,
  totalPost: PropsTypes.number,
  url: PropsTypes.any,
  titleSeo: PropsTypes.string,
  typesKey: PropsTypes.any,
};
