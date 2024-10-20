import React from 'react';
import {Pagination} from 'antd';
import PropTypes from 'prop-types';

const Paginations = ({
  total,
  currentPage,
  setCurrentPage,
  setIsReload,
  dataObject,
  setDataObject,
}) => {
  const handleOnChange = (e) => {
    const newDataObject = {
      ...dataObject,
      page: e,
      pageSize: 12,
    };
    setDataObject(newDataObject);
    setCurrentPage(e);
    setIsReload(true);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  return (
    <>
      <div className='pagination text-center'>
        <Pagination
          hideOnSinglePage={true}
          current={currentPage}
          defaultPageSize={12}
          total={total}
          onChange={handleOnChange}
        />
      </div>
    </>
  );
};

export default Paginations;
Paginations.propTypes = {
  total: PropTypes.number,
  currentPage: PropTypes.number,
  setCurrentPage: PropTypes.func,
  setIsReload: PropTypes.func,
  dataObject: PropTypes.any,
  setDataObject: PropTypes.func,
};
