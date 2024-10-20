import React, {useState} from 'react';
import {Button} from 'antd';
import IconLocation from '../../../../assets/icon/location-black.png';
import PropsTypes from 'prop-types';
import {useSelector} from 'react-redux';
import {getFavoritePost} from 'pages/api/getFavorite';
import Link from 'next/link';
import IntlMessages from '@crema/utility/IntlMessages';

const ItemReProject = ({item, setOpenModal}) => {
  const {isAuthenticated, accessToken} = useSelector(({auth}) => auth);
  const [itemState, setItemState] = useState(item);

  const onHandleFavorite = (e) => {
    if (!isAuthenticated) {
      setOpenModal(true);
    } else {
      const nextState = itemState.isFavorite == 1 ? 0 : 1;
      const fetchAPI = async () => {
        const data = await getFavoritePost(
          itemState.id,
          nextState,
          accessToken,
        );
        if (data.code === 200) {
          setItemState({...itemState, isFavorite: nextState});
        }
      };
      fetchAPI();
    }
  };
  // Get slug last
  const slugUrl = itemState.detailUrl?.split('/');
  const lastSlug = slugUrl?.pop() || slugUrl?.pop();
  return (
    <>
      <div className='item position-relative'>
        <div className='item-top d-flex'>
          <div className='img'>
            <Link
              legacyBehavior
              passHref
              href={`/${itemState?.postType?.code}/${lastSlug}`}
              title={itemState?.titleText}
            >
              <a>
                <img src={itemState.thumbnailUrl} alt={itemState.titleText} />
              </a>
            </Link>
          </div>
          <div className='info-text w-100'>
            <Link
              legacyBehavior
              passHref
              href={`/${itemState?.postType?.code}/${lastSlug}`}
              title={itemState?.titleText}
            >
              <a>
                <h3
                  title={itemState?.titleText}
                  className='limit-text limit-text-1'
                  dangerouslySetInnerHTML={{__html: itemState?.title}}
                ></h3>
              </a>
            </Link>

            <p className='limit-text limit-text-1'>
              {itemState?.typeRealEstate ? itemState?.typeRealEstate?.name : ''}
            </p>
          </div>
        </div>
        <div className='favorite_icon position-absolute top-0 end-0'>
          <Button
            type='outline'
            onClick={onHandleFavorite}
            data-issingle='true'
            data-id={itemState?.id}
            data-favorite={itemState?.isFavorite}
            className={`fav-btn add-favorite ${
              itemState?.isFavorite ? 'active' : ''
            }`}
            title={itemState?.isFavorite ? 'Xoá yêu thích' : 'Yêu thích'}
          >
            <svg
              width='24'
              height='24'
              viewBox='0 0 24 24'
              fill='none'
              xmlns='http://www.w3.org/2000/svg'
            >
              <path
                d='M16.44 2.34961C14.7117 2.34961 13.1379 3.05563 12 4.18872C10.8621 3.05563 9.28834 2.34961 7.56 2.34961C4.07229 2.34961 1.25 5.1889 1.25 8.68961C1.25 9.96023 1.45299 11.1372 1.80563 12.228C2.6496 14.8968 4.36206 17.0044 6.14991 18.5409C7.93337 20.0737 9.83464 21.0754 11.1349 21.5184C11.409 21.6144 11.7229 21.6496 12 21.6496C12.2771 21.6496 12.591 21.6144 12.8651 21.5184C14.1654 21.0754 16.0666 20.0737 17.8501 18.5409C19.6379 17.0044 21.3504 14.8968 22.1944 12.2281C22.547 11.1373 22.75 9.96024 22.75 8.68961C22.75 5.1889 19.9277 2.34961 16.44 2.34961Z'
                fill='rgba(51, 51, 51, 0.5)'
                stroke='white'
                strokeWidth='1.5'
              />
            </svg>
          </Button>
        </div>
        <div className='item-bottom d-flex align-center justify-between'>
          <div className='price'>
            <span
              className='limit-text limit-text-1'
              title={itemState?.priceText}
            >
              {itemState?.priceText ? itemState?.priceText : 'Liên hệ'}
            </span>
          </div>
          <div className={`info-tab status`}>{itemState?.postDateDuration}</div>
        </div>
        <div className='item-bottom'>
          <div className='address-single d-flex align-center'>
            <img
              className='mr-8'
              src={IconLocation.src}
              alt={
                itemState?.address ? (
                  itemState?.address
                ) : (
                  <IntlMessages id='common.updating' />
                )
              }
            />
            <span
              className='limit-text limit-text-1'
              title={
                itemState?.address ? (
                  itemState?.address
                ) : (
                  <IntlMessages id='common.updating' />
                )
              }
            >
              {itemState?.address ? (
                itemState?.address
              ) : (
                <IntlMessages id='common.updating' />
              )}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default ItemReProject;
ItemReProject.propTypes = {
  item: PropsTypes.any,
  setOpenModal: PropsTypes.any,
};
