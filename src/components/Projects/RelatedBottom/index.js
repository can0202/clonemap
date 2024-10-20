import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Col, Row} from 'antd';
import CartItem from 'components/CartItem';
import Link from 'next/link';
import ModalLogin from 'components/ModalLogin';
import IntlMessages from '@crema/utility/IntlMessages';

import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Navigation, Autoplay} from 'swiper/modules';
import {typesReplaceMapping} from 'shared/constants/AppConst';

const RelatedBottom = ({dataPost, relatedBottomData}) => {
  const [openModal, setOpenModal] = useState(false);
  const typeLink = typesReplaceMapping[dataPost?.postType?.code];
  let locationSegment = '';
  if (dataPost?.district?.code) {
    locationSegment += dataPost?.district?.code
      ? `tai-${dataPost?.district?.slug}-t${dataPost?.province?.code}`
      : '';
  } else if (dataPost?.province?.code) {
    locationSegment += dataPost?.province?.code
      ? `tai-${dataPost?.province?.slug}-t${dataPost?.province?.code}`
      : '';
  }
  const href = `${typeLink}${locationSegment ? `-${locationSegment}` : ''}`;

  return (
    <>
      {relatedBottomData?.length > 0 && (
        <div className='post-related mt-24'>
          <Row gutter={[0, 16]}>
            <Col xs={24}>
              <h4 className='title-section-2'>
                {dataPost?.postType?.code == 'du-an' ? (
                  <IntlMessages id='common.nearbyProjects' />
                ) : (
                  <IntlMessages id='common.nearbyRealEstate' />
                )}
              </h4>
            </Col>
            <Col xs={24}>
              <Swiper
                slidesPerView={5}
                spaceBetween={12}
                loop={true}
                autoplay={true}
                navigation={true}
                modules={[Navigation, Autoplay]}
                className='mySwiperEx'
                breakpoints={{
                  300: {
                    slidesPerView: 2,
                  },
                  768: {
                    slidesPerView: 3,
                  },
                  850: {
                    slidesPerView: 4,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                  1200: {
                    slidesPerView: 5,
                    allowTouchMove: false,
                  },
                }}
              >
                {relatedBottomData?.map((item, index) => {
                  return (
                    <SwiperSlide key={index}>
                      <CartItem item={item} setOpenModal={setOpenModal} />
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </Col>
            {relatedBottomData?.length >= 5 && (
              <Col xs={24}>
                <div className='d-flex flex-column align-center'>
                  <a
                    href={`/${href}`}
                    className={'btn btn-readmore'}
                    target='_blank'
                    rel='noreferrer'
                  >
                    <IntlMessages id='common.readMore' />
                  </a>
                </div>
              </Col>
            )}
          </Row>
        </div>
      )}

      <ModalLogin
        openModalLogin={openModal}
        setOpenModalLogin={setOpenModal}
        description={<IntlMessages id='common.notiLogin' />}
      />
    </>
  );
};

export default React.memo(RelatedBottom);
RelatedBottom.propTypes = {
  dataPost: PropTypes.any,
  relatedBottomData: PropTypes.any,
};
