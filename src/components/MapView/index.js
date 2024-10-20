import {Alert, Col, Row, Space, Button, Spin} from 'antd';
import React, {useState, useEffect} from 'react';
import CartItem from 'components/CartItem';
import ControlMap from './ControlMap';
import PropTypes from 'prop-types';
import {fetchSearchPolygon} from 'pages/api/searchPolygon';
import {initMap, loader} from 'shared/map/map';
import {useDispatch, useSelector} from 'react-redux';
import markerSale from 'assets/icon/marker-sale.png';
import markerRent from 'assets/icon/marker-rent.png';
import markerProject from 'assets/icon/marker-project.png';
import markerMa from 'assets/icon/marker-ma.png';
import {fetchDistricts} from 'pages/api/districts';
import {fetchWards} from 'pages/api/wards';
import ModalLogin from 'components/ModalLogin';
import useDebounce from './debounce';

import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import {Navigation, Autoplay} from 'swiper/modules';
import {useRef} from 'react';
import {onHideFooter} from 'redux/actions/HideFooter';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {useRouter} from 'next/router';

const MapView = ({
  mapDataObj,
  setMapDataObj,
  setDisplayView,
  displayView,
  map,
  setMap,
  form,
  setIsReloadMap,
  isReloadMap,
  triggerZoom,
  setTriggerZoom,
  dataObject,
  openFullMap,
  setOpenFullMap,
  setTotal,
  switchMap,
}) => {
  const router = useRouter();
  const {messages} = useIntl();
  const dispatch = useDispatch();
  const swiperRef = useRef(null);
  const [itemPost, setItemPost] = useState([]);
  const [arrMarker, setArrMarker] = useState([]);
  const [shape, setShape] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [googleObj, setGoogleObj] = useState(null);
  const [eventDragEnd, setEventDragEnd] = useState(null);
  const {accessToken} = useSelector(({auth}) => auth);
  const [isMobile, setIsMobile] = useState(false);
  const [itemPostActice, setItemPostActive] = useState('');
  const [zoomMap, setZoomMap] = useState(12);
  const [infoWindows, setInfoWindows] = useState([]);
  const [timeOuts, setTimeOuts] = useState([]);
  const provinces = useSelector((state) => state.provinces);
  const provincesFilter = provinces.provinces ?? [];
  const [openModal, setOpenModal] = useState(false);
  const [dragMap, setDragMap] = useState(false);
  const [instanceMap, setInstanceMap] = useState(null);
  const [isDisplay, setIsDisplay] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setIsDisplay(true);
      const timeOut = setTimeout(() => {
        setIsDisplay(false);
      }, 3000);
      return () => {
        clearTimeout(timeOut);
      };
    }
  }, [isLoading]);

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
    zoom: 12,
    center: {lat: 0, lng: 0},
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
  };

  const handerZoomChange = () => {
    if (window.myMap) {
      const zoomLevel = window.myMap.getZoom();
      setZoomMap(zoomLevel);
    }
  };
  const debounceZoom = useDebounce(zoomMap, 600);

  useEffect(() => {
    loader
      .load()
      .then((google) => {
        setGoogleObj(google);
        const mapInstance = initMap(google, 'maps', mapOptions);
        setMap(mapInstance);
        setInstanceMap(mapInstance);
        window.myMap = mapInstance;
        const infoWindowInstance = new window.google.maps.InfoWindow();
        google.maps.event.addListenerOnce(
          mapInstance,
          'tilesloaded',
          function () {
            let location = {};
            let province;
            let district;
            const provinceCodes = mapDataObj?.provinceCodes[0] || '';
            const districtCodes = mapDataObj?.districtCodes[0] || '';
            const wardCodes = mapDataObj?.wardCodes[0] || '';
            if (provinceCodes) {
              province = provincesFilter.find(
                (item) => item?.code === provinceCodes,
              );
              location = province?.location;
              if (districtCodes) {
                fetchDistricts(province?.code).then((data) => {
                  const disctrictsFilter = data?.data ?? [];
                  district = disctrictsFilter.find(
                    (item) => item?.code === districtCodes,
                  );
                  location = district?.location;
                });
              }
              if (wardCodes) {
                fetchWards(province?.code, district?.code).then((data) => {
                  const wardsFilter = data?.data ?? [];
                  let ward = wardsFilter.find(
                    (item) => item?.code === wardCodes,
                  );
                  location = ward?.location;
                });
              }
              const isEmptyObj = !Object?.keys(location || {}).length;
              if (!isEmptyObj) mapInstance.setCenter(location);
              const latlngbounds = mapInstance.getBounds();
              initFitAllBounds(latlngbounds);
            } else {
              location = {lat: 16.047079, lng: 108.20623}; // default
              mapInstance.setCenter(location);
              const latlngbounds = mapInstance.getBounds();
              initFitAllBounds(latlngbounds);
              console.log('3');
            }
          },
        );

        // Handle Dragend Map
        const dragendEvent = google.maps.event.addListener(
          mapInstance,
          'dragend',
          function () {
            setDragMap(true);
          },
        );
        setEventDragEnd(dragendEvent);
      })
      .catch((e) => {
        // do something
      });
  }, []);

  useEffect(() => {
    let eventZoomChange;
    if (map) {
      if (!triggerZoom) setTriggerZoom(true);
      eventZoomChange = google.maps.event.addListener(
        map,
        'zoom_changed',
        handerZoomChange,
      );
    }
    return () => {
      google?.maps.event.removeListener(eventZoomChange);
    };
  }, [map]);

  const moveToYourLocation = () => {
    if (!map) return;
    const infoWindowInstance = new window.google.maps.InfoWindow();
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          const myLatlng = new google.maps.LatLng(pos.lat, pos.lng);
          const marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            open: true,
            disableAutoPan: true,
            draggable: false,
          });
          infoWindowInstance?.setPosition(pos);
          infoWindowInstance?.setContent(
            `<div class='infoWindow_map'>${messages['common.locationAccessUser']}</div>`,
          );
          infoWindowInstance.open(map, marker);
          map.setCenter(pos);
          const latlngbounds = map.getBounds();
          initFitAllBoundsWithYourLocation(latlngbounds);
        },
        () => {
          handleLocationError(true, infoWindowInstance, map.getCenter());
        },
      );
    } else {
      handleLocationError(false, infoWindowInstance, map.getCenter());
    }
    function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      infoWindow.setPosition(pos);
      infoWindow.setContent(
        `<div class='infoWindow_map'>${
          browserHasGeolocation
            ? messages['common.infoWindown']
            : messages['common.infoWindown']
        }</div>`,
        // browserHasGeolocation
        //   ? 'Error: The Geolocation service failed.'
        //   : "Error: Your browser doesn't support geolocation.",
      );
      infoWindow.open(map);
    }
  };
  const handleClickDrawActive = () => {
    const normalColor = '#d1132a';
    setIsActive((active) => !active);
    deleteButton.classList.add('show');
    document.getElementById('maps').classList.toggle('moving');
    map.setOptions({draggable: false});
    setItemPost([]);

    const eMouseDown = google.maps.event.addDomListener(
      map,
      'mousedown',
      function (e) {
        drawFreeHand();
      },
    );

    function drawFreeHand() {
      let dOptions = {
        clickable: false,
        fillColor: 'transparent',
        fillOpacity: 0.5,
        strokeWeight: 2,
        strokeColor: normalColor,
        zIndex: 1,
        map: map,
      };
      let poly = new google.maps.Polyline(dOptions);
      let events = google.maps.event;
      // move-listener
      let move = events.addListener(map, 'mousemove', function (e) {
        poly.getPath().push(e.latLng);
      });

      const eMouseUpMap = events.addListenerOnce(map, 'mouseup', function (e) {
        events.removeListener(move);

        var path = poly.getPath();
        if (path.length > 0) {
          poly.setMap(null);

          poly = new google.maps.Polygon(dOptions);
          // poly.setMap(mapInstance);
          poly.setPaths(path);

          setShape(poly);
          setIsActive(false);
          setIsDisabled(true);
          map.setOptions({draggable: true});
        }
        events.clearListeners(map, 'mousedown');
      });
    }
  };

  const handleRemovePolygon = () => {
    if (shape != null) {
      shape?.setMap(null);
      const dragEvent = googleObj.maps.event.addListener(
        map,
        'dragend',
        function (e) {
          setDragMap(true);
        },
      );
      setEventDragEnd(dragEvent);
      setShape(null);
      setIsDisabled(false);
      setIsActive(false);
      getPolygonsByCircle();
      const deleteButton = document.getElementById('deleteButton');
      deleteButton.classList.remove('show');
    }
  };

  const handleChangeLayer = () => {
    if (instanceMap.getMapTypeId() === 'roadmap') {
      instanceMap.setMapTypeId('hybrid');
    } else {
      instanceMap.setMapTypeId('roadmap');
    }
  };

  const handleZoomIn = () => {
    instanceMap.setZoom(instanceMap.getZoom() + 1);
  };
  const handleZoomOut = () => {
    instanceMap.setZoom(instanceMap.getZoom() - 1);
  };
  function initFitAllBoundsWithYourLocation(bounds) {
    let NE = bounds.getNorthEast();
    let SW = bounds.getSouthWest();
    let NW = new google.maps.LatLng(NE.lat(), SW.lng());
    let SE = new google.maps.LatLng(SW.lat(), NE.lng());
    let polygons = [
      {lat: NE.lat(), lng: NE.lng()},
      {lat: NW.lat(), lng: NW.lng()},
      {lat: SW.lat(), lng: SW.lng()},
      {lat: SE.lat(), lng: SE.lng()},
      {lat: NE.lat(), lng: NE.lng()},
    ];
    setMapDataObj({
      ...mapDataObj,
      provinceCodes: [],
      provinceText: '',
      districtCodes: [],
      districtText: '',
      wardCodes: [],
      wardText: '',
      polygon: polygons,
    });
    form.setFieldsValue({
      cityHeader: '',
      provinces: '',
      districts: '',
      wards: '',
    });
    setIsReloadMap(true);
  }
  function initFitAllBounds(bounds) {
    let NE = bounds.getNorthEast();
    let SW = bounds.getSouthWest();
    let NW = new google.maps.LatLng(NE.lat(), SW.lng());
    let SE = new google.maps.LatLng(SW.lat(), NE.lng());
    let polygons = [
      {lat: NE.lat(), lng: NE.lng()},
      {lat: NW.lat(), lng: NW.lng()},
      {lat: SW.lat(), lng: SW.lng()},
      {lat: SE.lat(), lng: SE.lng()},
      {lat: NE.lat(), lng: NE.lng()},
    ];
    setMapDataObj({...mapDataObj, polygon: polygons});

    setIsReloadMap(true);
  }
  function getPolygonsByCircle() {
    const bounds = window.myMap.getBounds();
    let NE = bounds.getNorthEast();
    let SW = bounds.getSouthWest();
    let NW = new google.maps.LatLng(NE.lat(), SW.lng());
    let SE = new google.maps.LatLng(SW.lat(), NE.lng());
    let polygons = [
      {lat: NE.lat(), lng: NE.lng()},
      {lat: NW.lat(), lng: NW.lng()},
      {lat: SW.lat(), lng: SW.lng()},
      {lat: SE.lat(), lng: SE.lng()},
      {lat: NE.lat(), lng: NE.lng()},
    ];
    setMapDataObj({...mapDataObj, polygon: polygons});

    setIsReloadMap(true);
  }

  useEffect(() => {
    if (map && dragMap) {
      getPolygonsByCircle();
      setDragMap(false);
    }
  }, [dragMap]);

  const fetchAPI = async () => {
    const resultData = await fetchSearchPolygon(mapDataObj, accessToken);
    setIsReloadMap(false);
    const item = resultData?.data?.elements ?? [];
    setItemPost(item);
    const total = resultData?.data?.elements.length ?? 0;
    setTotal(total);
    setIsLoading(false);
  };

  useEffect(() => {
    if (mapDataObj?.polygon?.length > 0 && isReloadMap) {
      setIsLoading(true);
      fetchAPI();
    }
  }, [isReloadMap]);

  useEffect(() => {
    const markers = [];
    const infoArr = [];
    const toArr = [];

    for (let i = 0; i < arrMarker?.length; i++) {
      google.maps.event.clearListeners(arrMarker[i], 'click');
      arrMarker[i].setMap(null);
    }
    for (let i = 0; i < infoWindows?.length; i++) {
      google.maps.event.clearListeners(infoWindows[i], 'domready');
      infoWindows[i].close();
    }
    for (let i = 0; i < timeOuts?.length; i++) {
      clearTimeout(timeOuts[i]);
    }
    for (let i = 0; i < itemPost.length; i++) {
      let data = itemPost[i];
      let myLatlng = new google.maps.LatLng(data.lat, data.lng);
      let marker = new google.maps.Marker({
        icon: {
          url:
            mapDataObj?.types[0] == 'du-an'
              ? markerProject.src
              : mapDataObj?.types[0] == 'bds-ban'
              ? markerSale.src
              : mapDataObj?.types[0] == 'bds-cho-thue'
              ? markerRent.src
              : markerMa.src,
          size: new google.maps.Size(20, 20),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(5, 5),
          scaledSize: new google.maps.Size(15, 15),
        },
        position: myLatlng,
        map: window.myMap,
        title: data.titleText,
        price: data.price,
        id: data.id,
        open: true,
        disableAutoPan: true,
        url: data.permalink,
        draggable: false,
        priceText: data.priceText,
      });
      let type;
      if (data?.priority?.code === 'DT_VIP') {
        type = 'VIP';
      } else if (data?.priority?.code === 'DT_NOIBAT') {
        type = 'HOT';
      }
      let infoWindow = new google.maps.InfoWindow({
        content: `<div id='marker-${data.id}' class='infoWindow_map marker-${
          mapDataObj?.types[0]
        }'><a href='#${data.id}' data-id='${data.id}'>${
          data.priceText || ''
        }</a></div>`,
        disableAutoPan: true,
      });

      const newInfoWindow = new google.maps.InfoWindow({
        content: `<div id='label-${data.id}' class='label-post ${type}'><div class='label-post-child ${type}'>${type}</div></div>`,
        disableAutoPan: true,
        pixelOffset: new google.maps.Size(data.priceText.length * 3, -18),
        zIndex: 9999,
      });

      infoArr.push(infoWindow);
      if (zoomMap >= 12) {
        // Zoom >= 12: Hiển thị rõ giá từng loại tin
        const to = setTimeout(() => {
          infoWindow.open(window.myMap, marker);
          if (type) {
            newInfoWindow.open(window.myMap, marker);
          }
        }, 1000);
        toArr.push(to);
      } else if (zoomMap >= 6 && zoomMap <= 11) {
        // Zoom 6-11: Hiển thị tin Vip + Hot + Chấm đỏ tin thường
        if (type) {
          infoWindow.open(window.myMap, marker);
          newInfoWindow.open(window.myMap, marker);
          // newInfoWindow.pixelOffset = new google.maps.Size(
          //   data.priceText.length * 6,
          //   -18,
          // );
        }
        if (!type) {
          infoWindow.close();
        }
      } else if (zoomMap <= 5) {
        // Zoom 0-5:
        if (type === 'VIP') {
          // TH2: Khi hệ thống có tin Vip -> Chỉ hiển thị tin Vip
          newInfoWindow.open(window.myMap, marker);
          infoWindow.open(window.myMap, marker);
        } else {
          // TH1: Khi hệ thống không có tin Vip -> Chỉ hiển thị Chấm đỏ
          newInfoWindow.close();
        }
      }

      google.maps.event.addListener(infoWindow, 'domready', function () {
        const InfoDiv = document.getElementById(`marker-${data?.id}`);
        InfoDiv?.addEventListener('click', function (e) {
          e.preventDefault();
          swiperRef.current.slideToLoop(i);
          let id_marker = data?.id;
          const window_map = document.querySelectorAll('.infoWindow_map');
          const parent_marker = document.querySelectorAll('.gm-style-iw-t');
          for (let i = 0; i < window_map.length; i++) {
            window_map[i].classList.remove('active');
          }
          for (let i = 0; i < parent_marker.length; i++) {
            parent_marker[i].classList.remove('active');
          }
          document
            .querySelector(`#marker-${id_marker}`)
            .classList.add('active');
          document
            .querySelector(`#marker-${id_marker}`)
            .closest('.gm-style-iw-t')
            .classList.add('active');
          const postItem = document.getElementById(id_marker);
          postItem?.classList.add('item-active');
          setItemPostActive(id_marker);
        });
      });
      // google.maps.event.addListener(newInfoWindow, 'domready', function () {
      //   const InfoDiv = document.getElementById(`label-${data.id}`);
      //   InfoDiv?.addEventListener('click', function (e) {
      //     e.preventDefault();
      //     swiperRef.current.slideToLoop(i);
      //   });
      // });
      markers.push(marker);
      marker.addListener('click', (e) => {
        let id_marker = data.id;
        swiperRef.current.slideToLoop(i);
        // const window_map = document.querySelectorAll('.infoWindow_map');
        // const parent_marker = document.querySelectorAll('.gm-style-iw-t');
        // for (let i = 0; i < window_map.length; i++) {
        //   window_map[i].classList.remove('active');
        // }
        // for (let i = 0; i < parent_marker.length; i++) {
        //   parent_marker[i].classList.remove('active');
        // }
        if (
          document.querySelector(
            "div.infoWindow_map a[data-id='" + id_marker + "']",
          )
        ) {
          document
            .querySelector("div.infoWindow_map a[data-id='" + id_marker + "']")
            .click();
          document
            .querySelector(`#marker-${id_marker}`)
            .classList.add('active');
          document
            .querySelector(`#marker-${id_marker}`)
            .closest('.gm-style-iw-t')
            .classList.add('active');
        }
        // else {
        //   if (document.getElementById(`hashtag-${id_marker}`))
        //     document.getElementById(`hashtag-${id_marker}`).click();
        // }
        const postItem = document.getElementById(id_marker);
        postItem?.classList.add('item-active');
        setItemPostActive(id_marker);
      });
    }
    setArrMarker(markers);
    setInfoWindows(infoArr);
    setTimeOuts(toArr);
    return () => {
      for (let i = 0; i < arrMarker?.length; i++) {
        google.maps.event.clearListeners(arrMarker[i], 'click');
      }
      for (let i = 0; i < infoWindows?.length; i++) {
        google.maps.event.clearListeners(infoWindows[i], 'domready');
      }
      for (let i = 0; i < toArr?.length; i++) {
        clearTimeout(toArr[i]);
      }
    };
  }, [itemPost]);

  useEffect(() => {
    console.log('zoomMap', zoomMap);
    const timeOutArr = [];
    if (map && debounceZoom && triggerZoom) {
      for (let i = 0; i < infoWindows?.length; i++) {
        infoWindows[i].close();
      }
      for (let i = 0; i < timeOuts?.length; i++) {
        clearTimeout(timeOuts[i]);
      }
      for (let i = 0; i < arrMarker?.length; i++) {
        if (zoomMap >= 14) {
          let timeout = setTimeout(() => {
            infoWindows[i].open(map, arrMarker[i]);
          }, 1000);
          timeOutArr.push(timeout);
        } else {
          infoWindows[i].close();
        }
      }
      if (timeOutArr.length > 0) setTimeOuts(timeOutArr);
      if (!shape) getPolygonsByCircle();
    }
    return () => {
      for (let i = 0; i < timeOutArr?.length; i++) {
        clearTimeout(timeOutArr[i]);
      }
    };
  }, [debounceZoom]);

  useEffect(() => {
    if (googleObj && map) {
      if (!isActive) {
        if (shape == null) {
          googleObj.maps.event.clearListeners(map, 'mousedown');
          googleObj.maps.event.clearListeners(map, 'mouseup');
          map.setOptions({draggable: true});
          setIsDisabled(false);
          getPolygonsByCircle();
          const deleteButton = document.getElementById('deleteButton');
          deleteButton.classList.remove('show');
        }
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (shape != null) {
      let path = shape.getPath();
      if (path) {
        const polygons = path.getArray().map((item) => {
          return {
            lat: item.lat(),
            lng: item.lng(),
          };
        });
        setMapDataObj({...mapDataObj, polygon: polygons});
        setIsReloadMap(true);
      }
    }
  }, [shape]);

  useEffect(() => {
    if (shape != null) {
      googleObj.maps.event.removeListener(eventDragEnd);
    }
  }, [shape]);

  useEffect(() => {
    if (itemPostActice !== '') {
      for (let i = 0; i < itemPost.length; i++) {
        if (itemPost[i].id !== itemPostActice) {
          const postItem = document.getElementById(itemPost[i].id);
          postItem?.classList.remove('item-active');
        }
      }
    }
  }, [itemPostActice]);

  // check mobile
  const handleResize = () => {
    if (window.innerWidth < 992) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  };
  // resize on mobile
  useEffect(() => {
    window.addEventListener('resize', handleResize);
  });

  const handleClickBtnCustomMap = () => {
    setOpenFullMap(!openFullMap);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
      block: 'end',
    });
    if (openFullMap) {
      setIsReloadMap(true);
    }
  };

  const currencyFormat = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const [activeIndexSlide, setActiveIndexSlide] = useState(0);
  const [itemMapCurrent, setItemMapCurrent] = useState(null);

  useEffect(() => {
    if (itemPost?.length > 0 && itemMapCurrent === null) {
      setItemMapCurrent(itemPost[0]);
      setActiveIndexSlide(0);
    }
  }, [activeIndexSlide]);

  useEffect(() => {
    if (!itemMapCurrent) return;
    const itemId = itemMapCurrent?.id;
    const col_item = document.querySelectorAll('.col-item');
    const window_map = document.querySelectorAll('.infoWindow_map');
    const parent_marker = document.querySelectorAll('.gm-style-iw-t');
    const parents = document.querySelectorAll('.hidden_zindex');
    col_item.forEach((el) => el.classList.remove('item-active'));
    window_map.forEach((el) => el.classList.remove('active'));
    parent_marker.forEach((el) => el.classList.remove('active'));
    parents.forEach((el) => el.classList.remove('hidden_zindex'));

    const markerElement = document.getElementById(`marker-${itemId}`);
    markerElement?.classList.add('active');
    markerElement?.closest('.gm-style-iw-t')?.classList.add('active');
    markerElement
      ?.closest('.gm-style-iw-a')
      ?.parentNode?.classList.add('hidden_zindex');
    // const currentIndex = itemPost?.findIndex((item) => item.id === itemId);
    // setActiveIndexSlide(currentIndex);
  }, [itemMapCurrent]);

  return (
    <>
      <div className='map-search'>
        <div className='map-content'>
          <div className='map-content-row'>
            <Button
              type='primary'
              className='btn-custom-map'
              onClick={handleClickBtnCustomMap}
            >
              {openFullMap ? (
                <IntlMessages id='common.zoomOut' />
              ) : (
                <IntlMessages id='common.zoomIn' />
              )}
            </Button>
            {!isReloadMap ? (
              <div
                className={`list-post ${
                  !openFullMap ? 'list-post-not-full-map' : 'list-post-full-map'
                }`}
              >
                <div className='load-item-taxonomy layout-list'>
                  {openFullMap ? (
                    <Swiper
                      slidesPerView={3}
                      spaceBetween={12}
                      loop={true}
                      centeredSlides={true}
                      modules={[Navigation]}
                      slideToClickedSlide={true}
                      className='mySwiperEx'
                      onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                      }}
                      onSlideChange={(swiperCore) => {
                        const {realIndex} = swiperCore;
                        const currentItem = itemPost[realIndex];
                        setItemMapCurrent(currentItem);
                        setActiveIndexSlide(realIndex);
                      }}
                      breakpoints={{
                        300: {
                          slidesPerView: 1,
                        },
                        768: {
                          slidesPerView: 1,
                        },
                        850: {
                          slidesPerView: 2,
                        },
                        1024: {
                          slidesPerView: 2,
                        },
                        1200: {
                          slidesPerView: 3,
                        },
                      }}
                    >
                      {itemPost?.map((item, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <CartItem
                              item={item}
                              isLoading={isLoading}
                              setOpenModal={setOpenModal}
                              key={index}
                              switchMap={switchMap}
                            />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  ) : (
                    <Swiper
                      slidesPerView={1}
                      spaceBetween={12}
                      loop={true}
                      centeredSlides={true}
                      modules={[Navigation]}
                      className='mySwiperEx'
                      onBeforeInit={(swiper) => {
                        swiperRef.current = swiper;
                      }}
                      onSlideChange={(swiperCore) => {
                        const {realIndex} = swiperCore;
                        const currentItem = itemPost[realIndex];
                        setItemMapCurrent(currentItem);
                        setActiveIndexSlide(realIndex);
                      }}
                    >
                      {itemPost?.map((item, index) => {
                        return (
                          <SwiperSlide key={index}>
                            <CartItem
                              item={item}
                              isLoading={isLoading}
                              setOpenModal={setOpenModal}
                              key={index}
                              switchMap={switchMap}
                            />
                          </SwiperSlide>
                        );
                      })}
                    </Swiper>
                  )}
                  {itemPost?.length > 0 && (
                    <div className='navigation-custom'>
                      <Button
                        type='outline'
                        onClick={() => swiperRef.current?.slidePrev()}
                        className='prev'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                        >
                          <path
                            d='M12.5 4.16699L7.5 10.0003L12.5 15.8337'
                            stroke='#6C6868'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </Button>
                      <Button
                        type='outline'
                        onClick={() => swiperRef.current?.slideNext()}
                        className='next'
                      >
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='20'
                          height='20'
                          viewBox='0 0 20 20'
                          fill='none'
                        >
                          <path
                            d='M7.5 4.16699L12.5 10.0003L7.5 15.8337'
                            stroke='#6C6868'
                            strokeWidth='1.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                          />
                        </svg>
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className='loading-map'>
                <Spin />
              </div>
            )}
            {isDisplay && (
              <div className='total-result-post'>
                <span style={{color: '#fff'}}>
                  {itemPost?.length > 0
                    ? `${currencyFormat(itemPost?.length)}/75 ${
                        messages['common.result']
                      }`
                    : messages['common.notFound']}
                </span>
              </div>
            )}
            <div className={`map-content-right data-${mapDataObj?.types[0]}`}>
              <div className='map' id='maps'></div>
              <div className='note-map'>
                <Space
                  direction='vertical'
                  style={{
                    width: '100%',
                  }}
                >
                  <Alert
                    description={<IntlMessages id='common.zoomInNoti' />}
                    type='info'
                    closable
                  />
                </Space>
              </div>

              <ControlMap
                isDisabled={isDisabled}
                isActive={isActive}
                handleClickDrawActive={handleClickDrawActive}
                moveToYourLocation={moveToYourLocation}
                handleRemovePolygon={handleRemovePolygon}
                handleChangeLayer={handleChangeLayer}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
              />
            </div>
          </div>
          <ModalLogin
            openModalLogin={openModal}
            setOpenModalLogin={setOpenModal}
            description={<IntlMessages id='common.notiLogin' />}
          />
        </div>
      </div>
    </>
  );
};

export default React.memo(MapView);
MapView.propTypes = {
  dataObject: PropTypes.any,
  setDataObject: PropTypes.func,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.func,
  setDisplayView: PropTypes.func,
  displayView: PropTypes.bool,
  map: PropTypes.any,
  setMap: PropTypes.func,
  form: PropTypes.any,
  setIsReloadMap: PropTypes.func,
  isReloadMap: PropTypes.bool,
  triggerZoom: PropTypes.bool,
  setTriggerZoom: PropTypes.func,
  setOpenFullMap: PropTypes.func,
  openFullMap: PropTypes.bool,
  setTotal: PropTypes.any,
  switchMap: PropTypes.bool,
};
