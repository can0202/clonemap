import React from 'react';
import PropTypes from 'prop-types';
import {Rate} from 'antd';
import NoImage from 'assets/img/no-image.png';

const RatingItem = ({item}) => {
  return (
    <div className='item'>
      <div className='item-info d-flex align-center justify-between'>
        <div className='item-info-left d-flex align-center'>
          <div className='img'>
            {item?.owner?.avatar ? (
              <img src={item?.owner?.avatar} alt={item?.owner?.fullName} />
            ) : (
              <img src={NoImage.src} alt={item?.owner?.fullName} />
            )}
          </div>
          <div className='author-info'>
            <p className='d-flex align-center'>
              <span className='name limit-text limit-text-1'>
                {item?.owner?.fullName}
              </span>
              <span className='icon-tick'>
                <img
                  src={item?.owner?.varsIconUrl}
                  alt={item?.owner?.fullName}
                />
              </span>
            </p>
            <Rate disabled value={item?.star} />
          </div>
        </div>
        <div className='item-info-right'>
          <p>{item?.ratingDate}</p>
        </div>
      </div>
      <div className='item-content'>
        <h3>{item?.title}</h3>
        <p>{item?.content}</p>
      </div>
    </div>
  );
};

export default RatingItem;
RatingItem.propTypes = {
  item: PropTypes.any,
};
