import {Col, Form, Radio, Row} from 'antd';
import React from 'react';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import {useEffect} from 'react';
import {useState} from 'react';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {onChangeParamUrl} from 'components/SearchComponent';
import {useRouter} from 'next/router';
import {GOOGLE_ADS_ENABLED} from 'shared/constants/ConfigApp';
import AdsBannerVertical from 'components/AdsBannerVertical';

const Sidebar = ({
  form,
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
  switchMap,
  onChangeSearchParam,
  onChangeMapSearchParam,
  setIsReload,
  setIsReloadMap,
  setCurrentPage,
  objLocation,
  setObjLocation,
}) => {
  const {messages} = useIntl();
  const router = useRouter();
  const provincesState = useSelector((state) => state.provinces);
  const provincesFilter = provincesState?.provinces ?? [];
  const [provinceOptions, setProvinceOptions] = useState([]);

  const {categories} = useSelector((state) => state.categories);
  const [pricesOption, setPricesOption] = useState([]);
  const [pricesOptionRent, setPricesOptionRent] = useState([]);
  const [postType, setPostType] = useState('');
  useEffect(() => {
    if (categories) {
      const realPriceCat =
        categories?.categories?.realEstatePriceFilterCat ?? [];
      let pricesOptionMock = [
        // { label: messages['common.all'], value: '', code: '' },
      ];
      let pricesOptionRentMock = [
        // { label: messages['common.all'], value: '', code: '' },
      ];
      realPriceCat?.forEach((ele) => {
        let options = {
          label: ele?.name,
          value: ele?.metadata,
          code: ele?.code,
        };
        if (ele?.parent === '') {
          pricesOptionRentMock?.push(options);
        }
        if (ele?.parent === 'bds-cho-thue') {
          pricesOptionRentMock?.push(options);
        } else {
          pricesOptionMock?.push(options);
        }
      });
      setPricesOptionRent(pricesOptionRentMock);
      setPricesOption(pricesOptionMock);
    }
  }, [categories, dataObject?.types]);

  const nFormatterPrice = (num) => {
    if (num >= 1000000000) {
      return (
        (num / 1000000000).toFixed(1).replace(/\.0$/, '') +
        ' ' +
        messages['common.billion']
      );
    }
    if (num >= 1000000) {
      return (
        (num / 1000000).toFixed(1).replace(/\.0$/, '') +
        ' ' +
        messages['common.million']
      );
    }
    return num;
  };

  useEffect(() => {
    let currentPostType = !switchMap
      ? dataObject?.types ?? ''
      : mapDataObj?.types[0] ?? '';
    setPostType(currentPostType);
  }, [dataObject, mapDataObj]);

  useEffect(() => {
    if (provincesFilter) {
      const newProvinces = [];
      provincesFilter?.forEach((item) => {
        newProvinces?.push(item);
      });
      setProvinceOptions(newProvinces);
    }
  }, [provincesState]);

  const handleChangePrice = (e) => {
    const value = e.target.value;
    let updatedUrl;
    if (value !== '' && value !== null && Number(value) !== -1) {
      const priceArr = value?.split('-')?.map(Number);
      updatedUrl = onChangeParamUrl('priceRange', priceArr);
    } else if (Number(value) === -1) {
      updatedUrl = onChangeParamUrl('priceRange', [-1, -1]);
    } else {
      updatedUrl = onChangeParamUrl('priceRange', []);
    }
    router.push(updatedUrl, undefined, {shallow: true});

    let price_from, price_to, price_from_map, price_to_map;

    if (value === '') {
      price_from = '';
      price_to = '';
      price_from_map = '';
      price_to_map = '';
    } else if (value === '-1') {
      price_from = '-1';
      price_to = '-1';
      price_from_map = '-1';
      price_to_map = '-1';
    } else {
      const [priceFromRaw, priceToRaw] = value?.split('-');
      price_from = priceFromRaw.trim() || '0';
      price_to = priceToRaw.trim() || '50000000000';
      price_from_map =
        priceFromRaw.trim() === '' && priceToRaw.trim() === ''
          ? null
          : priceFromRaw;
      price_to_map =
        priceFromRaw.trim() === '' && priceToRaw.trim() === ''
          ? null
          : priceToRaw;
    }

    setDataObject({
      ...dataObject,
      priceFrom: price_from,
      priceTo: price_to,
    });
    setMapDataObj({
      ...mapDataObj,
      priceFrom: price_from_map,
      priceTo: price_to_map,
    });

    if (!switchMap) {
      onChangeSearchParam({priceFrom: price_from, priceTo: price_to, page: 1});
      setCurrentPage(1);
      setIsReload(true);
      form.setFieldsValue({
        price: [
          `${price_from ? price_from : '0'}`,
          `${price_to ? price_to : '50000000000'}`,
        ],
        priceHeader: value,
      });
    } else {
      onChangeMapSearchParam({
        priceFrom: price_from_map,
        priceTo: price_to_map,
      });
      setIsReloadMap(true);
      form.setFieldsValue({
        price: [`${price_from_map}`, `${price_to_map}`],
        priceHeader: value,
      });
    }
  };

  const handleChangeProvince = (e) => {
    const value = e.target.value;
    const provinceArr = provincesFilter?.find((item) => item?.code === value);
    if (value) {
      let updatedUrl = '';
      const provinceSlugText = provinceArr
        ? `${provinceArr?.slug}-t${value}`
        : '';
      updatedUrl = onChangeParamUrl('province', provinceSlugText);
      updatedUrl = onChangeParamUrl('district', '');
      updatedUrl = onChangeParamUrl('ward', '');
      router.push(updatedUrl, updatedUrl, {shallow: true});
    }
    const nameProvince = provinceArr?.name || '';
    const latlng = provinceArr?.location || {lat: 16.047079, lng: 108.20623};

    setDataObject({
      ...dataObject,
      provinceCodes: value === '' ? '' : value,
      provinceText: nameProvince,
      districtCodes: '',
      districtText: '',
      wardCodes: '',
      wardText: '',
    });

    setMapDataObj({
      ...mapDataObj,
      provinceCodes: value === '' ? [] : [value],
      provinceText: value === '' ? '' : nameProvince,
      districtCodes: [],
      districtText: [],
      wardCodes: [],
      wardText: [],
    });

    if (!switchMap) {
      onChangeSearchParam({
        provinceCodes: value === '' ? '' : value,
        provinceText: nameProvince,
        districtCodes: '',
        districtText: '',
        wardCodes: '',
        wardText: '',
        page: 1,
      });
      setIsReload(true);
    } else {
      window.myMap?.setCenter(latlng);
      const bounds = window.myMap?.getBounds();
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
      onChangeMapSearchParam({
        polygon: polygons,
        provinceCodes: value === '' ? [] : [value],
        provinceText: value === '' ? '' : nameProvince,
        districtCodes: [],
        districtText: [],
        wardCodes: [],
        wardText: [],
        page: 1,
      });
      setIsReloadMap(true);
    }

    form.setFieldsValue({
      provinces_head: value,
    });

    setObjLocation({
      provinceCode: value === '' ? '' : value,
      districtCode: '',
      wardCode: '',
    });

    form.setFieldsValue({
      text_location_head: provinceArr?.name,
    });
  };

  useEffect(() => {
    if (dataObject || mapDataObj) {
      const priceFrom = dataObject?.priceFrom;
      const priceTo = dataObject?.priceTo;
      const price = `${priceFrom ? priceFrom?.toString() : ''}-${
        priceTo ? priceTo?.toString() : ''
      }`;
      let priceSidebarObj = '';
      let priceFilter = '';
      if (priceFrom == '-1' && priceTo == '-1') {
        priceSidebarObj = '-1';
        priceFilter = [0, 50000000000];
      } else {
        priceSidebarObj = price;
        priceFilter = [`${priceFrom}`, `${priceTo}`];
      }

      form.setFieldsValue({
        provinceSidebar:
          dataObject?.provinceCodes === undefined
            ? ''
            : dataObject?.provinceCodes,
        priceSidebar: priceSidebarObj,
        price: priceFilter,
      });
    } else {
      const priceFrom = mapDataObj?.priceFrom;
      const priceTo = mapDataObj?.priceTo;
      const price = `${priceFrom ? priceFrom?.toString() : ''}-${
        priceTo ? priceTo?.toString() : ''
      }`;

      let priceSidebarMap = '';
      if (priceFrom == '-1' && priceTo == '-1') {
        priceSidebarMap = '-1';
      } else {
        priceSidebarMap = price;
      }

      form.setFieldsValue({
        provinceSidebar:
          mapDataObj?.provinceCodes === undefined
            ? []
            : mapDataObj?.provinceCodes[0],
        priceSidebar: priceSidebarMap,
      });
    }
  }, [dataObject, mapDataObj]);
  return (
    <div className='sidebar-search' style={{marginBottom: '24px'}}>
      <Form form={form}>
        <Row gutter={[0, 24]}>
          <Col xs={24} className='price box-sidebar'>
            <Row gutter={[0, 16]}>
              <Col xs={24}>
                <h4>
                  <IntlMessages id='common.priceRange' />
                </h4>
              </Col>
              <Col xs={24}>
                <Form.Item name='priceSidebar' initialValue={''}>
                  <Radio.Group>
                    {(postType === 'bds-cho-thue'
                      ? pricesOptionRent
                      : pricesOption
                    )?.map((item) => {
                      return (
                        <Radio
                          key={item?.value}
                          onChange={handleChangePrice}
                          value={item?.value}
                        >
                          {item?.label}
                        </Radio>
                      );
                    })}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Col>
          {GOOGLE_ADS_ENABLED && (
            <div className='banner-doc'>
              <AdsBannerVertical data-ad-slot='7837582945' />
            </div>
          )}
          <Col xs={24} className='province box-sidebar'>
            <Row gutter={[0, 16]}>
              <Col xs={24}>
                <h4>
                  <IntlMessages id='home.realEstateArea' />
                </h4>
              </Col>
              <Col xs={24}>
                <Form.Item name='provinceSidebar' initialValue={''}>
                  <Radio.Group>
                    {provinceOptions?.map((item) => {
                      return (
                        <Radio
                          key={item?.code}
                          onChange={handleChangeProvince}
                          value={item?.code}
                        >
                          {item?.name}
                        </Radio>
                      );
                    })}
                  </Radio.Group>
                </Form.Item>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Sidebar;
Sidebar.propTypes = {
  form: PropTypes.any,
  dataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  setDataObject: PropTypes.any,
  setMapDataObj: PropTypes.any,
  switchMap: PropTypes.any,
  onChangeMapSearchParam: PropTypes.func,
  onChangeSearchParam: PropTypes.func,
  setCurrentPage: PropTypes.any,
  setIsReload: PropTypes.any,
  setIsReloadMap: PropTypes.any,

  setObjLocation: PropTypes.any,
  objLocation: PropTypes.any,
};
