import {Tabs} from 'antd';
import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Fancybox from '../Fancybox/index';
import {loader} from 'shared/map/map';
import ReactPlayer from 'react-player';
import IntlMessages from '@crema/utility/IntlMessages';

const ModalPopup = ({dataPost, activeTab, setActiveTab, newImages}) => {
  const {TabPane} = Tabs;
  const mapOptions = {
    zoom: 16,
    center: {lat: dataPost?.lat ?? 1, lng: dataPost?.lng ?? 1},
    scaleControl: true,
    streetViewControl: false,
    mapTypeControl: false,
    fullscreenControl: false,
    draggable: true,
    panControl: false,
    zoomControl: false,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    mapTypeId: 'hybrid',
  };
  useEffect(() => {
    if (activeTab === 'map') {
      loader
        .load()
        .then((google) => {
          const mapInstance = new google.maps.Map(
            document.getElementById('map-popup'),
            mapOptions,
          );
          let myLatlng = new google.maps.LatLng(dataPost.lat, dataPost.lng);
          let marker = new google.maps.Marker({
            position: myLatlng,
            map: mapInstance,
            open: true,
            disableAutoPan: true,
            draggable: false,
          });
          marker.setMap(mapInstance);
        })
        .catch((e) => {});
    }
  }, [activeTab]);

  const onChange = (e) => {
    setActiveTab(e);
  };

  return (
    <>
      <div className='modal-single-content'>
        <Tabs activeKey={activeTab} onChange={onChange}>
          <TabPane tab='Hình ảnh' key='hinh-anh'>
            <Fancybox options={{dragToClose: false}}>
              <div className='gallery-thumbs'>
                {newImages?.map((item, index) => {
                  return (
                    <div className='item' key={index}>
                      <a data-fancybox='gallery-child' href={item}>
                        <img src={item} alt='' />
                      </a>
                    </div>
                  );
                })}
              </div>
            </Fancybox>
          </TabPane>
          <TabPane tab='Video' key='video'>
            <div className='video'>
              {dataPost?.videoUrl ? (
                <ReactPlayer url={dataPost?.videoUrl} />
              ) : (
                <p className='text-center mt-16'>
                  <IntlMessages id='common.updating' />
                </p>
              )}
            </div>
          </TabPane>
          <TabPane tab='Map' key='map'>
            <div className='map' id='map-popup'></div>
          </TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ModalPopup;
ModalPopup.propTypes = {
  dataPost: PropTypes.any,
  activeTab: PropTypes.any,
  setActiveTab: PropTypes.any,
  newImages: PropTypes.any,
};
