import React from 'react';
import RatingItem from '../RatingItem';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';

const RatingOwner = ({dataRate}) => {
  return (
    <div className='rating-owner'>
      <h2>
        <IntlMessages id='common.yourRating' />
      </h2>
      {dataRate?.myRatings ? (
        <div className='rating-owner-inner'>
          {dataRate?.myRatings?.map((item, index) => {
            return <RatingItem key={index} item={item} />;
          })}
        </div>
      ) : (
        <p>
          <IntlMessages id='common.notiRating' />
        </p>
      )}
    </div>
  );
};

export default RatingOwner;
RatingOwner.propTypes = {
  dataRate: PropTypes.any,
};
