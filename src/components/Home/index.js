import CartItem from 'components/CartItem';
import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {initMap, loader} from 'shared/map/map';

const HomeComponent = () => {
  const [arrMarker, setArrMarker] = useState([]);
  const [infoWindows, setInfoWindows] = useState([]);
  const [mapInit, setMapInit] = useState(false);
  const [itemPostActice, setItemPostActive] = useState('');
  const [googleInit, setGoogleInit] = useState(null);
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
    console.log('polygons', polygons);
  }

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

  const dataObject = [
    {
      id: 2657262,
      titleText:
        'Chính chủ cần bán 9.021m2 đất 💥 Xã Ba, Đông Giang, giá đầu tư chỉ 1,3 tỷ Xã Ba, Huyện Đông Giang, Quảng Nam',
      typeRealEstate: {
        parent: 'bds-ban',
        code: '62',
        name: 'Khác',
      },
      postType: {
        parent: null,
        code: 'bds-ban',
        name: 'Mua bán',
        color: 'D1132A',
      },
      address: 'Xã Ba, Huyện Đông Giang, Tỉnh Quảng Nam',
      lat: 15.957113668347738,
      lng: 107.92216181055187,
      squareText: '9.021 m²',
      price: 1300000000,
      priceText: '1,3 tỷ',
      postDate: '16/10/2024',
      postDateDuration: '3 ngày trước',
      thumbnailUrl:
        'https://static.vars.vn/land/posts/1729135181822/2024/10/17/thumbnail-6975816f-429e-4d44-b018-96cfac7f6bb1.jpg',
      detailUrl:
        'https://varsland.vn/bds-ban/chinh-chu-can-ban-9-021m2-dat-xa-ba-dong-giang-gia-dau-tu-chi-1-3-ty-xa-ba-huyen-dong-giang-quang-nam-1729135181880',
    },
    {
      id: 2577428,
      titleText: 'Bán Nhà mặt phố 436m² Xã Hòa Phú, Huyện Hòa Vang, Đà Nẵng',
      typeRealEstate: {
        parent: 'bds-ban',
        code: '6',
        name: 'Nhà mặt phố',
      },
      postType: {
        parent: null,
        code: 'bds-ban',
        name: 'Mua bán',
        color: 'D1132A',
      },
      address: 'Xã Hòa Phước, Huyện Hòa Vang, Thành phố Đà Nẵng',
      lat: 15.985613045082323,
      lng: 108.07455707649257,
      squareText: '436 m²',
      price: 3500000000,
      priceText: '3,5 tỷ',
      postDate: '23/09/2024',
      postDateDuration: '23/09/2024',
      thumbnailUrl:
        'https://static.vars.vn/land/posts/1727160778016/2024/09/24/thumbnail-5ee41f34-817d-4769-88d3-0dcb9cd5ed71.jpg',
      detailUrl:
        'https://varsland.vn/bds-ban/ban-nha-mat-pho-436m-xa-hoa-phu-huyen-hoa-vang-da-nang-1727160778264',
    },
    {
      id: 2565863,
      titleText:
        'Chủ cần bán Đất nền riêng lẻ 200m² Xã Đại Quang, Huyện Đại Lộc, Quảng Nam',
      typeRealEstate: {
        parent: 'bds-ban',
        code: '110',
        name: 'Đất nền riêng lẻ',
      },
      postType: {
        parent: null,
        code: 'bds-ban',
        name: 'Mua bán',
      },
      address: 'Xã Đại Quang, Huyện Đại Lộc, Tỉnh Quảng Nam',
      lat: 15.873877298243004,
      lng: 108.06251435482974,
      squareText: '200 m²',
      price: 760000000,
      priceText: '760 triệu',
      postDate: '17/09/2024',
      postDateDuration: '17/09/2024',
      thumbnailUrl:
        'https://static.vars.vn/land/posts/1726979967850/2024/09/22/thumbnail-1aae8cf3-fbee-4a22-967c-8135c31a9d53.jpg',
      detailUrl:
        'https://varsland.vn/bds-ban/chu-can-ban-dat-nen-rieng-le-200m-xa-dai-quang-huyen-dai-loc-quang-nam-1726979967965',
    },
    {
      id: 2565863,
      titleText:
        'Cần bán Đất nền riêng lẻ 200m² Xã Đại Đồng, Huyện Đại Lộc, Quảng Nam',
      typeRealEstate: {
        parent: 'bds-ban',
        code: '110',
        name: 'Đất nền riêng lẻ',
      },
      postType: {
        parent: null,
        code: 'bds-ban',
        name: 'Mua bán',
      },
      address: 'Lỗ Giáng 19, Phường Hòa Xuân, Quận Cẩm Lệ, Thành phố Đà Nẵng',
      lat: 16.0019983,
      lng: 108.2199588,
      squareText: '200 m²',
      price: 760000000,
      priceText: '760 triệu',
      postDate: '17/09/2024',
      postDateDuration: '17/09/2024',
      thumbnailUrl:
        'https://static.vars.vn/land/posts/1726979967850/2024/09/22/thumbnail-1aae8cf3-fbee-4a22-967c-8135c31a9d53.jpg',
      detailUrl:
        'https://varsland.vn/bds-ban/chu-can-ban-dat-nen-rieng-le-200m-xa-dai-quang-huyen-dai-loc-quang-nam-1726979967965',
    },
    {
      id: 2565863,
      titleText:
        'Đường Phạm Như Xương, Phường Điện Ngọc, Thị xã Điện Bàn, Tỉnh Quảng Nam',
      typeRealEstate: {
        parent: 'bds-ban',
        code: '110',
        name: 'Đất nền riêng lẻ',
      },
      postType: {
        parent: null,
        code: 'bds-ban',
        name: 'Mua bán',
      },
      address: 'Xã Đại Đồng, Huyện Đại Lộc, Tỉnh Quảng Nam',
      lat: 15.954530687643652,
      lng: 108.2420887130172,
      squareText: '200 m²',
      price: 760000000,
      priceText: '760 triệu',
      postDate: '17/09/2024',
      postDateDuration: '17/09/2024',
      thumbnailUrl:
        'https://static.vars.vn/land/posts/1726979967850/2024/09/22/thumbnail-1aae8cf3-fbee-4a22-967c-8135c31a9d53.jpg',
      detailUrl:
        'https://varsland.vn/bds-ban/chu-can-ban-dat-nen-rieng-le-200m-xa-dai-quang-huyen-dai-loc-quang-nam-1726979967965',
    },
    {
      id: 2565863,
      titleText:
        'Cầu Diễn, Phường Phúc Diễn, Quận Bắc Từ Liêm, Thành phố Hà Nội',
      typeRealEstate: {
        parent: 'bds-ban',
        code: '110',
        name: 'Đất nền riêng lẻ',
      },
      postType: {
        parent: null,
        code: 'bds-ban',
        name: 'Mua bán',
      },
      address: 'Xã Đại Đồng, Huyện Đại Lộc, Tỉnh Quảng Nam',
      lat: 21.0405099070889,
      lng: 105.75973266759571,
      squareText: '200 m²',
      price: 760000000,
      priceText: '760 triệu',
      postDate: '17/09/2024',
      postDateDuration: '17/09/2024',
      thumbnailUrl:
        'https://static.vars.vn/land/posts/1726979967850/2024/09/22/thumbnail-1aae8cf3-fbee-4a22-967c-8135c31a9d53.jpg',
      detailUrl:
        'https://varsland.vn/bds-ban/chu-can-ban-dat-nen-rieng-le-200m-xa-dai-quang-huyen-dai-loc-quang-nam-1726979967965',
    },
    {
      id: 2565863,
      titleText:
        'Cổ Nhuế, Phường Cổ Nhuế 1, Quận Bắc Từ Liêm, Thành phố Hà Nội',
      typeRealEstate: {
        parent: 'bds-ban',
        code: '110',
        name: 'Đất nền riêng lẻ',
      },
      postType: {
        parent: null,
        code: 'bds-ban',
        name: 'Mua bán',
      },
      address: 'Xã Đại Đồng, Huyện Đại Lộc, Tỉnh Quảng Nam',
      lat: 21.051583981643578,
      lng: 105.78605949897172,
      squareText: '200 m²',
      price: 760000000,
      priceText: '760 triệu',
      postDate: '17/09/2024',
      postDateDuration: '17/09/2024',
      thumbnailUrl:
        'https://static.vars.vn/land/posts/1726979967850/2024/09/22/thumbnail-1aae8cf3-fbee-4a22-967c-8135c31a9d53.jpg',
      detailUrl:
        'https://varsland.vn/bds-ban/chu-can-ban-dat-nen-rieng-le-200m-xa-dai-quang-huyen-dai-loc-quang-nam-1726979967965',
    },
  ];

  useEffect(() => {
    loader
      .load()
      .then((google) => {
        const mapInstance = initMap(google, 'map-home', mapOptions);
        setMapInit(mapInstance);
        google.maps.event.addListenerOnce(
          mapInstance,
          'tilesloaded',
          function () {
            let location = {lat: 16.047079, lng: 108.20623}; // default
            mapInstance.setCenter(location);
            const latlngbounds = mapInstance.getBounds();
            initFitAllBounds(latlngbounds);
            console.log('3');
          },
        );
      })
      .catch((e) => {
        // do something
      });
  }, []);

  useEffect(() => {
    const markers = [];
    const infoArr = [];
    for (let i = 0; i < arrMarker?.length; i++) {
      google.maps.event.clearListeners(arrMarker[i], 'click');
      arrMarker[i].setMap(null);
    }
    for (let i = 0; i < infoWindows?.length; i++) {
      google.maps.event.clearListeners(infoWindows[i], 'domready');
      infoWindows[i].close();
    }
    for (let i = 0; i < dataObject?.length; i++) {
      let data = dataObject[i];
      let myLatlng = new google.maps.LatLng(data.lat, data.lng);
      let marker = new google.maps.Marker({
        icon: {
          url: '',
          size: new google.maps.Size(20, 20),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(5, 5),
          scaledSize: new google.maps.Size(15, 15),
        },
        position: myLatlng,
        map: mapInit,
        title: data.titleText,
        price: data.price,
        id: data.id,
        open: true,
        disableAutoPan: true,
        url: data.permalink,
        draggable: false,
        priceText: data.priceText,
      });
      let infoWindow = new google.maps.InfoWindow({
        content: `<div id='marker-${
          data.id
        }' class='infoWindow_map'><a href='#${data.id}' data-id='${data.id}'>${
          data.priceText || ''
        }</a></div>`,
        disableAutoPan: true,
      });
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
      markers?.push(marker);
      marker.addListener('click', (e) => {
        let id_marker = data.id;
        swiperRef.current.slideToLoop(i);
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
        const postItem = document.getElementById(id_marker);
        postItem?.classList.add('item-active');
        setItemPostActive(id_marker);
      });
    }
    setArrMarker(markers);
    setInfoWindows(infoArr);
    return () => {
      for (let i = 0; i < arrMarker?.length; i++) {
        google.maps.event.clearListeners(arrMarker[i], 'click');
      }
      for (let i = 0; i < infoWindows?.length; i++) {
        google.maps.event.clearListeners(infoWindows[i], 'domready');
      }
    };
  }, [dataObject]);
  return (
    <>
      {/* <div className='lists'>
        <CartItem />
        <CartItem />
        <CartItem />
        <CartItem />
      </div> */}
      <div
        className='map'
        id='map-home'
        style={{height: '100vh', width: '100%'}}
      ></div>
    </>
  );
};

export default HomeComponent;
