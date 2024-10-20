import React, {useState, useEffect} from 'react';
import {Form, Select} from 'antd';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import {useRouter} from 'next/router';
import {useSelector} from 'react-redux';
import {initFromParams, onChangeParamUrl} from 'components/SearchComponent';
import IconArrow from 'assets/icon/ArrowDown.png';
import {filterOptionSearch} from 'shared/constants/AppConst';

const BoxSubType = ({
  subTypeObtions,
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
  const [isSelectedAll, setIsSelectedAll] = useState({
    isSelected: false,
    fieldName: '',
  });
  const {messages} = useIntl();
  const router = useRouter();
  const currentUrl = router.asPath;

  const {categories} = useSelector((state) => state.categories);
  const subPostTypeHeaderField = Form.useWatch('subPostTypeHeader', form);

  const onChangeSelectMultiple = (value, fieldName) => {
    if (value.length === subTypeObtions.length - 1) {
      if (!value.includes('all')) {
        const arr = subTypeObtions.map((item) => item.value);
        form.setFieldsValue({
          [fieldName]: arr,
        });
        setIsSelectedAll({isSelected: true, fieldName: fieldName});
      } else {
        const arr = value.filter((item) => item !== 'all');
        form.setFieldsValue({
          [fieldName]: arr,
        });
        setIsSelectedAll({isSelected: false, fieldName: fieldName});
      }
    }
  };

  const onSelectMultiple = (value, fieldName) => {
    const arr = subTypeObtions.map((item) => item.value);
    if (value === 'all') {
      form.setFieldsValue({
        [fieldName]: arr,
      });
      setIsSelectedAll({isSelected: true, fieldName: fieldName});
    }
  };

  const onDeselectMultiple = (value, fieldName) => {
    console.log('value onDeselectMultiple', value);

    if (value === 'all') {
      form.setFieldsValue({
        [fieldName]: [],
      });
      setIsSelectedAll({isSelected: false, fieldName: fieldName});
    }
  };

  const handleOnchangeSubType = (e, options) => {
    let updatedUrl = '';
    if (e.length === subTypeObtions.length - 1) {
      updatedUrl = onChangeParamUrl('subTypes', '');
    } else if (e.includes('all')) {
      updatedUrl = onChangeParamUrl('subTypes', '');
    } else if (e.length === subTypeObtions.length - 1 && e.includes('all')) {
      console.log('Ok');
    } else {
      if (options.length !== 0) {
        updatedUrl = onChangeParamUrl('subTypes', options);
      } else {
        updatedUrl = onChangeParamUrl('subTypes', '');
      }
    }
    router.push(updatedUrl, undefined, {shallow: true});
    let isTrue = e?.length === subTypeObtions.length - 1;
    onChangeSelectMultiple(e, 'subPostTypeHeader');
    const subTypesText = [];
    for (let i = 0; i < options.length; i++) {
      let label = options[i].label;
      subTypesText.push(label);
    }
    form.setFieldsValue({
      realTypes: !e.includes('all') ? e : 'all',
    });

    setDataObject({
      ...dataObject,
      subTypes: e.includes('all') ? '' : isTrue ? '' : e,
      subTypesText: e.includes('all') ? '' : isTrue ? '' : subTypesText,
    });
    setMapDataObj({
      ...mapDataObj,
      subTypes:
        e.length === 0 || !e || e.includes('all') ? [] : isTrue ? [] : e,
    });
    if (!switchMap) {
      onChangeSearchParam({
        subTypes: e.includes('all') ? '' : isTrue ? '' : e,
        subTypesText: e.includes('all') ? '' : isTrue ? '' : subTypesText,
        page: 1,
      });
      setCurrentPage(1);
      setIsReload(true);
    } else {
      onChangeMapSearchParam({
        subTypes:
          e.length === 0 || !e || e.includes('all') ? [] : isTrue ? [] : e,
        page: 1,
      });
      setIsReloadMap(true);
    }
  };

  useEffect(() => {
    if (subPostTypeHeaderField?.includes('all')) {
      onSelectMultiple('all', 'subPostTypeHeader');
    } else {
      setIsSelectedAll({
        isSelected: false,
        fieldName: 'subPostTypeHeader',
      });
    }
  }, [subPostTypeHeaderField]);

  useEffect(() => {
    if (isSelectedAll.fieldName !== '') {
      const basicProvinces1 = document.getElementById(
        `basic_${isSelectedAll.fieldName}`,
      );
      const parentProvinces1 = basicProvinces1.parentElement;
      const grandProvinces1 = parentProvinces1.parentElement;
      const tagsContainers = grandProvinces1.parentElement;
      if (tagsContainers) {
        if (isSelectedAll.isSelected) {
          const tags = tagsContainers.childNodes;
          for (let index = 1; index < tags.length - 1; index++) {
            const tag = tags[index];
            // tag.style.opacity = '0';
            tag.style.display = 'none';
          }
        } else {
          const tags = tagsContainers.childNodes;
          for (let index = 0; index < tags.length - 1; index++) {
            const tag = tags[index];
            // tag.style.opacity = '1';
            tag.style.display = 'block';
          }
        }
      }
    }
  }, [isSelectedAll]);

  return (
    <div className='select box-subtype'>
      <Form.Item
        name='subPostTypeHeader'
        label={messages['common.typeBds']}
        className='form-item'
      >
        <Select
          showSearch
          mode='multiple'
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
          onSelect={(value) => onSelectMultiple(value, `subPostTypeHeader`)}
          onDeselect={(value) => onDeselectMultiple(value, `subPostTypeHeader`)}
          onChange={handleOnchangeSubType}
          style={{width: 240}}
          options={subTypeObtions}
          placeholder={messages['common.all']}
          filterOption={filterOptionSearch}
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

export default BoxSubType;
BoxSubType.propTypes = {
  form: PropTypes.any,
  subTypeObtions: PropTypes.any,
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
