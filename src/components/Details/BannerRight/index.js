import React from 'react';
import {useEffect} from 'react';
import {useState} from 'react';
import {useSelector} from 'react-redux';

const BannerRight = () => {
  const [dataAds, setDataAds] = useState([]);
  const {categories} = useSelector((state) => state.categories);

  useEffect(() => {
    if (categories) {
      const advertConfig = categories?.configurations?.adsConfig ?? [];
      const filteredItems = advertConfig?.filter(
        (item) => item?.enabled && item?.subSystem === 'LAND-WEB',
      );
      const items = filteredItems?.filter(
        (item) => item?.position === 'RIGHT-DETAIL-PROJECT',
      );
      setDataAds(items);
    }
  }, [categories]);

  const handleClick = (item, e) => {
    e.preventDefault();
    if (!item?.data) {
      return;
    }
    if (item?.data) {
      window.open(item?.data, '_blank', 'noreferrer');
    }
  };

  return (
    <div className='banner-sidebar'>
      {dataAds?.map((item, index) => {
        return (
          <div key={index}>
            {item?.media?.type === 'video' ? (
              <a onClick={(e) => handleClick(item, e)}>
                <video
                  playsInline='playsinline'
                  autoPlay='autoplay'
                  muted='muted'
                  loop='loop'
                >
                  <source src={item?.media?.Url} type='video/mp4'></source>
                </video>
              </a>
            ) : (
              <a onClick={(e) => handleClick(item, e)}>
                <img src={item?.media?.Url} alt='' />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BannerRight;
