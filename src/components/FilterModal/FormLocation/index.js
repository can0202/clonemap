import React, {useState, useEffect} from 'react';
import {Col, Form, Row, Select} from 'antd';
import {useSelector} from 'react-redux';
import {fetchDistricts} from 'pages/api/districts';
import {fetchWards} from 'pages/api/wards';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';
import IconArrow from 'assets/icon/ArrowDown.png';
import {filterOptionSearch} from 'shared/constants/AppConst';

const FormLocation = ({
  dataObject,
  setDataObject,
  setLocation,
  form,
  switchMap,
  mapDataObj,
  setMapDataObj,
}) => {
  const {messages} = useIntl();
  const [idCity, setIdCity] = useState('');
  const [districts, setDistricts] = useState([]);
  const [awards, setWards] = useState([]);
  const provinces = useSelector((state) => state.provinces);
  const provincesFilter = provinces?.provinces ?? [];
  const [provincesOptions, setProvincesOptions] = useState([]);
  const [districtsOptions, setDistrictsOptions] = useState([]);
  const [wardsOptions, setWardsOptions] = useState([]);
  const router = useRouter();

  let newDistrictsOptions = [];
  let newWardsOptions = [];
  let distictArr = [];
  let wardArr = [];
  let districtResult;
  let wardResult;

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

  const onChangeProvinces = async (value, label) => {
    const province = provincesFilter?.filter((item) => item?.code === value);
    const latlng = province[0]?.location;
    let provincesLabel = label?.label ?? '';
    setLocation(latlng);
    form?.setFieldsValue({
      districts: null,
      wards: null,
    });
    setIdCity(value);
    setWards([]);
    setMapDataObj({
      ...mapDataObj,
      provinceCodes: value === '' ? [] : [value],
      provinceText:
        value === '' ? messages['common.nationwide'] : provincesLabel,
      districtCodes: [],
      districtText: '',
      wardCodes: [],
      wardText: '',
    });
    if (value) {
      const districtsArr = await getDistricts(value);
      districtsArr?.forEach((ele) => {
        let districtsOption = {
          label: ele?.name,
          value: ele?.code,
        };
        newDistrictsOptions?.push(districtsOption);
      });
      setDistrictsOptions(newDistrictsOptions);
    }
    const newDataObject = {
      ...dataObject,
      provinceCodes: value === '' ? '' : value,
      provinceText: value === '' ? messages['common.nationwide'] : label?.label,
      districtCodes: '',
      districtText: '',
      wardCodes: '',
      wardText: '',
    };
    setDataObject(newDataObject);
  };

  const onChangeDistrict = async (value, label) => {
    const district = districts?.filter((item) => item?.code === value);
    const latlng = district[0]?.location;
    setLocation(latlng);
    form?.setFieldsValue({
      wards: null,
    });
    setMapDataObj({
      ...mapDataObj,
      districtCodes: [value ?? ''],
      districtText: label?.label,
      wardCodes: [],
      wardText: '',
    });
    const provinceId = idCity ? idCity : dataObject?.provinceCodes;
    const wardFetch = await getWards(provinceId, value);
    wardFetch?.forEach((ele) => {
      let eleOption = {
        label: ele?.name,
        value: ele?.code,
      };
      newWardsOptions?.push(eleOption);
    });
    setWardsOptions(newWardsOptions);

    let districtsLabel = label?.label ?? '';
    const newDataObject = {
      ...dataObject,
      districtCodes: value,
      districtText: districtsLabel,
      wardCodes: '',
      wardText: '',
    };
    setDataObject(newDataObject);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (dataObject?.provinceCodes) {
        let provinceResult = dataObject?.provinceCodes;
        const districtsArr = await getDistricts(provinceResult);
        districtsArr?.forEach((ele) => {
          let districtsOption = {
            label: ele?.name,
            value: ele?.code,
          };
          newDistrictsOptions?.push(districtsOption);
        });
        setDistrictsOptions(newDistrictsOptions);
        if (dataObject?.districtCodes) {
          distictArr = await districtsArr?.filter(
            (item) => item?.code === dataObject?.districtCodes,
          );
          districtResult = distictArr[0]?.code || undefined;
          const wardFetch = await getWards(provinceResult, districtResult);
          wardFetch?.forEach((ele) => {
            let eleOption = {
              label: ele?.name,
              value: ele?.code,
            };
            newWardsOptions?.push(eleOption);
          });
          setWardsOptions(newWardsOptions);
          if (dataObject?.wardCodes) {
            wardArr = await wardFetch?.filter(
              (item) => item?.code === dataObject?.wardCodes,
            );
            wardResult = wardArr[0]?.code || undefined;
          }
        }
        form?.setFieldsValue({
          provinces:
            dataObject?.provinceCodes === ''
              ? messages['common.nationwide']
              : provinceResult,
          districts: districtResult,
          wards: wardResult,
        });
      } else {
        // const cityNameHeader = form?.getFieldValue('cityHeader');
        // const wardCode = form?.getFieldValue('wards');
        // const provinceArr = provincesFilter?.filter(
        //   (item) => item?.name === cityNameHeader,
        // );
        // console.log('cityNameHeader', cityNameHeader);
        // console.log('provinceArr', provinceArr);
        // let provinceResult = provinceArr[0]?.code;
        // const districtsArr = await getDistricts(provinceResult);
        // let districtResult;
        // if (districtsArr) {
        //   districtResult = districtsArr[0]?.code;
        // }
        // const wardsArr = await getWards(provinceResult, districtResult);
        // let wardResult;
        // if (wardsArr) {
        //   wardResult = wardsArr[0]?.code;
        // }
        // form?.setFieldsValue({
        //   provinces:
        //     dataObject?.provinceCodes === ''
        //       ? messages['common.nationwide']
        //       : provinceResult,
        //   districts: districtResult,
        //   wards: wardResult,
        // });
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const provincesOptions = [
      {label: messages['common.nationwide'], value: ''},
    ];
    const districtsOptions = [];
    const wardsOptions = [];

    provincesFilter?.forEach((ele) => {
      let eleOption = {
        label: ele?.name,
        value: ele?.code,
      };
      provincesOptions?.push(eleOption);
    });
    districts?.forEach((ele) => {
      let eleDistrict = {
        label: ele?.name,
        value: ele?.code,
      };
      districtsOptions?.push(eleDistrict);
    });
    awards?.forEach((ele) => {
      let eleWardss = {
        label: ele?.name,
        value: ele?.code,
      };
      wardsOptions?.push(eleWardss);
    });

    setProvincesOptions(provincesOptions);
    setDistrictsOptions(districtsOptions);
    setWardsOptions(wardsOptions);
  }, [provincesFilter, districts, awards]);

  const onChangeWards = (value, label) => {
    const ward = awards?.filter((item) => item?.code === value);
    const latlng = ward[0]?.location;
    let wardsLabel = label?.label ?? '';
    setLocation(latlng);
    setMapDataObj({
      ...mapDataObj,
      wardCodes: [value ?? ''],
      wardText: wardsLabel,
    });

    const newDataObject = {
      ...dataObject,
      wardCodes: value,
      wardText: wardsLabel,
    };
    setDataObject(newDataObject);
  };

  return (
    <>
      <Row gutter={[0, 16]}>
        <Col xs={24}>
          <h4>
            <IntlMessages id='common.area' />
          </h4>
        </Col>
        <Col xs={24}>
          <Row
            gutter={[16, 16]}
            className='filter-box-location form-check-group'
          >
            <Col xs={24} md={8}>
              <Form.Item
                name='provinces'
                className='form-item'
                label={<IntlMessages id='common.province' />}
              >
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
                  onChange={onChangeProvinces}
                  options={provincesOptions}
                  filterOption={filterOptionSearch}
                  filterSort={(optionA, optionB) => {
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase());
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name='districts'
                className='form-item'
                label={<IntlMessages id='common.district' />}
              >
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
                  options={districtsOptions}
                  filterOption={filterOptionSearch}
                  filterSort={(optionA, optionB) => {
                    (optionA?.label ?? '')
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? '').toLowerCase());
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={8}>
              <Form.Item
                name='wards'
                className='form-item'
                label={<IntlMessages id='common.ward' />}
              >
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
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default FormLocation;
FormLocation.propTypes = {
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  setLocation: PropTypes.func,
  form: PropTypes.any,
  switchMap: PropTypes.bool,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.func,
};
