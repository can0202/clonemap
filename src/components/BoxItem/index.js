import React, {useState} from 'react';
import NoResult from '../NoResult';
import {Row, Col} from 'antd';
import CartItem from 'components/CartItem';
import PropTypes from 'prop-types';
import ModalLogin from 'components/ModalLogin';
import SkeletonMap from 'components/MapView/Skeleton';
import imgNotFound from 'assets/img/not-found.png';
import IntlMessages from '@crema/utility/IntlMessages';

const BoxItem = ({itemPost, isLoading}) => {
  const [openModal, setOpenModal] = useState(false);
  return (
    <>
      <Row gutter={[12, 12]}>
        {isLoading ? (
          <SkeletonMap />
        ) : itemPost?.length === 0 ? (
          <NoResult
            title={<IntlMessages id='common.notFound' />}
            image={imgNotFound.src}
            isFullheight={true}
          />
        ) : (
          itemPost?.map((item) => (
            <Col
              xs={{span: 12}}
              md={{span: 12}}
              lg={{span: 6}}
              key={item.id}
              className='item'
            >
              <CartItem item={item} setOpenModal={setOpenModal} />
            </Col>
          ))
        )}

        {/* {isLoading && itemPost ? (
          <SkeletonMap />
        ) : (
          <>
            {itemPost?.length > 0 ? (
              itemPost?.map((item) => {
                return (
                  <Col
                    xs={{span: 12}}
                    md={{span: 12}}
                    lg={{span: 6}}
                    key={item.id}
                    className='item'
                  >
                    <CartItem item={item} setOpenModal={setOpenModal} />
                  </Col>
                );
              })
            ) : (
              <NoResult
                title={<IntlMessages id='common.notFound' />}
                image={imgNotFound.src}
                isFullheight={true}
              />
            )}
          </>
        )} */}
      </Row>
      <ModalLogin
        openModalLogin={openModal}
        setOpenModalLogin={setOpenModal}
        description={<IntlMessages id='common.notiLogin' />}
      />
    </>
  );
};

export default BoxItem;
BoxItem.propTypes = {
  itemPost: PropTypes.any,
  isLoading: PropTypes.any,
};
