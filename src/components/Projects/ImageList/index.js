import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import {FreeMode, Navigation, Thumbs} from 'swiper/modules';
import PropTypes from 'prop-types';

const ImageList = (props) => {
  const {setThumbsSwiper, images, thumbnail} = props;
  return (
    <div className='image-list-wrapper'>
      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className='image-list'
      >
        <SwiperSlide>
          <img src={thumbnail} alt='' />
        </SwiperSlide>
        {images?.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <img src={item} alt='' />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
};

export default React.memo(ImageList);
ImageList.propTypes = {
  setThumbsSwiper: PropTypes.func,
  images: PropTypes.any,
  thumbnail: PropTypes.any,
};
