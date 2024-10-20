import React, {useState} from 'react';
import {Button, Col, Form, Modal, Row} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import FormHeader from './FormHeader';
import FormPostType from './FormPostType';
import FormLocation from './FormLocation';
import FormPrice from './FormPrice';
import FormArea from './FormArea';
import FormDirection from './FormDirection';
import FormBedroom from './FormBedroom';
import FormProject from './FormProject';
import FormPoster from './FormPoster';
import PropTypes from 'prop-types';
import FormInvestor from './FormInvestor';
import FormConstruction from './FormConstruction';
import FormStatusProject from './FormStatusProject';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {fetchDistricts} from 'pages/api/districts';
import {fetchWards} from 'pages/api/wards';
import {setPostTypeText} from 'redux/actions/PostType';
import OutstandingProject from './FormOutstandingProject';
import FormMemberPost from './FormMemberPost';
import IntlMessages from '@crema/utility/IntlMessages';
import FormPriceArea from './FormPriceArea';
import {useIntl} from 'react-intl';
import {onChangeParamUrl} from 'components/SearchComponent';
import {
  formatCurrency,
  nFormatterPriceCustom,
  typesReplaceMapping,
} from 'shared/constants/AppConst';

const FilterModal = ({
  dataObject,
  setDataObject,
  setIsReload,
  setModal2Open,
  modal2Open,
  setMapDataObj,
  mapDataObj,
  switchMap,
  map,
  form,
  setIsReloadMap,
  setSubmitForm,
  setObjLocation,
  setResetForm,
  onChangeSearchParam,
  setCurrentPage,
  handleClickButtonSaveFilter,
}) => {
  const {messages} = useIntl();
  const dispatch = useDispatch();
  const [postType, setPostType] = useState(dataObject?.types);
  const [location, setLocation] = useState({});
  const [areaLabel, setAreaLabel] = useState('');
  const [priceLabel, setPriceLabel] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [isCheckedMem, setIsCheckedMem] = useState(false);
  const router = useRouter();
  const {categories} = useSelector((state) => state.categories);
  const subTypeFilterCats = categories?.categories?.realEstateTypeCat ?? [];
  const provincesState = useSelector((state) => state.provinces);
  const provincesFilter = provincesState?.provinces ?? [];

  const onReset = () => {
    // Chỉ định trường mà bạn muốn giữ nguyên giá trị
    const fieldsToPreserve = ['postTypesForm', 'postTypeHeader'];
    // Lọc các trường mà bạn muốn giữ nguyên giá trị
    const fieldsValuesToPreserve = form.getFieldsValue(fieldsToPreserve);
    form.resetFields();
    // Đặt lại giá trị cho các trường được giữ nguyên
    form.setFieldsValue(fieldsValuesToPreserve);
    form.setFieldsValue({
      text_location_head: messages['common.nationwide'],
      provinces_head: '',
    });
    setIsChecked(false);
    setIsCheckedMem(false);
    setResetForm(true);
    const paths = router.asPath?.split('/');
    let newPathObject;
    let type;
    if (paths[1].indexOf('?') > 0) {
      newPathObject = {
        pathname: router.pathname,
      };
      type = router.pathname.slice(0);
    } else {
      newPathObject = {
        pathname: `/${paths[1]}`,
      };
      type = paths[1];
    }
    router.push(newPathObject, undefined, {shallow: true});
    setDataObject({
      types: dataObject?.types ? dataObject?.types : type,
      subTypes: '',
      subTypesText: '',
      provinceCodes: '',
      districtCodes: '',
      wardCodes: '',
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
      searchText: '',
      isOutstanding: false,
      isPostByVARS: false,
      page: 1,
      pageSize: 12,
      sortBy: 'default',
    });

    setMapDataObj({
      ...mapDataObj,
      types: mapDataObj?.types ? [mapDataObj?.types[0]] : [type],
      subTypes: [],
      directions: [],
      areaFrom: null,
      areaTo: null,
      priceFrom: null,
      priceTo: null,
      provinceCodes: [],
      districtCodes: [],
      wardCodes: [],
      bedrooms: [],
      investors: [],
      projects: [],
      postBy: [],
      status: [],
      subStatus: [],
      sortBy: 'default',
      isOutstanding: false,
      isPostByVARS: false,
      searchText: '',
    });

    setObjLocation({
      provinceCode: '',
      districtCode: '',
      wardCode: '',
    });
  };

  const filterCityByCode = () => {
    const cityCode = form.getFieldValue('provinces');
    const cityFilter = provincesFilter.filter((item) => item.code === cityCode);

    if (cityFilter.length > 0)
      return {
        cityCode: cityFilter[0].code,
        cityName: cityFilter[0].name,
        citySlug: cityFilter[0].slug,
      };
    else return null;
  };

  const filterDistrictByCode = async () => {
    const cityCode = form.getFieldValue('provinces');
    const districtCode = form.getFieldValue('districts');
    const resultData = await fetchDistricts(cityCode);
    const data = resultData?.data ?? [];
    const districtFilter = data.filter((item) => item.code === districtCode);
    if (districtFilter.length > 0)
      return {
        districtCode: districtFilter[0].code,
        districtName: districtFilter[0].name,
        districtSlug: districtFilter[0].slug,
      };
    else return null;
  };

  const filterWardByCode = async () => {
    const cityCode = form.getFieldValue('provinces');
    const districtCode = form.getFieldValue('districts');
    const wardCode = form.getFieldValue('wards');
    const resultData = await fetchWards(cityCode, districtCode);
    const data = resultData?.data ?? [];
    const wardFilter = data.filter((item) => item.code === wardCode);

    if (wardFilter.length > 0)
      return {
        wardCode: wardFilter[0].code,
        wardName: wardFilter[0].name,
        wardSlug: wardFilter[0].slug,
      };
    else return null;
  };

  const getFormItemValue = async () => {
    const postTypeHeader = form.getFieldValue('postTypesForm');
    const subPostTypeHeader =
      form.getFieldValue('realTypes') &&
      form.getFieldValue('realTypes')[0] === ''
        ? []
        : form.getFieldValue('realTypes');
    const cityHeader = filterCityByCode();
    const proviceModal = filterCityByCode();
    const disctictModal = await filterDistrictByCode();
    const wardModal = await filterWardByCode();
    const direction =
      form.getFieldValue('direction') &&
      form.getFieldValue('direction')[0] === ''
        ? []
        : form.getFieldValue('direction');
    const bedrooms =
      form.getFieldValue('bedroom') && form.getFieldValue('bedroom')[0] === ''
        ? []
        : form.getFieldValue('bedroom');
    const investors = form.getFieldValue('investors') ?? [];
    const subStatus = form.getFieldValue('subStatus') ?? [];
    const status = form.getFieldValue('status') ?? [];
    const postBy =
      form.getFieldValue('poster') && form.getFieldValue('poster')[0] === ''
        ? []
        : form.getFieldValue('poster');
    const outstanding = form.getFieldValue('outstanding') ?? false;
    const postByVARS = form.getFieldValue('postByVARS') ?? false;
    const projects = form.getFieldValue('projectBds') ?? [];
    const searchText = form.getFieldValue('searchTextHeader') ?? '';
    const areaFrom = form.getFieldValue('area')
      ? form.getFieldValue('area')[0]
      : null;
    const areaTo = form.getFieldValue('area')
      ? form.getFieldValue('area')[1]
      : null;
    const priceFrom = form.getFieldValue('price')
      ? form.getFieldValue('price')[0]
      : null;
    let priceTo;
    if (postTypeHeader === 'bds-cho-thue') {
      priceTo = form.getFieldValue('price')
        ? form.getFieldValue('price')[1]
        : null;
    } else {
      priceTo = form.getFieldValue('price')
        ? form.getFieldValue('price')[1]
        : null;
    }
    return {
      postTypeHeader,
      subPostTypeHeader,
      cityHeader,
      proviceModal,
      disctictModal,
      wardModal,
      direction,
      bedrooms,
      investors,
      subStatus,
      status,
      postBy,
      projects,
      searchText,
      areaFrom,
      areaTo,
      priceFrom,
      priceTo,
      postByVARS,
      outstanding,
    };
  };
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

  const onSubmit = async () => {
    setSubmitForm(true);
    let typeSegment = '';
    let locationSegment = '';
    let priceSegment = '';
    let areaSegment = '';
    let bedroomSegment = '';
    let secondarySegment = '/';
    const {
      postTypeHeader,
      subPostTypeHeader,
      cityHeader,
      proviceModal,
      disctictModal,
      wardModal,
      direction,
      bedrooms,
      investors,
      subStatus,
      status,
      postBy,
      projects,
      searchText,
      areaFrom,
      areaTo,
      priceFrom,
      priceTo,
      outstanding,
      postByVARS,
    } = await getFormItemValue();
    const queryParams = {
      sortBy: 'default',
      page: 1,
      pageSize: 12,
    };

    const addParamIfExists = (key, value) => {
      if (value?.length > 0) {
        queryParams[key] = value?.join(',');
      }
    };

    const postType = typesReplaceMapping[postTypeHeader];
    const realTypes = subPostTypeHeader?.filter((value) => value !== 'all');
    const realTypesFilter = realTypes?.slice(1);
    const realTypesAll = subPostTypeHeader?.filter((value) => value === 'all');
    const provinceSlug = cityHeader ? cityHeader?.citySlug : '';

    const subTypeSlug = realTypes
      ? subTypeFilterCats?.find(
          (item) =>
            item?.parent === postTypeHeader && item?.code === realTypes[0],
        )
      : '';

    if (postTypeHeader) {
      typeSegment = postType;
    }
    if (realTypes?.length > 0) {
      typeSegment = `${subTypeSlug?.fields?.slug}`;
    }

    if (wardModal) {
      locationSegment += wardModal
        ? `tai-${wardModal?.wardSlug}-t${cityHeader?.cityCode}`
        : '';
    } else if (disctictModal) {
      locationSegment += disctictModal
        ? `tai-${disctictModal?.districtSlug}-t${cityHeader?.cityCode}`
        : '';
    } else if (proviceModal) {
      locationSegment += provinceSlug
        ? `tai-${provinceSlug}-t${proviceModal?.cityCode}`
        : '';
    }

    if (priceFrom && priceTo) {
      if (Number(priceFrom) === 0) {
        priceSegment = `gia-duoi-${formatCurrency(priceTo)}`;
      } else {
        priceSegment = `gia-tu-${formatCurrency(
          priceFrom,
        )}-den-${formatCurrency(priceTo)}`;
      }
    }

    if (areaFrom && areaTo) {
      areaSegment =
        areaFrom === 0
          ? `dt-duoi-${areaTo}m2`
          : `dt-tu-${areaFrom}m2-den-${areaTo}m2`;
    }
    if (bedrooms?.length > 0) {
      bedroomSegment = `${bedrooms[0]}pn`;
    }

    const combinedUrlParts = [priceSegment, areaSegment, bedroomSegment].filter(
      Boolean,
    );
    secondarySegment += combinedUrlParts?.join('-');

    const link = `/${typeSegment}${
      locationSegment ? `-${locationSegment}` : ''
    }${secondarySegment}`;

    // Kiểm tra nếu có thì thêm vào params
    if (realTypesAll && realTypesAll[0] !== '') {
      const subTypes = realTypesFilter?.join(',');
      if (subTypes) {
        queryParams.subTypes = subTypes;
      }
    }

    // Kiểm tra nếu có thì thêm vào params
    addParamIfExists('bedrooms', bedrooms?.slice(1));
    addParamIfExists('directions', direction);
    addParamIfExists('investors', investors);
    addParamIfExists('postBy', postBy);
    addParamIfExists('projects', projects);
    addParamIfExists('status', status);
    addParamIfExists('subStatus', subStatus);

    if (outstanding) queryParams.isOutstanding = outstanding;
    if (postByVARS) queryParams.isPostByVARS = postByVARS;
    if (searchText) queryParams.searchText = searchText;

    const price = `${
      priceFrom && nFormatterPriceCustom(priceFrom?.toString())
    }${priceTo && ` - ` + nFormatterPrice(priceTo?.toString())}`;

    router.push(
      {
        pathname: `/${link}`,
        query: queryParams,
      },
      undefined,
      {shallow: true},
    );

    if (priceFrom && priceTo) {
      form.setFieldsValue({
        priceHeader:
          priceFrom === 0 && priceTo === 0
            ? messages['common.all']
            : priceFrom === '' || priceTo === ''
            ? ''
            : priceFrom === -1 || priceTo === -1
            ? '-1'
            : price,
      });
    }

    form.setFieldsValue({
      // realTypes: subPostTypeHeader.length > 0 ? subPostTypeHeader : '',
      postTypeHeader: postTypeHeader,
      subPostTypeHeader:
        subPostTypeHeader.length > 0 ? subPostTypeHeader : undefined,
      provinces_head: cityHeader?.cityCode,
      districts_head: disctictModal?.districtCode,
      wards_head: wardModal?.wardCode,
      text_location_head:
        (wardModal ? wardModal?.wardName + ', ' : '') +
        (disctictModal ? disctictModal?.districtName + ', ' : '') +
        (proviceModal ? proviceModal?.cityName : messages['common.nationwide']),
    });
    setObjLocation({
      provinceCode: proviceModal ? proviceModal?.cityCode : '',
      districtCode: disctictModal ? disctictModal?.districtCode : '',
      wardCode: wardModal ? wardModal?.wardCode : '',
    });
    if (!switchMap) {
      setDataObject({
        ...dataObject,
        types: postTypeHeader,
        subTypes: subPostTypeHeader?.length > 0 ? subPostTypeHeader : '',
        subTypesText: '',
        provinceCodes: proviceModal ? proviceModal?.cityCode : '',
        provinceText: proviceModal ? proviceModal?.cityName : '',
        districtCodes: disctictModal ? disctictModal?.districtCode : '',
        districtText: disctictModal ? disctictModal?.districtName : '',
        wardCodes: wardModal ? wardModal?.wardCode : '',
        wardText: wardModal ? wardModal?.wardName : '',
        priceFrom: priceFrom ?? '',
        priceTo: priceTo ?? '',
        areaFrom: areaFrom ?? '',
        areaTo: areaTo ?? '',
        directions: direction?.length > 0 ? direction : '',
        bedrooms: bedrooms?.length > 0 ? bedrooms : '',
        investors: investors?.length > 0 ? investors : '',
        postBy: postBy?.length > 0 ? postBy : '',
        projects: projects?.length > 0 ? projects : '',
        status: status?.length > 0 ? status : '',
        subStatus: subStatus?.length > 0 ? subStatus : '',
        searchText: searchText,
      });

      onChangeSearchParam({
        ...dataObject,
        page: 1,
      });
      setCurrentPage(1);
      setIsReload(true);
    } else {
      const isEmptyObj = !Object.keys(location).length;
      if (!isEmptyObj) {
        map.setCenter(location);
        const bounds = map.getBounds();
        let NE = bounds.getNorthEast();
        let SW = bounds.getSouthWest();
        let NW = new google.maps.LatLng(NE.lat(), SW.lng());
        let SE = new google.maps.LatLng(SW.lat(), NE.lng());
        let polygons = [
          {lat: NE.lat(), lng: NE.lng()},
          {lat: NW.lat(), lng: NW.lng()},
          {lat: SW.lat(), lng: SW.lng()},
          {lat: SE.lat(), lng: SE.lng()},
          {lat: NE.lat(), lng: NE.lng()},
        ];
        setMapDataObj({
          ...mapDataObj,
          subTypes:
            subPostTypeHeader.length > 0 && subPostTypeHeader[0] !== ''
              ? subPostTypeHeader
              : [],
          polygon: polygons,
        });
        setIsReloadMap(true);
      } else {
        setMapDataObj({
          ...mapDataObj,
          types: [postTypeHeader],
          subTypes:
            subPostTypeHeader?.length > 0 && subPostTypeHeader[0] !== ''
              ? subPostTypeHeader
              : [],
          directions:
            direction?.length > 0 && direction[0] == undefined ? [] : direction,
          areaFrom: areaFrom,
          areaTo: areaTo,
          priceFrom: priceFrom,
          priceTo: priceTo,
          provinceCodes: proviceModal ? [proviceModal?.cityCode] : [],
          provinceText: proviceModal ? proviceModal?.cityName : '',
          districtCodes: disctictModal ? [disctictModal?.districtCode] : [],
          districtText: disctictModal ? disctictModal?.districtName : '',
          wardCodes: wardModal ? [wardModal?.wardCode] : [],
          wardText: wardModal ? wardModal?.wardName : '',
          bedrooms: bedrooms?.length > 0 ? bedrooms : [],
          investors: investors?.length > 0 ? investors : [],
          projects: projects?.length > 0 ? projects : [],
          postBy: postBy?.length > 0 ? postBy : [],
          status: status?.length > 0 ? status : [],
          subStatus: subStatus?.length > 0 ? subStatus : [],
          searchText: searchText,
        });
        setIsReloadMap(true);
      }
    }
    dispatch(setPostTypeText(postTypeHeader));
    setModal2Open(false);
  };

  // Xử lý modal
  const handleCloseModal = () => {
    setModal2Open(false);
  };

  return (
    <>
      <Modal
        className='modal-filter-search'
        // title={
        //   <>
        //     <div
        //       className='button-save-search'
        //       onClick={handleClickButtonSaveFilter}
        //     >
        //       <IntlMessages id='home.saveFilter' />
        //     </div>
        //     <div className='ant-modal-title'>
        //       <IntlMessages id='common.allFilter' />
        //     </div>
        //   </>
        // }
        title={<IntlMessages id='common.filter' />}
        centered
        open={modal2Open}
        onOk={handleCloseModal}
        onCancel={handleCloseModal}
        width={800}
        closeIcon={<CloseOutlined />}
        destroyOnClose
        maskClosable={false}
        footer={
          <Row gutter={[8, 8]} align={'middle'} justify={'end'}>
            <Col>
              <Button type='default' onClick={onReset}>
                <IntlMessages id='common.reset' />
              </Button>
            </Col>
            <Col>
              <Button type='primary' onClick={onSubmit}>
                <IntlMessages id='common.apply' />
              </Button>
            </Col>
          </Row>
        }
      >
        <div className='all-filter'>
          <div className='all-filter--inner'>
            <Form form={form} className='filter-form' layout='vertical'>
              <Row gutter={[0, 16]}>
                <Col xs={24}>
                  <FormHeader
                    setPostType={setPostType}
                    dataObject={dataObject}
                    setDataObject={setDataObject}
                    form={form}
                    setLocation={setLocation}
                    mapDataObj={mapDataObj}
                    setMapDataObj={setMapDataObj}
                    setIsChecked={setIsChecked}
                    setIsCheckedMem={setIsCheckedMem}
                  />
                </Col>
                <Col xs={24}>
                  {postType == 'du-an' ? (
                    <OutstandingProject
                      isChecked={isChecked}
                      setIsChecked={setIsChecked}
                      form={form}
                      dataObject={dataObject}
                      setDataObject={setDataObject}
                      mapDataObj={mapDataObj}
                      setMapDataObj={setMapDataObj}
                      switchMap={switchMap}
                    />
                  ) : (
                    <FormMemberPost
                      setIsCheckedMem={setIsCheckedMem}
                      isCheckedMem={isCheckedMem}
                      form={form}
                      dataObject={dataObject}
                      setDataObject={setDataObject}
                      mapDataObj={mapDataObj}
                      setMapDataObj={setMapDataObj}
                      switchMap={switchMap}
                    />
                  )}
                </Col>
                <Col xs={24}>
                  <FormPostType
                    form={form}
                    postType={postType}
                    setPostType={setPostType}
                    dataObject={dataObject}
                    setDataObject={setDataObject}
                    mapDataObj={mapDataObj}
                    setMapDataObj={setMapDataObj}
                    switchMap={switchMap}
                  />
                </Col>
                <Col xs={24}>
                  <FormLocation
                    dataObject={dataObject}
                    setDataObject={setDataObject}
                    setLocation={setLocation}
                    form={form}
                    setMapDataObj={setMapDataObj}
                    mapDataObj={mapDataObj}
                    switchMap={switchMap}
                  />
                </Col>
                <Col xs={24}>
                  <FormPriceArea
                    dataObject={dataObject}
                    setDataObject={setDataObject}
                    priceLabel={priceLabel}
                    setPriceLabel={setPriceLabel}
                    setAreaLabel={setAreaLabel}
                    areaLabel={areaLabel}
                    form={form}
                    switchMap={switchMap}
                    setMapDataObj={setMapDataObj}
                    mapDataObj={mapDataObj}
                    postType={postType}
                  />
                </Col>
                <Col xs={24}>
                  <FormDirection
                    dataObject={dataObject}
                    setDataObject={setDataObject}
                    setMapDataObj={setMapDataObj}
                    mapDataObj={mapDataObj}
                    form={form}
                  />
                </Col>
                <Col xs={24}>
                  <FormBedroom
                    dataObject={dataObject}
                    setDataObject={setDataObject}
                    setMapDataObj={setMapDataObj}
                    mapDataObj={mapDataObj}
                    form={form}
                  />
                </Col>
                {dataObject?.types !== 'du-an' ? (
                  <>
                    <Col xs={24}>
                      <FormPoster
                        dataObject={dataObject}
                        setDataObject={setDataObject}
                        setMapDataObj={setMapDataObj}
                        mapDataObj={mapDataObj}
                        form={form}
                      />
                    </Col>
                    <Col xs={24}>
                      <FormProject
                        dataObject={dataObject}
                        setDataObject={setDataObject}
                        setMapDataObj={setMapDataObj}
                        mapDataObj={mapDataObj}
                        form={form}
                      />
                    </Col>
                  </>
                ) : (
                  <>
                    <Col xs={24}>
                      <FormInvestor
                        dataObject={dataObject}
                        setDataObject={setDataObject}
                        setMapDataObj={setMapDataObj}
                        mapDataObj={mapDataObj}
                        form={form}
                      />
                    </Col>
                    <Col xs={24}>
                      <Row gutter={[16, 16]}>
                        <Col xs={24} md={12}>
                          <FormConstruction
                            dataObject={dataObject}
                            setDataObject={setDataObject}
                            setMapDataObj={setMapDataObj}
                            mapDataObj={mapDataObj}
                            form={form}
                          />
                        </Col>
                        <Col xs={24} md={12}>
                          <FormStatusProject
                            dataObject={dataObject}
                            setDataObject={setDataObject}
                            setMapDataObj={setMapDataObj}
                            mapDataObj={mapDataObj}
                            form={form}
                          />
                        </Col>
                      </Row>
                    </Col>
                  </>
                )}
              </Row>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default FilterModal;
FilterModal.propTypes = {
  setIsReload: PropTypes.func,
  dataObject: PropTypes.any,
  setDataObject: PropTypes.func,
  setModal2Open: PropTypes.any,
  modal2Open: PropTypes.any,
  setMapDataObj: PropTypes.func,
  mapDataObj: PropTypes.any,
  switchMap: PropTypes.bool,
  map: PropTypes.any,
  form: PropTypes.any,
  setIsReloadMap: PropTypes.func,
  setSubmitForm: PropTypes.func,
  setObjLocation: PropTypes.func,
  setResetForm: PropTypes.any,
  onChangeSearchParam: PropTypes.any,
  setCurrentPage: PropTypes.any,
  setPriceLabel: PropTypes.any,
  priceLabel: PropTypes.any,
  handleClickButtonSaveFilter: PropTypes.any,
};
