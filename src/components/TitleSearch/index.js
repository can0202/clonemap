import React, {useState, useEffect} from 'react';
import {Checkbox, Col, Form, Row, Select, Switch} from 'antd';
import {AppstoreOutlined, UnorderedListOutlined} from '@ant-design/icons';
import PropTypes from 'prop-types';
import {useSelector} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import TooltipVarsMember from 'components/TooltipVarsMember';
import {setCookie} from 'cookies-next';
import {
  filterOptionSearch,
  nFormatterPriceCustom,
} from 'shared/constants/AppConst';

const TitleSearch = ({
  total,
  dataObject,
  setDataObject,
  setIsReload,
  isReload,
  setCurrentPage,
  onChangeSearchParam,
  onChangeMapSearchParam,
  switchMap,
  handleDisplayView,
  isReloadMap,
  setIsReloadMap,
  form,
  setMapDataObj,
  mapDataObj,
  title,
  setTitle,
  handleSwitchMap,
}) => {
  const {messages} = useIntl();
  const {categories} = useSelector((state) => state.categories);
  const provinces = useSelector((state) => state.provinces);

  const [dataSectionConfig, setDataSectionConfig] = useState(null);
  const [varsMemberText, setVarsMemberText] = useState(null);
  const [sortCatOptions, setSortCatOptions] = useState([]);

  useEffect(() => {
    const newSortCats = [];
    const sortByCats = categories?.categories?.sortByCat ?? [];
    const sectionConfig =
      categories?.configurations?.landWebConfig?.sections?.varsMemberListed ||
      null;
    const varsMemberText =
      categories?.configurations?.featureConfig?.landSearch
        ?.filterByVarsMember || null;

    sortByCats?.forEach((ele) => {
      let eleOption = {
        label: ele.name,
        value: ele.code,
      };
      newSortCats?.push(eleOption);
    });

    setSortCatOptions(newSortCats);
    setDataSectionConfig(sectionConfig);
    setVarsMemberText(varsMemberText);
  }, [categories]);

  const nFormatterPrice = (num) => {
    if (num >= 1000000000) {
      return (
        (num / 1000000000).toFixed(1).replace(/\.0$/, '') +
        ' ' +
        messages['common.billion']
      );
    }
    if (num >= 1000000) {
      return (
        (num / 1000000).toFixed(1).replace(/\.0$/, '') +
        ' ' +
        messages['common.million']
      );
    }
    return num;
  };

  const textResult = (postType) => {
    switch (postType) {
      case 'du-an':
        return messages['common.project'];
      case 'bds-ban':
        return messages['common.purchase'];
      case 'bds-cho-thue':
        return messages['common.lease'];
      case 'm-a':
        return messages['common.ma'];
      default:
        return '';
    }
  };

  const getSubTypeTextOnly = (subTypes, categoryList) => {
    const subTypeArray =
      typeof subTypes === 'string' ? subTypes?.split(',') : subTypes;
    const subTypeTextOnly =
      subTypeArray?.length === 0 || subTypeArray[0] === ''
        ? messages['common.property']
        : subTypeArray?.length === 1
        ? categoryList
            ?.find((item) => item?.code === subTypeArray[0]?.toString())
            ?.name?.toLowerCase()
        : subTypeArray
            ?.map((subType) =>
              categoryList
                ?.find((item) => item?.code === subType?.toString())
                ?.name?.toLowerCase(),
            )
            .filter(Boolean)
            .join(', ');

    return subTypeTextOnly;
  };

  const getNewTexts = (data, subTypeTextOnly, province) => {
    const {
      types,
      subTypes,
      wardCodes,
      districtCodes,
      provinceCodes,
      wardText,
      districtText,
      priceFrom,
      priceTo,
      areaFrom,
      areaTo,
      bedrooms,
    } = data;

    const postType = Array.isArray(types) ? types[0] : types;
    const typeText = Array.isArray(types)
      ? textResult(types[0])
      : textResult(types);
    const wardCodeText = Array.isArray(wardCodes) ? wardCodes[0] : wardCodes;
    const districtCodeText = Array.isArray(districtCodes)
      ? districtCodes[0]
      : districtCodes;
    const provinceCodeText = Array.isArray(provinceCodes)
      ? provinceCodes[0]
      : provinceCodes;
    const bedroomCodeText = Array.isArray(bedrooms)
      ? bedrooms?.join('-')
      : typeof bedrooms === 'string'
      ? bedrooms?.split(',')?.join('-')
      : '';

    const areaInfo = wardCodeText
      ? `${messages['common.at']} ${wardText}, ${districtText}, ${province?.name}`
      : districtCodeText
      ? `${messages['common.at']} ${districtText}, ${province?.name}`
      : provinceCodeText
      ? `${messages['common.at']} ${province?.name}`
      : `${messages['common.nationwideLowcase']}`;

    const priceText =
      priceFrom !== '' &&
      priceTo !== '' &&
      priceFrom !== null &&
      priceTo !== null &&
      Number(priceFrom) !== -1 &&
      Number(priceTo) !== -1
        ? Number(priceFrom) === 0
          ? `${messages[
              'common.priceUnder'
            ].toLocaleLowerCase()} ${nFormatterPrice(priceTo)}`
          : `${messages[
              'common.price'
            ].toLocaleLowerCase()} ${nFormatterPriceCustom(
              priceFrom,
            )} - ${nFormatterPrice(priceTo)}`
        : '';

    const areaText =
      areaFrom && areaTo
        ? areaFrom === '0'
          ? `${messages['common.under']} ${areaTo} m²`
          : `${areaFrom} - ${areaTo} m²`
        : '';

    const bedroomText = bedroomCodeText
      ? `${bedroomCodeText} ${messages['common.bedrooms'].toLocaleLowerCase()}`
      : '';

    let newTexts = `${typeText} ${
      subTypes
        ? subTypeTextOnly
        : postType === 'du-an' || postType === 'm-a'
        ? ''
        : messages['common.property'].toLocaleLowerCase()
    } ${areaInfo}`;

    if (bedroomText) {
      newTexts += `, ${bedroomText}`;
    }

    if (priceText) {
      newTexts += `, ${priceText}`;
    }

    if (areaText) {
      newTexts += `, ${areaText}`;
    }

    return newTexts;
  };

  useEffect(() => {
    if (!isReload) return;
    const categoryList = categories?.categories?.realEstateTypeCat ?? [];
    const provincesFilter = provinces?.provinces ?? [];
    const province = provincesFilter?.find(
      (item) => item?.code === dataObject?.provinceCodes,
    );
    const subTypeTextOnly = getSubTypeTextOnly(
      dataObject?.subTypes,
      categoryList,
    );
    const newTexts = getNewTexts(dataObject, subTypeTextOnly, province);
    const newTitle = newTexts?.split('?')[0];
    setTitle([newTitle]);
    setCookie('titleSeo', newTexts);
  }, [dataObject, isReload]);

  useEffect(() => {
    if (!isReloadMap) return;
    const categoryList = categories?.categories?.realEstateTypeCat ?? [];
    const provincesFilter = provinces?.provinces ?? [];
    const province = provincesFilter?.find(
      (item) => item?.code === mapDataObj?.provinceCodes[0],
    );
    const subTypeTextOnly = getSubTypeTextOnly(
      mapDataObj?.subTypes,
      categoryList,
    );
    const newTexts = getNewTexts(mapDataObj, subTypeTextOnly, province);
    const newTitle = newTexts?.split('?')[0];
    setTitle([newTitle]);
    setCookie('titleSeo', newTexts);
  }, [mapDataObj, isReloadMap]);

  const handleOnChangeSort = (e) => {
    if (!switchMap) {
      onChangeSearchParam({sortBy: e, page: 1});
      setDataObject({
        ...dataObject,
        sortBy: e,
      });
      setCurrentPage(1);
      setIsReload(true);
      form.setFieldsValue({sortBy: e});
    } else {
      onChangeMapSearchParam({sortBy: [e], page: 1});
      setMapDataObj({
        ...mapDataObj,
        sortBy: [e],
      });
      setCurrentPage(1);
      setIsReloadMap(true);
    }
  };
  const handleChangeCheckedVars = (e) => {
    const checked = e.target.checked;
    if (!switchMap) {
      onChangeSearchParam({isPostByVARS: checked, page: 1});
      setDataObject({
        ...dataObject,
        isPostByVARS: checked,
      });
      setCurrentPage(1);
      setIsReload(true);
    } else {
      onChangeMapSearchParam({isPostByVARS: checked, page: 1});
      setMapDataObj({
        ...mapDataObj,
        isPostByVARS: checked,
      });
      setCurrentPage(1);
      setIsReloadMap(true);
    }
  };

  const currencyFormat = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  const formattedTotal = total ? currencyFormat(total) : 0;

  return (
    <>
      <Form form={form}>
        <Row gutter={[0, 16]} className='view-control-archive'>
          <Col xs={24}>
            <Row gutter={[0, 4]} align={'middle'} justify={'space-between'}>
              <Col xs={24} className='title'>
                <h1 className='title-archive' title={title}>
                  {title}
                </h1>
              </Col>
              <Col xs={18} className='title'>
                <Row gutter={[0, 8]}>
                  <Col xs={24}>
                    <p className={`total-result `}>
                      {dataObject?.types === 'du-an' ||
                      mapDataObj?.types[0] === 'du-an' ? (
                        <>
                          {messages['common.totalSearchProject']
                            .split('{total}')
                            ?.map((part, index, arr) => (
                              <React.Fragment key={index}>
                                {part}
                                {index < arr.length - 1 && (
                                  <span>{formattedTotal}</span>
                                )}
                              </React.Fragment>
                            ))}
                        </>
                      ) : (
                        <>
                          {messages['common.totalSearch']
                            .split('{total}')
                            ?.map((part, index, arr) => (
                              <React.Fragment key={index}>
                                {part}
                                {index < arr.length - 1 && (
                                  <span>{formattedTotal}</span>
                                )}
                              </React.Fragment>
                            ))}
                        </>
                      )}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col xs={6} style={{flex: 'none'}} className='order'>
                <div className='select view-order'>
                  <span>
                    <IntlMessages id='common.arrange' />:{' '}
                  </span>
                  <Form.Item name={'sortBy'}>
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
                      onChange={handleOnChangeSort}
                      defaultValue={messages['common.default']}
                      bordered={false}
                      options={sortCatOptions}
                      showSearch
                      filterOption={filterOptionSearch}
                      filterSort={(optionA, optionB) => {
                        (optionA?.label ?? '')
                          .toLowerCase()
                          .localeCompare((optionB?.label ?? '').toLowerCase());
                      }}
                    />
                  </Form.Item>
                </div>
              </Col>
            </Row>
          </Col>
          <Col xs={24}>
            <Row
              align={'middle'}
              justify={'space-between'}
              className='view-post-map'
            >
              <Col xs={18}>
                <Row
                  gutter={[16, 0]}
                  align={'middle'}
                  className='view-vars-map'
                >
                  {dataObject?.types !== 'du-an' && (
                    <Col className='post_vars'>
                      <Form.Item name='postByVARSTitle' valuePropName='checked'>
                        <Checkbox onChange={handleChangeCheckedVars}>
                          <TooltipVarsMember
                            titleVas={dataSectionConfig?.title}
                            image={dataSectionConfig?.tickIcon}
                            enable={varsMemberText?.enable}
                            description={varsMemberText?.description}
                          />
                        </Checkbox>
                      </Form.Item>
                    </Col>
                  )}

                  <Col className='post_map'>
                    <Row gutter={[8, 0]}>
                      <Col>
                        <IntlMessages id='common.map' />
                      </Col>
                      <Col>
                        <Form.Item name='switch'>
                          <Switch
                            checked={switchMap}
                            onChange={handleSwitchMap}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col className='view-order'>
                    <div className='select view-order'>
                      <span>
                        <IntlMessages id='common.arrange' />:{' '}
                      </span>
                      <Form.Item name={'sortBy'}>
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
                          onChange={handleOnChangeSort}
                          defaultValue={messages['common.default']}
                          bordered={false}
                          options={sortCatOptions}
                          showSearch
                          filterOption={filterOptionSearch}
                          filterSort={(optionA, optionB) => {
                            (optionA?.label ?? '')
                              .toLowerCase()
                              .localeCompare(
                                (optionB?.label ?? '').toLowerCase(),
                              );
                          }}
                        />
                      </Form.Item>
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col xs={6}>
                <div className='view-main d-flex align-center'>
                  <div
                    onClick={handleDisplayView}
                    className='product-view view-grid'
                    data-view='grid'
                    title='Grid'
                  >
                    <AppstoreOutlined />
                  </div>
                  <div
                    onClick={handleDisplayView}
                    className='product-view view-list'
                    data-view='list'
                    title='List'
                  >
                    <UnorderedListOutlined />
                  </div>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default TitleSearch;
TitleSearch.propTypes = {
  handleDisplayView: PropTypes.func,
  total: PropTypes.number,
  setIsReload: PropTypes.func,
  dataObject: PropTypes.any,
  isReload: PropTypes.bool,
  setCurrentPage: PropTypes.any,
  onChangeSearchParam: PropTypes.any,
  onChangeMapSearchParam: PropTypes.any,
  switchMap: PropTypes.bool,
  isReloadMap: PropTypes.bool,
  form: PropTypes.any,
  setIsReloadMap: PropTypes.any,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.any,
  setDataObject: PropTypes.any,
  handleSwitchMap: PropTypes.func,

  title: PropTypes.any,
  setTitle: PropTypes.any,
};
