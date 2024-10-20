import {Col, Form, Row} from 'antd';
import React from 'react';
import FormHeader from './FormHeader';
import {useState} from 'react';
import PropTypes from 'prop-types';
import FormMemberChecked from './FormMember';
import FormPostType from './FormSubType';
import FormLocation from './FormLocation';
import FormPriceArea from './FormPriceArea';
import FormDirection from './FormDirection';
import FormBedroom from './FormBedroom';
import FormPoster from './FormPoster';
import FormProject from './FormProject';
import {useSelector} from 'react-redux';
import OutstandingProject from './FormOutstandingProject';
import {useEffect} from 'react';
import FormInvestor from './FormInvestor';
import FormConstruction from './FormConstruction';
import FormStatusProject from './FormStatusProject';
import {useIntl} from 'react-intl';

const FilterModalV2 = ({form, currentPostType, setcurrentPostType}) => {
  const {messages} = useIntl();
  const {categories} = useSelector((state) => state.categories);
  const [postType, setPostType] = useState(currentPostType);
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
  }, [categories, currentPostType]);

  const onChangePostType = ({target: {value}}) => {
    const types = value ? value : currentPostType;
    setPostType(types);
    form.resetFields();
  };

  useEffect(() => {
    const dataForm = form.getFieldsValue();
    if (dataForm) {
      let priceValue = [
        0,
        dataForm.types === 'bds-cho-thue' ? 100000000 : 500000000000,
      ];
      const province = dataForm?.provinceHome;
      const price = dataForm?.priceHome?.split('-');
      const area = dataForm?.areaHome?.split('-');

      let areaValue = [
        area ? Number(area[0]) : 0,
        area ? Number(area[1]) : 500,
      ];
      if (price && price.length > 1) {
        const priceFrom = price[0];
        const priceTo = price[1];
        priceValue = [
          priceFrom ? Number(priceFrom) : 0,
          priceTo ? Number(priceTo) : 500000000000,
        ];
      }

      form.setFieldsValue({
        provinceFilter: dataForm?.provinceHome,
      });
      if (area) {
        form.setFieldsValue({
          areaFilter: areaValue,
        });
      }
      if (price) {
        form.setFieldsValue({
          priceFilter: priceValue,
        });
      }
    }
  }, []);
  return (
    <div className='all-filter'>
      <div className='all-filter--inner'>
        <Form form={form} className='filter-form' layout='vertical'>
          <Row gutter={[0, 16]}>
            <Col xs={24}>
              <FormHeader
                postType={postType}
                onChangePostType={onChangePostType}
              />
            </Col>
            <Col xs={24}>
              {postType === 'du-an' ? (
                <OutstandingProject />
              ) : (
                <FormMemberChecked
                  dataSectionConfig={dataSectionConfig}
                  varsMemberText={varsMemberText}
                />
              )}
            </Col>
            <Col xs={24}>
              <FormPostType form={form} postType={postType} />
            </Col>
            <Col xs={24}>
              <FormLocation form={form} />
            </Col>
            <Col xs={24}>
              <FormPriceArea postType={postType} form={form} />
            </Col>
            <Col xs={24}>
              <FormDirection />
            </Col>
            <Col xs={24}>
              <FormBedroom />
            </Col>
            {postType !== 'du-an' ? (
              <>
                <Col xs={24}>
                  <FormPoster />
                </Col>
                <Col xs={24}>
                  <FormProject />
                </Col>
              </>
            ) : (
              <>
                <Col xs={24}>
                  <FormInvestor />
                </Col>
                <Col xs={24}>
                  <Row gutter={[16, 16]}>
                    <Col xs={24} md={12}>
                      <FormConstruction />
                    </Col>
                    <Col xs={24} md={12}>
                      <FormStatusProject />
                    </Col>
                  </Row>
                </Col>
              </>
            )}
          </Row>
        </Form>
      </div>
    </div>
  );
};

export default FilterModalV2;
FilterModalV2.propTypes = {
  form: PropTypes.any,
  currentPostType: PropTypes.string,
  setcurrentPostType: PropTypes.any,
};
