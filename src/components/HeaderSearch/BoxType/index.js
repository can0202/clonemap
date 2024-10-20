import React from 'react';
import {Form, Select} from 'antd';
import PropTypes from 'prop-types';
import {setPostTypeText} from 'redux/actions/PostType';
import {useDispatch, useSelector} from 'react-redux';
import {useIntl} from 'react-intl';
import {useRouter} from 'next/router';
import {onChangeParamUrl} from 'components/SearchComponent';
import IconArrow from 'assets/icon/ArrowDown.png';

const BoxType = ({
  typeOptions,
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
  setObjLocation,
  setSubTypeFilterOptions,
}) => {
  const dispatch = useDispatch();
  const {messages} = useIntl();
  const {categories} = useSelector((state) => state.categories);
  const router = useRouter();

  const handleOnChangeType = (e) => {
    const subTypeFilterCats = categories?.categories?.realEstateTypeCat ?? [];
    let updateUrl = '';
    updateUrl = onChangeParamUrl('types', e);
    updateUrl = onChangeParamUrl('priceRange', []);
    router.push(updateUrl, undefined, {shallow: true});

    const newSubTypeOptions = [{label: messages['common.all'], value: 'all'}];
    subTypeFilterCats?.forEach((ele) => {
      if (e === ele?.parent) {
        let subTypesOption = {
          label: ele?.name,
          value: ele?.code,
          metadata: ele?.metadata,
        };
        newSubTypeOptions?.push(subTypesOption);
      }
    });
    setSubTypeFilterOptions(newSubTypeOptions);
    dataObject.isOutstanding = false;
    dataObject.isPostByVARS = false;
    form.setFieldsValue({
      postTypesForm: e,
      subPostTypeHeader: undefined,
      priceHeader: '',
      // districts_head: messages['common.districtHint'],
      // wards_head: messages['common.wardtHint'],
    });
    form.resetFields(['price']);
    form.resetFields(['priceHeader']);
    form.resetFields(['realTypes']);
    setDataObject({
      ...dataObject,
      subTypes: '',
      types: e,
      priceFrom: '',
      priceTo: '',
    });
    setMapDataObj({
      ...mapDataObj,
      subTypes: [],
      types: [e],
      priceFrom: null,
      priceTo: null,
    });
    if (!switchMap) {
      onChangeSearchParam({
        ...dataObject,
        subTypes: '',
        subTypesText: '',
        types: e,
        priceFrom: '',
        priceTo: '',
      });
      setCurrentPage(1);
      setIsReload(true);
    } else {
      onChangeMapSearchParam({
        ...mapDataObj,
        subTypes: [],
        types: [e],
        priceFrom: null,
        priceTo: null,
      });
      setIsReloadMap(true);
    }
    dispatch(setPostTypeText(e));
  };

  return (
    <div className='select box-post-type'>
      <Form.Item
        name='postTypeHeader'
        className='form-item'
        label={messages['common.typeDetail']}
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
          placeholder={messages['common.typeDetail']}
          onChange={handleOnChangeType}
          options={typeOptions}
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
      </Form.Item>
    </div>
  );
};

export default BoxType;
BoxType.propTypes = {
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
  setObjLocation: PropTypes.any,
  setSubTypeFilterOptions: PropTypes.any,
};
