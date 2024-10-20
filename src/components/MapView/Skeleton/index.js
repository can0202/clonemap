import {Col, Skeleton} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const SkeletonMap = ({isLoading}) => {
  return (
    <>
      {[...Array(8)].map((x, i) => (
        <Col key={i} span={12}>
          <Skeleton className='mb-16' paragraph={{rows: 7}} active />
        </Col>
      ))}
    </>
  );
};

export default SkeletonMap;
SkeletonMap.propTypes = {
  isLoading: PropTypes.any,
};
