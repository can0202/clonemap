import React, {useState} from 'react';
import {Button} from 'antd';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {getFavoritePost} from 'pages/api/getFavorite';

const ButtonFavoriteEs = ({
  item,
  setOpenModal,
  isAuthenticated,
  accessToken,
}) => {
  const [dataState, setDataState] = useState(item);
  const onHandleFavorite = (e) => {
    if (!isAuthenticated) {
      setOpenModal(true);
    } else {
      const nextState = dataState?.isFavorite == 1 ? 0 : 1;
      const fetchAPI = async () => {
        const data = await getFavoritePost(
          dataState?.id,
          nextState,
          accessToken,
        );
        if (data.code === 200) {
          setDataState({...dataState, isFavorite: nextState});
        }
      };
      fetchAPI();
    }
  };
  return (
    <>
      <Button
        onClick={onHandleFavorite}
        data-issingle='true'
        data-id={dataState?.id}
        data-favorite={dataState?.isFavorite}
        className={`fav-btn add-favorite end-0 top-0 ${
          dataState?.isFavorite ? 'active' : ''
        }`}
        title={`${dataState?.isFavorite ? 'Bỏ yêu thích' : 'Yêu thích'}`}
      >
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <g filter='url(#filter0_b_2445_70020)'>
            <path
              d='M12.62 20.8096C12.28 20.9296 11.72 20.9296 11.38 20.8096C8.48 19.8196 2 15.6896 2 8.68961C2 5.59961 4.49 3.09961 7.56 3.09961C9.38 3.09961 10.99 3.97961 12 5.33961C13.01 3.97961 14.63 3.09961 16.44 3.09961C19.51 3.09961 22 5.59961 22 8.68961C22 15.6896 15.52 19.8196 12.62 20.8096Z'
              stroke='#6C6868'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </g>
          <defs>
            <filter
              id='filter0_b_2445_70020'
              x='-16'
              y='-16'
              width='56'
              height='56'
              filterUnits='userSpaceOnUse'
              colorInterpolationFilters='sRGB'
            >
              <feFlood floodOpacity='0' result='BackgroundImageFix' />
              <feGaussianBlur in='BackgroundImageFix' stdDeviation='8' />
              <feComposite
                in2='SourceAlpha'
                operator='in'
                result='effect1_backgroundBlur_2445_70020'
              />
              <feBlend
                mode='normal'
                in='SourceGraphic'
                in2='effect1_backgroundBlur_2445_70020'
                result='shape'
              />
            </filter>
          </defs>
        </svg>
      </Button>
    </>
  );
};

export default ButtonFavoriteEs;
ButtonFavoriteEs.propTypes = {
  item: PropTypes.any,
  setOpenModal: PropTypes.any,
  accessToken: PropTypes.any,
  isAuthenticated: PropTypes.any,
};
