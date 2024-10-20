import {Button} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

const ButtonPopupSlide = ({onClickTab}) => {
  return (
    <div className='btn-addon d-flex'>
      <Button data-tab='hinh-anh' onClick={onClickTab}>
        <div className='d-flex align-center'>
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M4.16663 8.33268H5.83329C7.49996 8.33268 8.33329 7.49935 8.33329 5.83268V4.16602C8.33329 2.49935 7.49996 1.66602 5.83329 1.66602H4.16663C2.49996 1.66602 1.66663 2.49935 1.66663 4.16602V5.83268C1.66663 7.49935 2.49996 8.33268 4.16663 8.33268Z'
              stroke='#6C6868'
              strokeWidth='1.5'
              strokeMiterlimit='10'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M14.1666 8.33268H15.8333C17.5 8.33268 18.3333 7.49935 18.3333 5.83268V4.16602C18.3333 2.49935 17.5 1.66602 15.8333 1.66602H14.1666C12.5 1.66602 11.6666 2.49935 11.6666 4.16602V5.83268C11.6666 7.49935 12.5 8.33268 14.1666 8.33268Z'
              stroke='#6C6868'
              strokeWidth='1.5'
              strokeMiterlimit='10'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M14.1666 18.3327H15.8333C17.5 18.3327 18.3333 17.4993 18.3333 15.8327V14.166C18.3333 12.4993 17.5 11.666 15.8333 11.666H14.1666C12.5 11.666 11.6666 12.4993 11.6666 14.166V15.8327C11.6666 17.4993 12.5 18.3327 14.1666 18.3327Z'
              stroke='#6C6868'
              strokeWidth='1.5'
              strokeMiterlimit='10'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M4.16663 18.3327H5.83329C7.49996 18.3327 8.33329 17.4993 8.33329 15.8327V14.166C8.33329 12.4993 7.49996 11.666 5.83329 11.666H4.16663C2.49996 11.666 1.66663 12.4993 1.66663 14.166V15.8327C1.66663 17.4993 2.49996 18.3327 4.16663 18.3327Z'
              stroke='#6C6868'
              strokeWidth='1.5'
              strokeMiterlimit='10'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          Xem tất cả
        </div>
      </Button>
      <Button data-tab='video' onClick={onClickTab}>
        <div className='d-flex align-center'>
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <mask
              id='mask0_648_45079'
              maskUnits='userSpaceOnUse'
              x='1'
              y='4'
              width='14'
              height='14'
            >
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M1.66687 4.16602H14.5838V17.0838H1.66687V4.16602Z'
                fill='white'
              />
            </mask>
            <g mask='url(#mask0_648_45079)'>
              <path
                fillRule='evenodd'
                clipRule='evenodd'
                d='M5.70613 5.41714C5.34029 5.41714 5.10446 5.41714 5.06363 5.4188C4.44863 5.44464 3.88113 5.70547 3.47196 6.15214C3.09029 6.56964 2.89363 7.10297 2.91946 7.6563C2.91946 10.0671 2.92029 13.6855 2.92613 13.8838C3.02113 15.038 4.10279 15.9205 5.34113 15.8255C7.63279 15.8288 11.0278 15.8363 11.187 15.8305C11.7995 15.8055 12.3678 15.5455 12.777 15.0996C13.1595 14.6838 13.3561 14.1505 13.332 13.5996C13.3311 13.5905 13.3311 13.5813 13.3311 13.5721C13.332 11.1888 13.332 7.57297 13.3261 7.3788C13.232 6.2188 12.1453 5.32547 10.9003 5.42297C9.17863 5.42047 6.82946 5.41714 5.70613 5.41714ZM5.12196 17.0838C3.36029 17.0846 1.82363 15.7346 1.67863 13.9638C1.67613 13.9296 1.66779 13.8255 1.67029 7.68464C1.63029 6.82547 1.94196 5.97214 2.55029 5.30797C3.18529 4.61464 4.06113 4.21047 5.01696 4.16964C5.13279 4.1613 9.13946 4.1713 10.8553 4.17464C12.7303 4.04297 14.4228 5.43464 14.5736 7.30214C14.5803 7.39297 14.5828 9.49714 14.5811 13.5596C14.6161 14.4396 14.3028 15.2871 13.6978 15.9455C13.062 16.638 12.1853 17.0405 11.2303 17.0796C11.1136 17.088 7.10529 17.0771 5.38696 17.0738C5.29863 17.0805 5.21029 17.0838 5.12196 17.0838Z'
                fill='#6C6868'
              />
            </g>
            <path
              fillRule='evenodd'
              clipRule='evenodd'
              d='M17.3488 15.2898C16.9729 15.2898 16.6021 15.1606 16.2963 14.9098L13.5621 12.6631C13.2954 12.444 13.2571 12.0498 13.4763 11.7831C13.6946 11.5173 14.0888 11.4773 14.3554 11.6973L17.0888 13.944C17.2729 14.094 17.4579 14.0323 17.5296 13.9973C17.6013 13.964 17.7671 13.8598 17.7671 13.6231L17.7771 7.49896C17.7779 7.26229 17.6113 7.15812 17.5396 7.12396C17.4688 7.09062 17.2813 7.02812 17.0988 7.17812L14.3546 9.42396C14.0863 9.64312 13.6938 9.60396 13.4754 9.33562C13.2563 9.06896 13.2963 8.67562 13.5629 8.45729L16.3071 6.21062C16.8104 5.79812 17.4879 5.71729 18.0754 5.99479C18.6629 6.27396 19.0279 6.85062 19.0271 7.50062L19.0171 13.6248C19.0163 14.2748 18.6504 14.8515 18.0638 15.1281C17.8338 15.2373 17.5904 15.2898 17.3488 15.2898Z'
              fill='#6C6868'
            />
          </svg>
          Video
        </div>
      </Button>
      <Button data-tab='map' onClick={onClickTab}>
        <div className='d-flex align-center'>
          <svg
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              d='M1.90833 6.48299V14.5913C1.90833 16.1747 3.03333 16.8247 4.39999 16.0413L6.35833 14.9247C6.78333 14.683 7.49166 14.658 7.93333 14.883L12.3083 17.0747C12.75 17.2913 13.4583 17.2747 13.8833 17.033L17.4917 14.9663C17.95 14.6997 18.3333 14.0497 18.3333 13.5163V5.40799C18.3333 3.82465 17.2083 3.17465 15.8417 3.95799L13.8833 5.07465C13.4583 5.31632 12.75 5.34132 12.3083 5.11632L7.93333 2.93299C7.49166 2.71632 6.78333 2.73299 6.35833 2.97465L2.74999 5.04132C2.28333 5.30799 1.90833 5.95799 1.90833 6.48299Z'
              stroke='#6C6868'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M7.1333 3.33398V14.1673'
              stroke='#6C6868'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
            <path
              d='M13.1083 5.51758V16.6676'
              stroke='#6C6868'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
          Bản đồ
        </div>
      </Button>
    </div>
  );
};

export default ButtonPopupSlide;
ButtonPopupSlide.propTypes = {
  onClickTab: PropTypes.any,
};
