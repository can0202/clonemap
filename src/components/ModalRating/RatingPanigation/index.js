import {Pagination} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import {useState} from 'react';

const RatingPanigation = ({
  dataRate,
  setDataParams,
  dataParams,
  setIsLoading,
}) => {
  const [currentPage, setCurrentPage] = useState(
    dataRate?.ratings?.currentPage,
  );

  const handleOnChange = (e) => {
    const newDataParam = {
      ...dataParams,
      page: e,
      pageSize: 10,
    };
    setDataParams(newDataParam);
    setCurrentPage(e);
    setIsLoading(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <div className='pagination text-center rating-panigation'>
      <Pagination
        hideOnSinglePage={true}
        current={currentPage}
        defaultPageSize={10}
        total={dataRate?.ratings?.total}
        onChange={handleOnChange}
      />
    </div>
  );
};

export default RatingPanigation;
RatingPanigation.propTypes = {
  dataRate: PropTypes.any,
  dataParams: PropTypes.any,
  setDataParams: PropTypes.any,
  setIsLoading: PropTypes.any,
};
