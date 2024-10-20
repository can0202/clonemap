import React, {useState, useEffect, useRef} from 'react';
import {Button, Form} from 'antd';
import FilterModal from '../FilterModal';
import {useSelector} from 'react-redux';
import PropTypes from 'prop-types';
import IconArrow from 'assets/icon/arrow-down-black.png';
import ModalLogin from 'components/ModalLogin';
import {useRouter} from 'next/router';
import {fetchDistricts} from 'pages/api/districts';
import {fetchWards} from 'pages/api/wards';
import ModalSaveFilter from 'components/ModalSaveFilter';
import BoxButtonFilterMobile from './BoxButtonFilterMb';
import BoxSearch from './BoxSearch';
import BoxType from './BoxType';
import BoxSubType from './BoxSubType';
import BoxLocation from './BoxLocation';
import BoxPrice from './BoxPrice';
import BoxButtonFilter from './BoxButtonFilter';
import BoxButtonSave from './BoxButtonSave';
import BoxViews from './BoxViews';
import {useIntl} from 'react-intl';
import IntlMessages from '@crema/utility/IntlMessages';

const HeaderSearch = ({
  dataObject,
  setDataObject,
  setIsReload,
  setProvinces,
  setCurrentPage,
  onChangeSearchParam,
  onChangeMapSearchParam,
  form,
  setMapDataObj,
  mapDataObj,
  switchMap,
  map,
  setIsReloadMap,
  provincesFilter,

  handleSwitchMap,
  handleDisplayView,
  objLocation,
  setObjLocation,
  openFullMap,
}) => {
  const router = useRouter();
  const {messages} = useIntl();
  let isEditValue = router?.query?.isEdit;
  const {isAuthenticated} = useSelector(({auth}) => auth);
  const [isToggle, setIsToggle] = useState(true);
  const popupRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [openModalSaveFilter, setOpenModalSaveFilter] = useState(false);
  const [districts, setDistricts] = useState([]);
  const [awards, setWards] = useState([]);
  const [submitForm, setSubmitForm] = useState(false);
  const [latlngState, setLatLngState] = useState({});
  const [isChangedKV, setIsChangedKV] = useState(false);
  const [resetForm, setResetForm] = useState(false);

  const {categories} = useSelector((state) => state.categories);
  const provincesCate = useSelector((state) => state.provinces);
  const [postTypeFilterOptions, setPostTypeFilterOptions] = useState([]);
  const [subTypeFilterOptions, setSubTypeFilterOptions] = useState([]);
  const [provincesFilterOptions, setProvincesFilterOptions] = useState([]);
  const [districtsOptions, setDistrictsOptions] = useState([]);
  const [wardsOptions, setWardsOptions] = useState([]);
  let postType;
  useEffect(() => {
    let postType;
    if (!switchMap) postType = dataObject?.types ?? '';
    else postType = mapDataObj?.types[0] ?? [];
    const postTypeFilterCats = categories?.categories?.postTypeFilterCat ?? [];
    const subTypeFilterCats = categories?.categories?.realEstateTypeCat ?? [];
    const provincesFilter = provincesCate?.provinces ?? [];
    const newTypeOptions = [];
    const newSubTypeOptions = [{label: messages['common.all'], value: 'all'}];
    const newProvincesOptions = [
      {label: messages['common.nationwide'], value: ''},
    ];

    postTypeFilterCats?.forEach((ele) => {
      let typesOption = {
        label: ele.name,
        value: ele.code,
      };
      newTypeOptions?.push(typesOption);
    });

    subTypeFilterCats?.forEach((ele) => {
      if (postType === ele?.parent) {
        let subTypesOption = {
          label: ele?.name,
          value: ele?.code,
          metadata: ele?.fields?.slug,
        };
        newSubTypeOptions?.push(subTypesOption);
      }
    });

    provincesFilter?.forEach((ele) => {
      let provincesOption = {
        label: ele?.name,
        value: ele?.code,
        metadata: ele?.slug,
      };
      newProvincesOptions?.push(provincesOption);
    });
    setProvincesFilterOptions(newProvincesOptions);
    setSubTypeFilterOptions(newSubTypeOptions);
    setPostTypeFilterOptions(newTypeOptions);
  }, [categories, provincesCate, dataObject]);

  useEffect(() => {
    if (resetForm) {
      setDistricts([]);
      setWards([]);
      setResetForm(false);
    }
  }, [resetForm]);

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

  //handle click outside hide dropdown
  useEffect(() => {
    const handleClickOutside = async (event) => {
      if (
        popupRef.current &&
        !popupRef.current.contains(event.target) &&
        !event.target.classList.contains('ant-select-item-option-content') &&
        !isToggle
      ) {
        console.log('sss', event);

        setIsToggle(true);
        let cityCode = '';
        let districtCode = '';
        let wardCode = '';
        if (objLocation?.provinceCode !== '' && objLocation?.provinceCode) {
          const cityFilter = provincesFilter?.filter(
            (item) => item?.code === objLocation?.provinceCode,
          );

          cityCode = cityFilter[0]?.code;
          const districtFetch = await getDistricts(cityCode);
          const newDistrictsOptions = [];
          districtFetch?.forEach((ele) => {
            let districtsOption = {
              provinId: cityCode,
              label: ele?.name,
              value: ele?.code,
              metadata: ele?.slug,
            };
            newDistrictsOptions?.push(districtsOption);
          });
          setDistrictsOptions(newDistrictsOptions);

          if (objLocation?.districtCode !== '' && objLocation?.districtCode) {
            const districtFilter = districtFetch?.filter(
              (item) => item?.code === objLocation?.districtCode,
            );
            districtCode = districtFilter[0]?.code;
            const newWardsOptions = [];
            const wardFetch = await getWards(cityCode, districtCode);
            wardFetch?.forEach((ele) => {
              let eleOption = {
                provinId: cityCode,
                label: ele?.name,
                value: ele?.code,
                metadata: ele?.slug,
              };
              newWardsOptions?.push(eleOption);
            });
            setWardsOptions(newWardsOptions);
            if (objLocation?.wardCode !== '' && objLocation?.wardCode) {
              const wardFilter = wardFetch?.filter(
                (item) => item?.code === objLocation?.wardCode,
              );
              wardCode = wardFilter[0]?.code;
            }
          }
        } else {
          setDistricts([]);
          setDistrictsOptions([]);
          setWardsOptions([]);
          setWards([]);
        }
        form.setFieldsValue({
          provinces_head: cityCode,
          districts_head: districtCode === '' ? null : districtCode,
          wards_head: wardCode === '' ? null : wardCode,
        });
        setDataObject({
          ...dataObject,
          provinceCodes:
            objLocation?.provinceCode === '' || !objLocation?.provinceCode
              ? ''
              : objLocation?.provinceCode,
          districtCodes:
            objLocation?.districtCode === '' || !objLocation?.districtCode
              ? ''
              : objLocation?.districtCode,
          wardCodes:
            objLocation?.wardCode === '' || !objLocation?.wardCode
              ? ''
              : objLocation?.wardCode,
        });
        setMapDataObj({
          ...mapDataObj,
          provinceCodes:
            objLocation.provinceCode === '' || !objLocation.provinceCode
              ? []
              : [objLocation.provinceCode],
          districtCodes:
            objLocation.districtCode === '' || !objLocation.districtCode
              ? []
              : [objLocation.districtCode],
          wardCodes:
            objLocation.wardCode === '' || !objLocation.wardCode
              ? []
              : [objLocation.wardCode],
        });
        console.log('map 1');
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isToggle]);

  useEffect(async () => {
    if (objLocation.provinceCode !== '' && objLocation.provinceCode) {
      const districtFetch = await getDistricts(objLocation.provinceCode);
      const newDistrictsOptions = [];
      districtFetch?.forEach((ele) => {
        let districtsOption = {
          provinId: objLocation.provinceCode,
          label: ele?.name,
          value: ele?.code,
          metadata: ele?.slug,
        };
        newDistrictsOptions?.push(districtsOption);
      });
      setDistrictsOptions(newDistrictsOptions);
      if (objLocation.districtCode !== '' && objLocation.districtCode) {
        const newWardsOptions = [];
        const wardFetch = await getWards(
          objLocation.provinceCode,
          objLocation.districtCode,
        );
        wardFetch?.forEach((ele) => {
          let eleOption = {
            provinId: objLocation.provinceCode,
            label: ele?.name,
            value: ele?.code,
            metadata: ele?.slug,
          };
          newWardsOptions?.push(eleOption);
        });
        setWardsOptions(newWardsOptions);
      } else {
        setWardsOptions([]);
      }
      form.setFieldsValue({
        provinces_head: objLocation.provinceCode,
        districts_head:
          objLocation.districtCode !== '' && objLocation.districtCode
            ? objLocation.districtCode
            : undefined,
        wards_head:
          objLocation.wardCode !== '' && objLocation.wardCode
            ? objLocation.wardCode
            : undefined,
      });
    }
  }, [objLocation]);

  const filterDistrictByCode = async () => {
    const cityCode = form.getFieldValue('provinces');
    const districtCode = form.getFieldValue('districts');
    if (cityCode) {
      const resultData = await fetchDistricts(cityCode);
      const data = resultData?.data ?? [];
      setDistricts(data);
    } else {
      setDistricts([]);
    }
  };

  const filterWardByCode = async () => {
    const cityCode = form.getFieldValue('provinces');
    const districtCode = form.getFieldValue('districts');
    const wardCode = form.getFieldValue('wards');
    if (cityCode && districtCode) {
      const resultData = await fetchWards(cityCode, districtCode);
      const data = resultData?.data ?? [];
      setWards(data);
    } else {
      setWards([]);
    }
  };

  useEffect(async () => {
    if (submitForm) {
      await filterDistrictByCode();
      await filterWardByCode();
      setSubmitForm(false);
    }
  }, [submitForm]);

  // Handle Open Modal
  const handleOpenModal = () => {
    setModal2Open(true);
  };
  // Xử lý mở popup filter khi có param isEdit == true
  useEffect(() => {
    if (isEditValue == 'true') {
      handleOpenModal();
    }
  }, [isEditValue]);

  const handleClickButtonSaveFilter = () => {
    if (!isAuthenticated) {
      setOpenModal(true);
      return;
    }
    setModal2Open(false);
    setOpenModalSaveFilter(true);
  };

  return (
    <>
      <div className={`action-search`}>
        <div className='container'>
          <div className='search-header'>
            <Form form={form} name='basic' className='d-flex'>
              <BoxButtonFilterMobile setModal2Open={setModal2Open} />
              <BoxSearch
                setIsReload={setIsReload}
                setCurrentPage={setCurrentPage}
                switchMap={switchMap}
                onChangeMapSearchParam={onChangeMapSearchParam}
                onChangeSearchParam={onChangeSearchParam}
                setDataObject={setDataObject}
                dataObject={dataObject}
                mapDataObj={mapDataObj}
                setMapDataObj={setMapDataObj}
                openFullMap={openFullMap}
              />
              <BoxType
                typeOptions={postTypeFilterOptions}
                form={form}
                switchMap={switchMap}
                dataObject={dataObject}
                setDataObject={setDataObject}
                mapDataObj={mapDataObj}
                setMapDataObj={setMapDataObj}
                onChangeSearchParam={onChangeSearchParam}
                setCurrentPage={setCurrentPage}
                setIsReload={setIsReload}
                onChangeMapSearchParam={onChangeMapSearchParam}
                setIsReloadMap={setIsReloadMap}
                IconArrow={IconArrow}
                setObjLocation={setObjLocation}
                setSubTypeFilterOptions={setSubTypeFilterOptions}
              />
              <BoxSubType
                subTypeObtions={subTypeFilterOptions}
                form={form}
                switchMap={switchMap}
                dataObject={dataObject}
                setDataObject={setDataObject}
                mapDataObj={mapDataObj}
                setMapDataObj={setMapDataObj}
                onChangeSearchParam={onChangeSearchParam}
                setCurrentPage={setCurrentPage}
                setIsReload={setIsReload}
                onChangeMapSearchParam={onChangeMapSearchParam}
                setIsReloadMap={setIsReloadMap}
                IconArrow={IconArrow}
              />
              <BoxLocation
                form={form}
                switchMap={switchMap}
                dataObject={dataObject}
                setDataObject={setDataObject}
                mapDataObj={mapDataObj}
                setMapDataObj={setMapDataObj}
                onChangeSearchParam={onChangeSearchParam}
                setCurrentPage={setCurrentPage}
                setIsReload={setIsReload}
                onChangeMapSearchParam={onChangeMapSearchParam}
                setIsReloadMap={setIsReloadMap}
                popupRef={popupRef}
                setIsToggle={setIsToggle}
                isToggle={isToggle}
                provinceOptions={provincesFilterOptions}
                provincesFilter={provincesFilter}
                districtOptions={districtsOptions}
                setDistrictsOptions={setDistrictsOptions}
                setWardsOptions={setWardsOptions}
                wardsOptions={wardsOptions}
                setIsChangedKV={setIsChangedKV}
                isChangedKV={isChangedKV}
                setObjLocation={setObjLocation}
                setWards={setWards}
                awards={awards}
                setDistricts={setDistricts}
                districts={districts}
                setLatLngState={setLatLngState}
                latlngState={latlngState}
                setProvinces={setProvinces}
                IconArrow={IconArrow}
              />
              <BoxPrice
                form={form}
                switchMap={switchMap}
                dataObject={dataObject}
                setDataObject={setDataObject}
                mapDataObj={mapDataObj}
                setMapDataObj={setMapDataObj}
                onChangeSearchParam={onChangeSearchParam}
                setCurrentPage={setCurrentPage}
                setIsReload={setIsReload}
                onChangeMapSearchParam={onChangeMapSearchParam}
                setIsReloadMap={setIsReloadMap}
                postType={postType}
                IconArrow={IconArrow}
              />
              <BoxButtonFilter handleOpenModal={handleOpenModal} />
              <BoxButtonSave
                handleClickButtonSaveFilter={handleClickButtonSaveFilter}
              />
              {switchMap ? (
                <Button
                  type='default'
                  className='button-view-layout'
                  onClick={handleDisplayView}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='12'
                    viewBox='0 0 18 12'
                    fill='none'
                  >
                    <path
                      d='M16.4679 11.0729H4.86574C4.82383 11.0729 4.79263 11.0572 4.77312 11.0385C4.75415 11.0203 4.75 11.004 4.75 10.9913C4.75 10.9786 4.75415 10.9623 4.77312 10.9441C4.79263 10.9254 4.82383 10.9097 4.86574 10.9097H16.4676C16.5095 10.9097 16.5407 10.9254 16.5602 10.9441C16.5792 10.9623 16.5833 10.9786 16.5833 10.9913C16.5833 11.0042 16.5791 11.0205 16.5602 11.0386C16.5408 11.0572 16.5098 11.0729 16.4679 11.0729Z'
                      stroke='#D1132A'
                      strokeWidth='1.5'
                    />
                    <path
                      d='M16.5833 5.99471V5.99519C16.5833 6.0077 16.5793 6.02382 16.5604 6.04196C16.541 6.06063 16.5098 6.07634 16.4679 6.07634H4.86574C4.82383 6.07634 4.79263 6.06064 4.77312 6.0419C4.75415 6.02367 4.75 6.00739 4.75 5.99471C4.75 5.98204 4.75415 5.96575 4.77312 5.94753C4.79263 5.92879 4.82383 5.91309 4.86574 5.91309H16.4676C16.5095 5.91309 16.5407 5.92879 16.5602 5.94753C16.5792 5.96575 16.5833 5.98203 16.5833 5.99471Z'
                      stroke='#D1132A'
                      strokeWidth='1.5'
                    />
                    <path
                      d='M16.4679 1.07976H4.86574C4.82383 1.07976 4.79263 1.06405 4.77312 1.04532C4.75415 1.02709 4.75 1.01081 4.75 0.998132C4.75 0.985453 4.75415 0.969173 4.77312 0.950947C4.79263 0.932211 4.82383 0.916504 4.86574 0.916504H16.4676C16.5095 0.916504 16.5407 0.932211 16.5602 0.950947C16.5792 0.969173 16.5833 0.985453 16.5833 0.998132C16.5833 1.01099 16.5791 1.02729 16.5602 1.04544C16.5408 1.06408 16.5098 1.07976 16.4679 1.07976Z'
                      stroke='#D1132A'
                      strokeWidth='1.5'
                    />
                    <path
                      d='M1.5013 1.83317C1.96154 1.83317 2.33464 1.46007 2.33464 0.999837C2.33464 0.5396 1.96154 0.166504 1.5013 0.166504C1.04106 0.166504 0.667969 0.5396 0.667969 0.999837C0.667969 1.46007 1.04106 1.83317 1.5013 1.83317Z'
                      fill='#D1132A'
                    />
                    <path
                      d='M1.5013 6.83317C1.96154 6.83317 2.33464 6.46007 2.33464 5.99984C2.33464 5.5396 1.96154 5.1665 1.5013 5.1665C1.04106 5.1665 0.667969 5.5396 0.667969 5.99984C0.667969 6.46007 1.04106 6.83317 1.5013 6.83317Z'
                      fill='#D1132A'
                    />
                    <path
                      d='M1.5013 11.8332C1.96154 11.8332 2.33464 11.4601 2.33464 10.9998C2.33464 10.5396 1.96154 10.1665 1.5013 10.1665C1.04106 10.1665 0.667969 10.5396 0.667969 10.9998C0.667969 11.4601 1.04106 11.8332 1.5013 11.8332Z'
                      fill='#D1132A'
                    />
                  </svg>
                </Button>
              ) : (
                <Button
                  type='default'
                  className='button-view-layout'
                  onClick={handleSwitchMap}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='20'
                    height='20'
                    viewBox='0 0 20 20'
                    fill='none'
                  >
                    <path
                      d='M2.5 7.25782C2.5 6.02987 2.5 5.41589 2.8272 5.05779C2.94337 4.93065 3.08456 4.82889 3.24191 4.75888C3.6851 4.56171 4.26757 4.75587 5.43251 5.14418C6.32189 5.44064 6.76657 5.58887 7.21592 5.57353C7.38095 5.56789 7.54501 5.54592 7.70571 5.50794C8.14326 5.40451 8.53327 5.1445 9.31331 4.62448L10.4653 3.85649C11.4645 3.19036 11.9641 2.8573 12.5376 2.7805C13.111 2.7037 13.6807 2.89357 14.8199 3.27332L15.7906 3.59687C16.6156 3.87188 17.0281 4.00938 17.2641 4.33674C17.5 4.6641 17.5 5.09893 17.5 5.96858V12.7422C17.5 13.9702 17.5 14.5841 17.1728 14.9422C17.0566 15.0694 16.9154 15.1711 16.7581 15.2411C16.3149 15.4383 15.7324 15.2442 14.5675 14.8558C13.6781 14.5594 13.2334 14.4112 12.7841 14.4265C12.6191 14.4321 12.455 14.4541 12.2943 14.4921C11.8567 14.5955 11.4667 14.8555 10.6867 15.3756L9.53471 16.1435C8.53552 16.8097 8.03593 17.1427 7.46244 17.2195C6.88895 17.2963 6.31932 17.1065 5.18007 16.7267L4.20943 16.4032C3.38441 16.1281 2.97189 15.9906 2.73595 15.6633C2.5 15.3359 2.5 14.9011 2.5 14.0314V7.25782Z'
                      stroke='#D1132A'
                      strokeWidth='1.5'
                    />
                    <path
                      d='M7.5 5.53223V17.0834'
                      stroke='#D1132A'
                      strokeWidth='1.5'
                    />
                    <path
                      d='M12.5 2.5V14.1667'
                      stroke='#D1132A'
                      strokeWidth='1.5'
                    />
                  </svg>
                </Button>
              )}
            </Form>
          </div>
          {modal2Open && (
            <FilterModal
              handleClickButtonSaveFilter={handleClickButtonSaveFilter}
              modal2Open={modal2Open}
              setModal2Open={setModal2Open}
              dataObject={dataObject}
              setDataObject={setDataObject}
              setIsReload={setIsReload}
              setMapDataObj={setMapDataObj}
              mapDataObj={mapDataObj}
              switchMap={switchMap}
              form={form}
              map={map}
              setIsReloadMap={setIsReloadMap}
              setSubmitForm={setSubmitForm}
              setObjLocation={setObjLocation}
              setResetForm={setResetForm}
              onChangeMapSearchParam={onChangeMapSearchParam}
              onChangeSearchParam={onChangeSearchParam}
              setCurrentPage={setCurrentPage}
            />
          )}
          <ModalLogin
            openModalLogin={openModal}
            setOpenModalLogin={setOpenModal}
            description={<IntlMessages id='common.notiLogin' />}
          />
          <ModalSaveFilter
            form={form}
            dataObject={dataObject}
            openModalSaveFilter={openModalSaveFilter}
            setOpenModalSaveFilter={setOpenModalSaveFilter}
          />
        </div>
      </div>
    </>
  );
};

export default HeaderSearch;
HeaderSearch.propTypes = {
  setIsReload: PropTypes.func,
  dataObject: PropTypes.any,
  setDataObject: PropTypes.func,
  setProvinces: PropTypes.func,
  setCurrentPage: PropTypes.func,
  onChangeSearchParam: PropTypes.func,
  switchMap: PropTypes.bool,
  onChangeMapSearchParam: PropTypes.func,
  form: PropTypes.any,
  setMapDataObj: PropTypes.func,
  mapDataObj: PropTypes.any,
  map: PropTypes.any,
  setIsReloadMap: PropTypes.func,
  provincesFilter: PropTypes.any,
  handleSwitchMap: PropTypes.func,
  handleDisplayView: PropTypes.func,

  setObjLocation: PropTypes.any,
  objLocation: PropTypes.any,
  openFullMap: PropTypes.bool,
};
