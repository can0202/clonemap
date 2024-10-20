import React, {useEffect} from 'react';
import {Checkbox, Col, Form, Row, Tooltip} from 'antd';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';
import {useSelector} from 'react-redux';
import {useState} from 'react';
import TooltipVarsMember from 'components/TooltipVarsMember';

const FormMemberPost = ({
  form,
  dataObject,
  setDataObject,
  mapDataObj,
  setMapDataObj,
  isCheckedMem,
  setIsCheckedMem,
  switchMap,
}) => {
  const onChange = (e) => {
    setIsCheckedMem(/true/.test(e.target.checked));
    const newDataObject = {
      ...dataObject,
      isPostByVARS: /true/.test(e.target.checked),
    };
    setDataObject(newDataObject);
    const newMapDataObj = {
      ...mapDataObj,
      isPostByVARS: /true/.test(e.target.checked),
    };
    setMapDataObj(newMapDataObj);
  };

  // set fill value
  useEffect(() => {
    if (switchMap) {
      form.setFieldsValue({
        postByVARS: /true/.test(mapDataObj?.isPostByVARS),
      });
      setIsCheckedMem(/true/.test(mapDataObj?.isPostByVARS));
    } else {
      form.setFieldsValue({
        postByVARS: /true/.test(dataObject?.isPostByVARS),
      });
      setIsCheckedMem(/true/.test(dataObject?.isPostByVARS));
    }
  }, []);

  const {categories} = useSelector((state) => state.categories);
  const [dataSectionConfig, setDataSectionConfig] = useState(null);
  const [varsMemberText, setVarsMemberText] = useState(null);

  useEffect(() => {
    const sectionConfig =
      categories?.configurations?.landWebConfig?.sections?.varsMemberListed ||
      null;
    const varsMemberText =
      categories?.configurations?.featureConfig?.landSearch
        ?.filterByVarsMember || null;
    setDataSectionConfig(sectionConfig);
    setVarsMemberText(varsMemberText);
  }, [categories]);

  return (
    <Form.Item name='postByVARS' valuePropName='checked'>
      <Checkbox checked={isCheckedMem} onChange={onChange}>
        <TooltipVarsMember
          titleVas={dataSectionConfig?.title}
          image={dataSectionConfig?.tickIcon}
          enable={varsMemberText?.enable}
          description={varsMemberText?.description}
        />
      </Checkbox>
    </Form.Item>
  );
};

export default FormMemberPost;
FormMemberPost.propTypes = {
  form: PropTypes.any,
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  setIsCheckedMem: PropTypes.any,
  isCheckedMem: PropTypes.any,
  switchMap: PropTypes.any,
  setMapDataObj: PropTypes.func,
};
