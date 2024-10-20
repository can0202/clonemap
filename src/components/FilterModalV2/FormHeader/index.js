import React, {useEffect} from 'react';
import {Radio, Form} from 'antd';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';

const FormHeader = ({postType, onChangePostType}) => {
  const {categories} = useSelector((state) => state.categories);
  const postTypeFilterCat = categories?.categories?.postTypeFilterCat ?? [];

  return (
    <>
      <Form.Item name='types' initialValue={postType}>
        <Radio.Group
          className='filter-form-type d-flex align-center justify-center text-center'
          defaultValue={postType}
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
    </>
  );
};

export default FormHeader;
FormHeader.propTypes = {
  postType: PropTypes.string,
  onChangePostType: PropTypes.any,
};
