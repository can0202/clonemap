import {Form, Select} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import {useEffect} from 'react';
import {onChangeParamUrl} from 'components/SearchComponent';
import {useRouter} from 'next/router';
import IconArrow from 'assets/icon/ArrowDown.png';

const BoxPrice = ({
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
  IconArrow,
}) => {
  const router = useRouter();
  const {messages} = useIntl();
  const {categories} = useSelector((state) => state.categories);
  const [pricesOption, setPricesOption] = useState([]);
  const [pricesOptionRent, setPricesOptionRent] = useState([]);
  const [postType, setPostType] = useState('');

  useEffect(() => {
    if (categories) {
      const realPriceCat =
        categories?.categories?.realEstatePriceFilterCat ?? [];
      let pricesOptionMock = [
        {label: messages['common.all'], value: '', code: ''},
      ];
      let pricesOptionRentMock = [
        {label: messages['common.all'], value: '', code: ''},
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
  }, [categories, postType]);

  useEffect(() => {
    let currentPostType = !switchMap
      ? dataObject?.types ?? ''
      : mapDataObj?.types[0] ?? '';
    setPostType(currentPostType);
  }, [dataObject, mapDataObj]);

  const handleOnChangePrice = (e) => {
    let updatedUrl;
    if (e !== '' && e !== null && Number(e) !== -1) {
      const priceArr = e?.split('-')?.map(Number);
      updatedUrl = onChangeParamUrl('priceRange', priceArr);
    } else if (Number(e) === -1) {
      updatedUrl = onChangeParamUrl('priceRange', [-1, -1]);
    } else {
      updatedUrl = onChangeParamUrl('priceRange', []);
    }
    router.push(updatedUrl, undefined, {shallow: true});

    let price_from, price_to, price_from_map, price_to_map;
    if (e === '') {
      price_from = price_to = '';
      price_from_map = price_to_map = null;
    } else if (e === '-1') {
      price_from = price_to = price_from_map = price_to_map = '-1';
    } else {
      const [priceFromRaw, priceToRaw] = e?.split('-').map((v) => v.trim());
      price_from = priceFromRaw || '0';
      price_to = priceToRaw || '50000000000';
      price_from_map = priceFromRaw || null;
      price_to_map = priceToRaw || null;
    }
    setDataObject({
      ...dataObject,
      priceFrom: price_from,
      priceTo: price_to,
      page: 1,
    });
    setMapDataObj({
      ...mapDataObj,
      priceFrom: price_from_map,
      priceTo: price_to_map,
    });
    if (!switchMap) {
      setCurrentPage(1);
      setIsReload(true);
      form.setFieldsValue({
        price: [
          `${price_from ? price_from : '0'}`,
          `${price_to ? price_to : '50000000000'}`,
        ],
      });
    } else {
      // onChangeMapSearchParam({
      //   ...mapDataObj,
      //   priceFrom: price_from_map,
      //   priceTo: price_to_map,
      //   page: 1,
      // });
      setIsReloadMap(true);
      form.setFieldsValue({
        price: [`${price_from_map}`, `${price_to_map}`],
      });
    }
  };

  // useEffect(() => {
  //   if (dataObject) {
  //     const priceFrom = dataObject?.priceFrom ? dataObject?.priceFrom : 0;
  //     const priceTo = dataObject?.priceTo ? dataObject?.priceTo : 0;
  //     const price = `${
  //       priceFrom && nFormatterPriceCustom(priceFrom?.toString())
  //     }${priceTo && ` - ` + nFormatterPrice(priceTo?.toString())}`;

  //     form.setFieldsValue({
  //       priceHeader:
  //         priceFrom === 0 && priceTo === 0
  //           ? messages['common.all']
  //           : priceFrom === '' || priceTo === ''
  //           ? ''
  //           : priceFrom === '-1' || priceTo === '-1'
  //           ? '-1'
  //           : price,
  //     });
  //   }
  // }, [dataObject]);

  return (
    <div className='select box-prices'>
      <Form.Item
        name='priceHeader'
        label={messages['common.price']}
        className='form-item'
      >
        <Select
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
          placeholder={messages['common.all']}
          onChange={handleOnChangePrice}
          options={
            postType === 'bds-cho-thue' ? pricesOptionRent : pricesOption
          }
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) => {
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase());
          }}
        />
        {/* <Select
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
          onChange={handleOnChangePrice}
          placeholder={messages['common.priceRange']}
          options={
            postType === 'bds-cho-thue' ? pricesOptionRent : pricesOption
          }
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) => {
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase());
          }}
        /> */}
      </Form.Item>
    </div>
  );
};

export default BoxPrice;
BoxPrice.propTypes = {
  form: PropTypes.any,
  typeOptions: PropTypes.any,
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
  IconArrow: PropTypes.any,
};
