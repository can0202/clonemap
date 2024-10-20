import React, {useEffect} from 'react';
import {Radio, Form} from 'antd';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

const FormHeader = ({
  setPostType,
  dataObject,
  setDataObject,
  form,
  setLocation,
  mapDataObj,
  setMapDataObj,
  setIsChecked,
  setIsCheckedMem,
}) => {
  const {categories} = useSelector((state) => state.categories);
  const postTypeFilterCat = categories?.categories?.postTypeFilterCat ?? [];
  const onChangePostType = ({target: {value}}) => {
    const newDataObject = {
      ...dataObject,
      types: value,
      subTypes: '',
      subTypesText: '',
      priceFrom: '',
      priceTo: '',
      areaFrom: '',
      areaTo: '',
      directions: '',
      bedrooms: '',
      investors: '',
      postBy: '',
      projects: '',
      status: '',
      subStatus: '',
      isOutstanding: false,
      isPostByVARS: false,
    };
    setPostType(value);
    setDataObject(newDataObject);
    setIsChecked(false);
    setIsCheckedMem(false);

    form.resetFields([
      'realTypes',
      'outstandingProject',
      'price',
      'area',
      'direction',
      'bedroom',
      'poster',
      'project-bds',
      'investors',
      'subStatus',
      'status',
      'postByVARS',
      'outstanding',
      'projectBds',
      'provinces',
      'districts',
      'wards',
    ]);

    let newMapDataObj = {
      ...mapDataObj,
      types: [value],
      subTypes: [],
      directions: [],
      areaFrom: null,
      areaTo: null,
      priceFrom: null,
      priceTo: null,
      bedrooms: [],
      investors: [],
      projects: [],
      postBy: [],
      status: [],
      subStatus: [],
      isOutstanding: false,
      isPostByVARS: false,
    };
    setMapDataObj(newMapDataObj);
    setLocation({});
  };

  useEffect(() => {
    const type = form.getFieldValue('postTypeHeader');
    form.setFieldsValue({
      postTypesForm: type,
    });
    let newMapDataObj = {
      ...mapDataObj,
      types: [`${type}`],
    };
    setPostType(type);
    setMapDataObj(newMapDataObj);
  }, []);
  return (
    <>
      <div className='filter-form-label'>
        <Form.Item name='postTypesForm'>
          <Radio.Group
            className='filter-form-type d-flex align-center justify-center text-center'
            defaultValue='bds-ban'
            buttonStyle='solid'
          >
            {postTypeFilterCat?.map((item) => {
              return (
                <Radio.Button
                  key={item?.code}
                  onChange={onChangePostType}
                  value={item?.code}
                >
                  {item?.name}
                </Radio.Button>
              );
            })}
          </Radio.Group>
        </Form.Item>
      </div>
    </>
  );
};

export default FormHeader;
FormHeader.propTypes = {
  setPostType: PropTypes.func,
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  onChangeSearchParam: PropTypes.any,
  form: PropTypes.any,
  setLocation: PropTypes.func,
  mapDataObj: PropTypes.any,
  setIsChecked: PropTypes.any,
  setIsCheckedMem: PropTypes.any,
  setMapDataObj: PropTypes.func,
};
