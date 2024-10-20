import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({loadingApp}) => {
  return (
    <>
      {loadingApp ? (
        <div className='loading'>
          <div className='loading-inner'></div>
        </div>
      ) : (
        ''
      )}
    </>
  );
};

export default Loading;
Loading.propTypes = {
  loadingApp: PropTypes.any,
};
