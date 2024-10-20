import React from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import {FreeMode, Navigation, Thumbs} from 'swiper/modules';
import PropTypes from 'prop-types';
import './FancyboxSwiper/index';

const ImageSwiper = ({thumbsSwiper, images, thumbnail}) => {
  return (
    <>
      <Swiper
        loop={true}
        spaceBetween={10}
        navigation={true}
        thumbs={{swiper: thumbsSwiper}}
        modules={[FreeMode, Navigation, Thumbs]}
        className='image-swiper'
      >
        <SwiperSlide>
          <a data-fancybox='gallery' href={thumbnail}>
            <img src={thumbnail} alt='Hình ảnh 1' />
          </a>
        </SwiperSlide>
        {images?.map((item, index) => {
          return (
            <SwiperSlide key={index}>
              <a data-fancybox='gallery' href={item}>
                <img src={item} alt={`Hình ảnh ${index + 2}`} />
              </a>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
};

export default React.memo(ImageSwiper);
ImageSwiper.propTypes = {
  thumbsSwiper: PropTypes.any,
  images: PropTypes.any,
  thumbnail: PropTypes.any,
};
