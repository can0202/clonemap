import React from 'react';
import RatingItem from '../RatingItem';
import PropTypes from 'prop-types';
import RatingSkeleton from '../RatingSkeleton';

const RatingUser = ({dataRate, isLoading}) => {
  return (
    <div className='rating-user'>
      {isLoading ? (
        <RatingSkeleton />
      ) : (
        <>
          {dataRate?.ratings?.elements?.map((item, index) => {
            return <RatingItem key={index} item={item} />;
          })}
        </>
      )}
    </div>
  );
};

export default RatingUser;
RatingUser.propTypes = {
  dataRate: PropTypes.any,
  isLoading: PropTypes.any,
};
