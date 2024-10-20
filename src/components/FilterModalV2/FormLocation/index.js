import React, {useState, useEffect} from 'react';
import {Col, Form, Row, Select} from 'antd';
import {useSelector} from 'react-redux';
import {fetchDistricts} from 'pages/api/districts';
import {fetchWards} from 'pages/api/wards';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import IntlMessages from '@crema/utility/IntlMessages';
import AppSelect from 'components/AppSelect';
import {useIntl} from 'react-intl';
import IconArrow from 'assets/icon/ArrowDown.png';
import {filterOptionSearch} from 'shared/constants/AppConst';

const FormLocation = ({form}) => {
  const [provinceId, setProvinceId] = useState(null);
  const [provinceOptions, setProvinceOptions] = useState([]);
  const [districtsOptions, setDistrictsOptions] = useState([]);
  const [wardOptions, setWardOptions] = useState([]);
  const [districtDisabled, setDistrictDisabled] = useState(true);
  const [wardDisabled, setWardDisabled] = useState(true);
  const provinces = useSelector((state) => state.provinces);
  const router = useRouter();
  const {messages} = useIntl();
  const [districts, setDistricts] = useState([]);
  const [awards, setWards] = useState([]);

  useEffect(() => {
    const provincesOptions = [
      {label: messages['common.nationwide'], value: ''},
    ];
    const provincesFilter = provinces?.provinces ?? [];
    provincesFilter?.forEach((ele) => {
      let options = {
        label: ele?.name,
        value: ele?.code,
      };
      provincesOptions?.push(options);
    });
    setProvinceOptions(provincesOptions);
  }, [provinces]);

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

  // Handle Change City
  const handleChangeProvinces = async (value) => {
    const dataForm = form.getFieldsValue();
    const provinceForm = dataForm?.provinceFilter;
    const provinceId = provinceForm ? provinceForm : value;
    setProvinceId(provinceId);
    const fetchDistricts = await getDistricts(provinceId);
    const districtOptions = fetchDistricts?.map((item) => ({
      label: item.name,
      value: item.code,
    }));
    setDistrictsOptions(districtOptions);
    setWardOptions([]);
    form?.setFieldsValue({
      districtFilter: null,
      wardFilter: null,
    });
  };

  const handleChangeDistricts = async (value, option) => {
    const formData = form.getFieldsValue();
    const provinceId = formData?.provinceFilter;
    const district = districts?.filter((item) => item?.code === value);
    const wardFetch = await getWards(provinceId, value);
    let newWardsOptions = [];
    wardFetch?.forEach((ele) => {
      let eleOption = {
        label: ele?.name,
        value: ele?.code,
      };
      newWardsOptions?.push(eleOption);
    });
    setWardOptions(newWardsOptions);
    form?.setFieldsValue({
      wardFilter: null,
    });
  };
  const dataForm = form.getFieldsValue();
  useEffect(() => {
    if (dataForm?.provinceFilter) {
      handleChangeProvinces(dataForm?.provinceFilter);
    }
  }, [dataForm?.provinceFilter]);

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
                name='provinceFilter'
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
                  onChange={handleChangeProvinces}
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
            <Col xs={24} md={8}>
              <Form.Item
                name='districtFilter'
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
                  onChange={handleChangeDistricts}
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
                name='wardFilter'
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
                  options={wardOptions}
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
  form: PropTypes.any,
};
