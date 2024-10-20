import React, {useState, useEffect} from 'react';
import {Button, Collapse, Skeleton, Spin, Tabs, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import NoResult from 'components/NoResult';
import {initMap} from 'shared/map/map';
import {loader} from 'shared/map/map';
import markerDistributor from 'assets/marker/marker.png';
import markerDefault from 'assets/marker/marker-default.png';
import markerHospital from 'assets/marker/hospital.png';
import markerMarketplace from 'assets/marker/marketplace.png';
import markerPark from 'assets/marker/park.png';
import markerRestaurant from 'assets/marker/restaurant.png';
import markerSchool from 'assets/marker/school.png';
import markerSpa from 'assets/marker/spa.png';
import markerSupermarket from 'assets/marker/supermarket.png';
import markerSwimmingt from 'assets/marker/swimming.png';
import AppCollapse from 'components/AppCollapse';
import IntlMessages from '@crema/utility/IntlMessages';
import imgNotFound from 'assets/img/not-found.png';
import {getCookie} from 'cookies-next';
import {onNearBy} from 'pages/api/vland';

const Location = (props) => {
  const {
    dataPost,
    positonLoading,
    setPositionLoading,
    dataMap,
    setDataMap,
    loading,
    changeStyle,
  } = props;
  const {Panel} = Collapse;
  const {TabPane} = Tabs;
  const [map, setMap] = useState(null);
  const [mapMarkers, setMapMarkers] = useState([]);
  const [activeKey, setActiveKey] = useState('school');
  const [loadingMap, setLoadingMap] = useState(false);
  const [isSatellite, setIsSatellite] = useState(false);
  const [mapTypeId, setMapTypeId] = useState('roadmap');
  const cookieLang = getCookie('langServer');

  const mapStyles = [
    {
      featureType: 'poi', // Point of Interest
      elementType: 'labels.icon',
      stylers: [{visibility: 'off'}],
    },
    {
      featureType: 'transit',
      elementType: 'labels.icon',
      stylers: [{visibility: 'off'}],
    },
    {
      featureType: 'administrative',
      elementType: 'labels.icon',
      stylers: [{visibility: 'off'}],
    },
  ];

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
    styles: mapStyles,
    mapTypeId: mapTypeId,
  };

  const iconMapping = {
    school: markerSchool.src,
    supermarket: markerSupermarket.src,
    swimming: markerSwimmingt.src,
    spa: markerSpa.src,
    restaurant: markerRestaurant.src,
    park: markerPark.src,
    marketplace: markerMarketplace.src,
    hospital: markerHospital.src,
  };

  const fetchDataMap = async (activeKey) => {
    setLoadingMap(true);
    const lat = dataPost?.lat;
    const lng = dataPost?.lng;
    const resultData = await onNearBy(lat, lng, activeKey, cookieLang);
    const items = resultData?.data?.nearbylist ?? [];
    setLoadingMap(false);
    setDataMap(items);
    // remove markers first render by mapMarker state
    for (let index = 0; index < mapMarkers?.length; index++) {
      mapMarkers[index].setMap(null);
    }
    const arrMarker = [];
    const icon = iconMapping[activeKey] || markerDefault.src; // Get icon based on active tab key
    for (let index = 0; index < items?.length; index++) {
      let myLatlng = new google.maps.LatLng(
        items[index]?.item?.lat,
        items[index]?.item?.lng,
      );
      let marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        id: items[index]?.item?.name,
        open: true,
        disableAutoPan: true,
        draggable: false,
        icon: {
          url: icon,
          size: new google.maps.Size(45, 45),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(20, 20),
          scaledSize: new google.maps.Size(32, 32),
        },
      });
      marker.setMap(map);
      arrMarker.push(marker);
    }
    setMapMarkers(arrMarker);
    setPositionLoading(false);
  };

  const changeTab = async (activeKey) => {
    setActiveKey(activeKey);
    setPositionLoading(true);
    await fetchDataMap(activeKey);
  };

  useEffect(() => {
    loader
      .load()
      .then((google) => {
        const mapInstance = initMap(google, 'detail-maps', mapOptions);
        window.myMap = mapInstance;
        setMap(mapInstance);
        const arrMarker = [];
        const arrMap = dataMap;
        const arrPost = dataPost;
        let currentInfoWindow = null;
        // tạo marker cho bài viết với icon mặc định
        if (arrPost) {
          if (dataPost?.distributors) {
            dataPost?.distributors?.forEach((marker, index) => {
              let postMarker = new google.maps.Marker({
                icon: {
                  url: markerDistributor.src, // Use specified icon or default icon
                  size: new google.maps.Size(45, 55),
                  origin: new google.maps.Point(0, 0),
                  anchor: new google.maps.Point(20, 20),
                  scaledSize: new google.maps.Size(30, 40),
                },
                position: new google.maps.LatLng(
                  arrPost?.lat + 0.0001 * index,
                  arrPost?.lng + 0.0001 * index,
                ), // Slightly offset position to avoid overlap
                map: mapInstance,
                id: arrPost.name,
                open: true,
                disableAutoPan: true,
                draggable: false,
              });
              postMarker.setMap(mapInstance);
              arrMarker.push(postMarker);
              postMarker.addListener('click', () => {
                window.open(marker?.profileUrl, '_blank');
              });
              let infoWindow = new google.maps.InfoWindow({
                content: `<div class='infoWindow_map'><a href="${marker?.profileUrl}" target="_blank"><div class='avatar_marker'><img src="${marker?.avatar}" alt='' /><div class='text'><h3 class="limit-text limit-text-2">${marker?.fullName}</h3></div></div></a></div>`,
                disableAutoPan: true,
              });
              infoWindow.open(window.myMap, postMarker);
            });
          } else {
            let postLatlng = new google.maps.LatLng(arrPost?.lat, arrPost?.lng);
            let postMarker = new google.maps.Marker({
              icon: {
                url: markerDefault.src,
                size: new google.maps.Size(45, 55),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(20, 20),
                scaledSize: new google.maps.Size(30, 40),
              },
              position: postLatlng,
              map: mapInstance,
              id: arrPost.name,
              open: true,
              disableAutoPan: true,
              draggable: false,
            });
            postMarker.setMap(mapInstance);
            arrMarker.push(postMarker);
          }
        }
        // Tạo marker cho danh sách 10 marker khác nhau theo activeKey
        for (let index = 0; index < arrMap?.length; index++) {
          let myLatlng = new google.maps.LatLng(
            arrMap[index]?.item?.lat,
            arrMap[index]?.item?.lng,
          );
          let marker = new google.maps.Marker({
            position: myLatlng,
            map: mapInstance,
            id: arrMap[index],
            open: true,
            disableAutoPan: true,
            draggable: false,
            icon: {
              url: iconMapping[activeKey] || markerDefault.src,
              size: new google.maps.Size(35, 35),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(20, 20),
              scaledSize: new google.maps.Size(20, 30),
            },
          });
          marker.setMap(mapInstance);
          let infoWindow = new google.maps.InfoWindow({
            content: `<div class='infoWindow_map'>${arrMap[index]?.item?.name}</div>`,
            disableAutoPan: true,
          });
          marker.addListener('click', () => {
            if (currentInfoWindow) {
              currentInfoWindow.close();
            }
            infoWindow.open({
              anchor: marker,
              mapInstance,
            });
            currentInfoWindow = infoWindow;
          });
          arrMarker.push(marker);
        }
        setMapMarkers(arrMarker);
      })
      .catch((e) => {});
  }, [dataMap, dataPost]);

  const handleSetCenterMap = (item) => {
    window.myMap.setCenter({
      lat: item?.item ? Number(item?.item?.lat) : null,
      lng: item?.item ? Number(item?.item?.lng) : null,
      zoom: 40,
    });
  };

  const handleChangeLocation = async () => {
    setLoadingMap(true);
    await fetchDataMap(activeKey);
  };

  const toggleLayer = () => {
    if (map) {
      setIsSatellite((prev) => !prev);
      setMapTypeId(isSatellite ? 'roadmap' : 'hybrid');
      map.setMapTypeId(isSatellite ? 'roadmap' : 'hybrid');
    }
  };

  return (
    <div className='map-estate section-tab' id='tab-location'>
      <AppCollapse
        title={
          <h3 className='title-section'>
            {dataPost?.postType?.code === 'du-an' ? (
              <IntlMessages id='common.projectLocation' />
            ) : (
              <IntlMessages id='common.realEstateLocation' />
            )}
          </h3>
        }
        onchange={handleChangeLocation}
        description={
          <>
            {loadingMap ? (
              <div className='map map-skelete'>
                <Spin />
              </div>
            ) : (
              <div style={{position: 'relative'}}>
                {dataMap?.length > 0 && (
                  <>
                    <div className='map' id='detail-maps'></div>
                    <div
                      className='map-control'
                      style={{
                        position: 'absolute',
                        bottom: '16px',
                        right: '16px',
                      }}
                    >
                      <Tooltip
                        title={
                          <p className='content'>
                            <IntlMessages id='common.layers' />
                          </p>
                        }
                        placement='left'
                      >
                        <Button
                          onClick={toggleLayer}
                          type='outline'
                          className='map-btn'
                        >
                          <svg
                            xmlns='http://www.w3.org/2000/svg'
                            width='20'
                            height='20'
                            viewBox='0 0 20 20'
                            fill='none'
                          >
                            <path
                              d='M20 9.99944C20 9.524 19.7479 9.09074 19.3244 8.83949L18.2107 8.18431C18.6398 7.92957 19.0221 7.70235 19.3253 7.52192C19.7479 7.26978 20 6.83652 20 6.36287C20 5.88922 19.7479 5.45597 19.3253 5.20336C17.9332 4.37546 13.2129 1.57033 10.886 0.236392C10.3471 -0.0730259 9.69192 -0.0854264 9.10952 0.239077C9.10952 0.239077 2.78139 3.95601 0.675554 5.20297C0.252145 5.45418 0 5.88743 0 6.36287C0 6.83652 0.252145 7.26978 0.674702 7.52239C0.977898 7.70269 1.36014 7.92986 1.78905 8.18448L0.675597 8.83949C0.252145 9.09074 0 9.524 0 9.99944C0 10.4731 0.252145 10.9063 0.674702 11.159C0.977898 11.3393 1.36014 11.5664 1.78905 11.821L0.675597 12.4761C0.252145 12.7273 0 13.1606 0 13.636C0 14.1097 0.252145 14.5429 0.674702 14.7955C2.47602 15.8667 6.90341 18.4951 9.114 19.7625C9.38476 19.9179 9.69197 20 10 20C10.3081 20 10.6153 19.9179 10.8869 19.762C13.0966 18.4951 17.524 15.8667 19.3253 14.7951C19.7479 14.5429 20 14.1097 20 13.636C20 13.1606 19.7479 12.7273 19.3244 12.4761L18.2108 11.8209C18.6398 11.5661 19.0221 11.3389 19.3253 11.1585C19.7479 10.9063 20 10.4731 20 9.99944ZM1.13992 6.74226C1.07067 6.70054 0.909077 6.58067 0.909077 6.36364C0.909077 6.14567 1.06977 6.02674 1.13902 5.98587C3.24218 4.74032 9.56144 1.02892 9.56055 1.02935C9.84998 0.866435 10.166 0.872657 10.4341 1.02624C12.7548 2.35659 17.4707 5.15844 18.8601 5.98498C18.9293 6.02669 19.0909 6.14657 19.0909 6.3636C19.0909 6.58063 18.9293 6.7005 18.8601 6.74179C17.0614 7.81157 12.6394 10.4372 10.435 11.7005C10.1616 11.8568 9.83753 11.8563 9.56587 11.701C7.36062 10.4372 2.93855 7.81161 1.13992 6.74226ZM18.861 13.2586C18.9302 13.2994 19.0909 13.4184 19.0909 13.6363C19.0909 13.8534 18.9293 13.9732 18.8601 14.0145C17.0614 15.0843 12.6394 17.71 10.435 18.9733C10.1616 19.1295 9.83753 19.1291 9.56587 18.9737C7.36062 17.71 2.93855 15.0843 1.13992 14.015C1.07067 13.9732 0.909077 13.8534 0.909077 13.6363C0.909077 13.4184 1.06977 13.2994 1.13902 13.2586L2.68159 12.3509C4.76659 13.5867 7.51696 15.2105 9.114 16.1261C9.38476 16.2815 9.69197 16.3636 10 16.3636C10.3081 16.3636 10.6153 16.2815 10.8869 16.1257C12.4833 15.2104 15.2334 13.5868 17.3183 12.3508L18.861 13.2586ZM18.8601 10.3782C17.0614 11.448 12.6394 14.0736 10.435 15.3369C10.1616 15.4932 9.83753 15.4927 9.56587 15.3374C7.36062 14.0736 2.93855 11.448 1.13992 10.3786C1.07067 10.3369 0.909077 10.217 0.909077 9.99999C0.909077 9.78202 1.06977 9.66309 1.13902 9.62222L2.68159 8.71451C4.76659 9.95035 7.51696 11.5742 9.114 12.4897C9.38476 12.6451 9.69197 12.7272 10 12.7272C10.3081 12.7272 10.6153 12.6451 10.8869 12.4893C12.4833 11.5741 15.2334 9.95048 17.3183 8.71447L18.861 9.62222C18.9303 9.66305 19.091 9.78202 19.091 9.99999C19.0909 10.217 18.9293 10.3369 18.8601 10.3782Z'
                              fill='#6C6868'
                            />
                          </svg>
                        </Button>
                      </Tooltip>
                    </div>
                  </>
                )}
              </div>
            )}

            <div>
              <Tabs
                defaultActiveKey={activeKey}
                className='invite-friends-tabs'
                onChange={changeTab}
                type='card'
              >
                {dataPost?.nearMeKey?.map((item) => {
                  return (
                    <TabPane
                      className={`load-post-nearlist ${
                        dataMap?.length > 5 ? '' : 'hide'
                      }`}
                      tab={<span>{item?.value}</span>}
                      key={item?.key}
                    >
                      {positonLoading ? (
                        <Skeleton paragraph={{rows: 6}} active />
                      ) : (
                        <ul className='list-item-near'>
                          {dataMap?.length > 0 ? (
                            dataMap?.map((item, index) => {
                              return (
                                <li
                                  key={index}
                                  className='d-flex align-center justify-between'
                                  onClick={() => handleSetCenterMap(item)}
                                  style={{cursor: 'pointer'}}
                                >
                                  <span className='title_info'>
                                    {item?.item?.name}
                                  </span>
                                  <span className='area_info'>
                                    {item?.item?.distance}
                                  </span>
                                </li>
                              );
                            })
                          ) : (
                            <NoResult
                              title={<IntlMessages id='common.notFound' />}
                              image={imgNotFound.src}
                              isFullheight={false}
                            />
                          )}
                        </ul>
                      )}
                    </TabPane>
                  );
                })}
              </Tabs>
            </div>
          </>
        }
      />
    </div>
  );
};

export default Location;
Location.propTypes = {
  dataPost: PropTypes.any,
  positonLoading: PropTypes.any,
  loading: PropTypes.any,
  setPositionLoading: PropTypes.any,
  dataMap: PropTypes.any,
  setDataMap: PropTypes.any,
  changeStyle: PropTypes.any,
};
