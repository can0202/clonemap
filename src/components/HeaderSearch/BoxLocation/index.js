import {Button, Col, Form, Input, Row, Select} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import {fetchDistricts} from 'pages/api/districts';
import {fetchWards} from 'pages/api/wards';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {useEffect} from 'react';
import {useState} from 'react';
import {onChangeParamUrl} from 'components/SearchComponent';
import {useRouter} from 'next/router';
import IconArrow from 'assets/icon/ArrowDown.png';
import {filterOptionSearch} from 'shared/constants/AppConst';

const BoxLocation = ({
  popupRef,
  isToggle,
  setIsToggle,
  form,
  switchMap,
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
  onChangeSearchParam,
  onChangeMapSearchParam,
  setCurrentPage,
  setIsReloadMap,
  setIsReload,
  provinceOptions,
  districtOptions,
  setDistrictsOptions,
  setWardsOptions,
  wardsOptions,
  isChangedKV,
  setIsChangedKV,
  setObjLocation,
  setDistricts,
  setWards,
  provincesFilter,
  setLatLngState,
  latlngState,
  setProvinces,
  awards,
  districts,
}) => {
  const handleToggle = () => {
    setIsToggle(!isToggle);
  };
  const router = useRouter();
  const {messages} = useIntl();
  const [provincesArr, setProvincesArr] = useState([]);
  const [distictArr, setDistictArr] = useState([]);
  const [wardArr, setWardArr] = useState([]);
  const [districtFetch, setDistrictFetch] = useState([]);
  const [wardFetch, setWardFetch] = useState([]);

  let newDistrictsOptions = [];
  let newWardsOptions = [];
  let districtResult;
  let wardResult;
  let itemTextHead = [];

  const getDistricts = async (provinceCode) => {
    const resultData = await fetchDistricts(provinceCode);
    const data = resultData?.data ?? [];
    setDistricts(data);
    return data;
  };

  const getWards = async (provinceCode, districtCode) => {
    const resultData = await fetchWards(provinceCode, districtCode);
    const data = resultData?.data ?? [];
    setWards(data);
    return data;
  };

  // Xử lý thay đổi Loại Thành phố

  const handleOnChangeProvinces = async (value, label) => {
    const provincesArr = provincesFilter?.filter(
      (item) => item?.code === value,
    );
    const provinceText = provincesFilter?.filter(
      (item) => item?.code === value,
    )?.[0]?.name;

    setProvincesArr(provincesArr);
    setIsChangedKV(true);
    form.setFieldsValue({
      districts_head: null,
      wards_head: null,
    });
    if (!switchMap) {
      setMapDataObj({
        ...mapDataObj,
        provinceCodes: value !== '' ? [value] : [],
        provinceText: provinceText,
        districtCodes: [],
        districtText: '',
        wardCodes: [],
        wardText: '',
      });
      onChangeSearchParam({
        provinceCodes: value === '' ? '' : value,
        provinceText: provinceText,
        districtCodes: '',
        districtText: '',
        wardText: '',
        wardCodes: '',
      });
      setProvinces(label?.label);
      setCurrentPage(1);
    } else {
      if (value !== '') {
        const province = provincesFilter?.filter(
          (item) => item?.code === value,
        );
        const latlng = province[0]?.location;
        setLatLngState(latlng);
        onChangeMapSearchParam({districtCodes: [], wardCodes: []});
      } else {
        // Nếu chọn tất cả sét về Đà Nẵng
        const province = provincesFilter?.filter((item) => item?.code === '48');
        const latlng = province[0]?.location;
        setLatLngState(latlng);
        onChangeMapSearchParam({
          provinceCodes: [],
          districtCodes: [],
          wardCodes: [],
        });
      }

      setDataObject({
        ...dataObject,
        provinceCodes: value === '' ? '' : value,
        provinceText: provinceText,
        districtCodes: '',
        districtText: '',
        wardText: '',
        wardCodes: '',
      });
    }
    const districtFetch = await getDistricts(value);
    setDistricts(districtFetch);
    setWards([]);
    setWardArr([]);
    setDistictArr([]);
    setDistrictFetch(districtFetch);
    districtFetch?.forEach((ele) => {
      let districtsOption = {
        provinId: value,
        label: ele?.name,
        value: ele?.code,
        metadata: ele?.slug,
      };
      newDistrictsOptions?.push(districtsOption);
    });
    setDistrictsOptions(newDistrictsOptions);
    setWardsOptions([]);
  };
  const onChangeDistrict = async (value, label) => {
    const distictArr = await districtOptions?.filter(
      (item) => item?.value === value,
    );
    const distictText = await districtOptions?.filter(
      (item) => item?.value === value,
    )?.[0]?.label;
    setDistictArr(distictArr);
    setIsChangedKV(true);
    form?.setFieldsValue({
      wards_head: null,
    });
    const cityCode = form.getFieldValue('provinces_head');
    const wardFetch = await getWards(cityCode, value);
    setWardFetch(wardFetch);
    wardFetch?.forEach((ele) => {
      let eleOption = {
        provinId: cityCode,
        label: ele?.name,
        value: ele?.code,
        metadata: ele?.slug,
      };
      newWardsOptions?.push(eleOption);
    });
    setWardsOptions(newWardsOptions);
    setWardArr([]);

    if (!switchMap) {
      setMapDataObj({
        ...mapDataObj,
        districtCodes: value !== '' ? [value] : [],
        districtText: distictText,
        wardCodes: [],
        wardText: '',
      });
      onChangeSearchParam({
        districtCodes: value,
        districtText: distictText,
        wardCodes: '',
        wardText: '',
      });
      setCurrentPage(1);
    } else {
      if (label?.label !== '') {
        onChangeMapSearchParam({
          districtCodes: [value],
          wardCodes: [],
        });
      } else {
        onChangeMapSearchParam({districtCodes: [], wardCodes: []});
      }
      setDataObject({
        ...dataObject,
        districtCodes: value,
        districtText: distictText,
        wardCodes: '',
        wardText: '',
      });
    }
  };
  const onChangeWards = async (value, label) => {
    const wardArr = await wardsOptions?.filter((item) => item?.value === value);
    setWardArr(wardArr);
    setIsChangedKV(true);
    if (!switchMap) {
      setMapDataObj({
        ...mapDataObj,
        wardCodes: value !== '' ? [value] : [],
        wardText: wardArr[0]?.label,
      });
      onChangeSearchParam({
        wardCodes: value,
        wardText: wardArr[0]?.label,
      });
      setCurrentPage(1);
    } else {
      if (label?.label !== '') {
        onChangeMapSearchParam({
          wardCodes: [value],
          wardText: wardArr[0]?.label,
        });
      } else {
        onChangeMapSearchParam({wardCodes: []});
      }
      setDataObject({
        ...dataObject,
        wardCodes: value,
        wardText: wardArr[0]?.label,
      });
    }
  };

  const onReset = () => {
    form.resetFields(['provinces_head']);
    form.resetFields(['districts_head']);
    form.resetFields(['wards_head']);
    setWardArr([]);
    setDistictArr([]);
    setProvincesArr([]);
    setDistricts([]);
    setWards([]);
    setIsChangedKV(false);
    if (!isChangedKV) {
      // setObjLocation({
      //   provinceCode: '',
      //   districtCode: '',
      //   wardCode: '',
      // });
      form.setFieldsValue({
        provinces_head: undefined,
        districts_head: undefined,
        wards_head: undefined,
      });
      setDataObject({
        ...dataObject,
        provinceCodes: '',
        districtCodes: '',
        wardCodes: '',
        provinceText: '',
        wardText: '',
        districtText: '',
        provinces: '',
        districts: '',
        wards: '',
      });
    }
  };

  const onSubmit = () => {
    let updatedUrl = '';
    const formData = form.getFieldsValue();
    if (formData?.provinces_head === '') {
      updatedUrl = onChangeParamUrl('province', []);
    }
    const provinceArr = provincesFilter?.filter(
      (item) => item?.code === formData?.provinces_head,
    );

    const provinceSlugText =
      provinceArr?.length > 0
        ? `${provinceArr[0]?.slug}-t${formData?.provinces_head}`
        : '';

    const distictSlugText =
      distictArr?.length > 0
        ? `${distictArr[0]?.metadata}-t${provinceArr[0]?.code}`
        : '';

    const wardSlugText =
      wardArr?.length > 0
        ? `${wardArr[0]?.metadata}-t${provinceArr[0]?.code}`
        : '';

    if (formData?.provinces_head) {
      if (provinceArr?.length > 0) {
        updatedUrl = onChangeParamUrl('province', provinceSlugText);
      }
      if (distictArr?.length > 0) {
        updatedUrl = onChangeParamUrl('district', distictSlugText);
      }
      if (wardArr?.length > 0) {
        updatedUrl = onChangeParamUrl('ward', wardSlugText);
      }
    }
    router.push(updatedUrl, undefined, {shallow: true});

    setDataObject({
      ...dataObject,
      provinceCodes: formData?.provinces_head ? formData?.provinces_head : '',
      provinceText: provinceArr[0]?.name,
      districtCodes: formData?.districts_head ? formData?.districts_head : '',
      districtText: distictArr[0]?.label,
      wardCodes: formData?.wards_head ? formData?.wards_head : '',
      wardText: wardArr[0]?.label,
      page: 1,
    });

    if (!switchMap) {
      onChangeSearchParam({
        page: 1,
      });
      setIsReload(true);
    } else {
      window.myMap?.setCenter(latlngState);
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
      setMapDataObj({
        ...mapDataObj,
        polygon: polygons,
        provinceCodes: formData?.provinces_head
          ? [formData?.provinces_head]
          : [],
        provinceText: provinceArr[0]?.name,
        districtCodes: formData?.districts_head
          ? [formData?.districts_head]
          : [],
        districtText: distictArr[0]?.label,
        wardCodes: formData?.wards_head ? [formData?.wards_head] : [],
        wardText: wardArr[0]?.label,
      });
      setIsReloadMap(true);
    }
    setIsChangedKV(false);
    setObjLocation({
      provinceCode: dataObject.provinceCodes,
      districtCode: dataObject.districtCodes,
      wardCode: dataObject.wardCodes,
    });
    form.setFieldsValue({
      text_location_head:
        (dataObject?.wardText ? dataObject?.wardText + ', ' : '') +
        (dataObject?.districtText ? dataObject?.districtText + ', ' : '') +
        (dataObject?.provinceText
          ? dataObject?.provinceText
          : messages['common.nationwide']),
    });
    setIsToggle(true);
  };

  return (
    <div
      ref={popupRef}
      className={`select box-location ${isToggle ? '' : 'active'}`}
    >
      <div className='text-location ant-select-selector' onClick={handleToggle}>
        <label>
          <IntlMessages id='common.area' />
        </label>
        <Form.Item name='text_location_head' className='form-item box-text'>
          <Input
            suffix={
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='20'
                height='20'
                viewBox='0 0 20 20'
                fill='none'
              >
                <path
                  d='M15.8327 7.5L9.99935 12.5L4.16602 7.5'
                  stroke='#6C6868'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            }
            onKeyDown={(e) => e.preventDefault()}
            placeholder={messages['common.area']}
            defaultValue={messages['common.nationwide']}
          />
        </Form.Item>
      </div>
      <Row gutter={[0, 10]} className='location-popup'>
        <Col xs={24}>
          <Form.Item name='provinces_head' className='form-item'>
            <Select
              showSearch
              suffixIcon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M15.8327 7.5L9.99935 12.5L4.16602 7.5'
                    stroke='#6C6868'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              }
              style={{
                width: '100%',
              }}
              placeholder={messages['common.areaHint']}
              onChange={handleOnChangeProvinces}
              options={provinceOptions}
              filterOption={filterOptionSearch}
              filterSort={(optionA, optionB) => {
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase());
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name='districts_head' className='form-item'>
            <Select
              showSearch
              suffixIcon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M15.8327 7.5L9.99935 12.5L4.16602 7.5'
                    stroke='#6C6868'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              }
              style={{
                width: '100%',
              }}
              placeholder={messages['common.districtHint']}
              onChange={onChangeDistrict}
              options={districtOptions}
              filterOption={filterOptionSearch}
              filterSort={(optionA, optionB) => {
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase());
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Form.Item name='wards_head' className='form-item'>
            <Select
              showSearch
              suffixIcon={
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M15.8327 7.5L9.99935 12.5L4.16602 7.5'
                    stroke='#6C6868'
                    strokeWidth='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              }
              style={{
                width: '100%',
              }}
              placeholder={messages['common.wardtHint']}
              onChange={onChangeWards}
              options={wardsOptions}
              filterOption={filterOptionSearch}
              filterSort={(optionA, optionB) => {
                (optionA?.label ?? '')
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? '').toLowerCase());
              }}
            />
          </Form.Item>
        </Col>
        <Col xs={24}>
          <Row gutter={[10, 0]}>
            <Col xs={12}>
              <Button
                type='default'
                className='btn-reset'
                onClick={onReset}
                style={{width: '100%'}}
              >
                <IntlMessages id='common.reset' />
              </Button>
            </Col>
            <Col xs={12}>
              <Button
                className={`btn-apply`}
                type='primary'
                htmlType='submit'
                onClick={onSubmit}
                style={{width: '100%'}}
              >
                <IntlMessages id='common.apply' />
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <div></div>
    </div>
  );
};

export default BoxLocation;
BoxLocation.propTypes = {
  popupRef: PropTypes.any,
  form: PropTypes.any,
  setIsToggle: PropTypes.any,
  isToggle: PropTypes.any,
  provinceOptions: PropTypes.any,
  districtOptions: PropTypes.any,
  wardsOptions: PropTypes.any,
  setIsChangedKV: PropTypes.any,
  isChangedKV: PropTypes.any,
  setObjLocation: PropTypes.any,
  setWards: PropTypes.any,
  setDistricts: PropTypes.any,
  provincesFilter: PropTypes.any,
  setLatLngState: PropTypes.any,
  latlngState: PropTypes.any,
  setProvinces: PropTypes.any,
  switchMap: PropTypes.any,
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.any,
  onChangeSearchParam: PropTypes.any,
  onChangeMapSearchParam: PropTypes.any,
  setCurrentPage: PropTypes.any,
  setIsReloadMap: PropTypes.any,
  setIsReload: PropTypes.any,
  setDistrictsOptions: PropTypes.any,
  setWardsOptions: PropTypes.any,
  awards: PropTypes.any,
  districts: PropTypes.any,
};
