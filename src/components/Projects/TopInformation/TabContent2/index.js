import React from 'react';
import PropTypes from 'prop-types';
import {Button, Modal} from 'antd';
import NoThumb from 'assets/img/EmptyAvatar.png';
import IntlMessages from '@crema/utility/IntlMessages';
const TabContent2 = ({dataPost, handleShowModalInvestor}) => {
  return (
    <div className='invester-estate-btn'>
      <div className='d-flex align-center'>
        <img
          src={
            dataPost?.investor?.logoUrl
              ? dataPost?.investor?.logoUrl
              : NoThumb.src
          }
          alt={dataPost?.investor?.name}
        />
        <div className='invester-info'>
          <h3>
            {dataPost?.investor?.name ? (
              dataPost?.investor?.name
            ) : (
              <IntlMessages id='common.updating' />
            )}
          </h3>
          <p
            className='limit-text limit-text-3'
            dangerouslySetInnerHTML={{
              __html: dataPost?.investor?.description,
            }}
          ></p>
          {dataPost?.investor?.description && (
            <Button type='outline' onClick={handleShowModalInvestor}>
              <span>
                <IntlMessages id='common.readMore' />
              </span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TabContent2;
TabContent2.propTypes = {
  dataPost: PropTypes.any,
  handleShowModalInvestor: PropTypes.func,
};
