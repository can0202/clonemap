import React, {useState, useEffect} from 'react';
import {Breadcrumb, Skeleton} from 'antd';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import {useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import HomeImage from 'assets/icon/home.png';
import IconRightImg from 'assets/icon/arrow_right.png';
import {
  typesReplaceMapping,
  typesShortReplaceMapping,
} from 'shared/constants/AppConst';
import {fetchDistricts} from 'pages/api/districts';
import {fetchWards} from 'pages/api/wards';

const Breadcrumbs = ({
  dataObject,
  isReload,
  total,
  mapDataObj,
  switchMap,
  isReloadMap,
  objLocation,
}) => {
  const {messages} = useIntl();
  const router = useRouter();
  const subTypeSlug = router?.query?.slugType?.split('&')[0];
  const {categories} = useSelector((state) => state.categories);
  const provinces = useSelector((state) => state.provinces);
  const categoryList = categories?.categories?.realEstateTypeCat || null;
  const currentSubType = categoryList?.find((subType) =>
    subTypeSlug
      ? subType?.metadata
      : subType?.code === subTypeSlug
      ? subTypeSlug
      : dataObject?.subTypes[0],
  );

  const items = [
    {
      title: (
        <a className='home' href='/' title={messages['common.home']}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
          >
            <g clipPath='url(#clip0_5455_615813)'>
              <path
                d='M1.66602 10.1703C1.66602 8.26323 1.66602 7.30972 2.09868 6.51928C2.53135 5.72883 3.3218 5.23825 4.90271 4.2571L6.56938 3.22272C8.2405 2.18557 9.07607 1.66699 9.99935 1.66699C10.9226 1.66699 11.7582 2.18557 13.4293 3.22272L15.096 4.2571C16.6769 5.23825 17.4673 5.72883 17.9 6.51928C18.3327 7.30972 18.3327 8.26323 18.3327 10.1703V11.4378C18.3327 14.6885 18.3327 16.3139 17.3564 17.3238C16.3801 18.3337 14.8087 18.3337 11.666 18.3337H8.33268C5.18999 18.3337 3.61864 18.3337 2.64233 17.3238C1.66602 16.3139 1.66602 14.6885 1.66602 11.4378V10.1703Z'
                stroke='#6C6868'
                strokeWidth='1.5'
              />
              <path
                d='M7.5 13.333C8.20865 13.8583 9.07047 14.1663 10 14.1663C10.9295 14.1663 11.7914 13.8583 12.5 13.333'
                stroke='#6C6868'
                strokeWidth='1.5'
                strokeLinecap='round'
              />
            </g>
            <defs>
              <clipPath id='clip0_5455_615813'>
                <rect width='20' height='20' fill='white' />
              </clipPath>
            </defs>
          </svg>
        </a>
      ),
    },
  ];
  const [itemArr, setItemArr] = useState([]);
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

  const getSubTypeTextOnly = (subTypes) => {
    const categoryList = categories?.categories?.realEstateTypeCat ?? [];
    const subTypeArray =
      typeof subTypes === 'string' ? subTypes?.split(',') : subTypes;
    let subTypeTextOnly = '';
    if (subTypeArray?.length > 0) {
      subTypeTextOnly = categoryList?.find(
        (item) => item?.code === subTypeArray[0],
      );
    }
    return subTypeTextOnly;
  };

  const getNewTexts = async (data, subTypeTextOnly) => {
    const {
      types,
      subTypes,
      wardCodes,
      districtCodes,
      provinceCodes,
      wardText,
      districtText,
    } = data;
    const typeText = Array.isArray(types)
      ? textResult(types[0])
      : textResult(types);
    const typeCode = Array.isArray(types) ? types[0] : types;
    const subTypeCode = Array.isArray(subTypes) ? subTypes[0] : subTypes;
    const wardCode = Array.isArray(wardCodes) ? wardCodes[0] : wardCodes;
    const districtCode = Array.isArray(districtCodes)
      ? districtCodes[0]
      : districtCodes;
    const provinceCode = Array.isArray(provinceCodes)
      ? provinceCodes[0]
      : provinceCodes;
    const provincesFilter = provinces?.provinces ?? [];
    const province = provincesFilter?.find(
      (item) => item?.code === provinceCode,
    );

    let wardObj, distictObj;
    if (provinceCode) {
      const districtFetch = await fetchDistricts(provinceCode);
      const dataDistricts = districtFetch?.data ?? [];
      if (districtCode) {
        distictObj = await dataDistricts?.find(
          (item) => item?.code === districtCode,
        );
        const wardFetch = await await fetchWards(provinceCode, districtCode);
        const dataWards = districtFetch?.data ?? [];
        if (wardCode) {
          wardObj = await dataWards?.find((item) => item?.code === wardCode);
        }
      }
    }

    const typeName = typesShortReplaceMapping[typeCode];
    const typeSlug = typesReplaceMapping[typeCode];

    if (typeCode) {
      items?.push({
        title: (
          <a href={`/${typeSlug}`} title={typeText}>
            {typeText}
          </a>
        ),
      });
    }
    if (subTypeCode) {
      items?.push({
        title: (
          <a href={`/${subTypeTextOnly?.fields?.slug}`}>
            {subTypeTextOnly?.fields?.menuName}
          </a>
        ),
      });
    }
    if (provinceCode) {
      const href = subTypeCode
        ? `/${subTypeTextOnly?.fields?.slug}-tai-${province?.slug}-t${province?.code}`
        : `/${typeSlug}-tai-${province?.slug}-t${province?.code}`;
      items?.push({
        title: <a href={href}>{province?.name}</a>,
      });
    }
    if (districtCode) {
      const href = subTypeCode
        ? `/${subTypeTextOnly?.fields?.slug}-tai-${distictObj?.slug}-t${province?.code}`
        : `/${typeSlug}-tai-${distictObj?.slug}-t${province?.code}`;
      items?.push({
        title: <a href={href}>{distictObj?.name}</a>,
      });
    }
    if (wardCode) {
      items?.push({title: wardText});
    }
    return items;
  };

  useEffect(async () => {
    if (!isReload) return;
    const subTypeTextOnly = getSubTypeTextOnly(dataObject?.subTypes);
    const newTexts = await getNewTexts(dataObject, subTypeTextOnly);
    setItemArr(newTexts);
  }, [isReload, dataObject]);

  useEffect(async () => {
    if (!isReloadMap) return;
    const subTypeTextOnly = getSubTypeTextOnly(mapDataObj?.subTypes[0]);
    const newTexts = await getNewTexts(mapDataObj, subTypeTextOnly);
    setItemArr(newTexts);
  }, [isReloadMap, mapDataObj]);

  return (
    <>
      <Breadcrumb
        className='beadcrum-search'
        separator={
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
          >
            <path
              d='M7.5 4.16699L12.5 10.0003L7.5 15.8337'
              stroke='#6C6868'
              strokeWidth='1.5'
              strokeLinecap='round'
              strokeLinejoin='round'
            />
          </svg>
        }
        items={itemArr}
      />
    </>
  );
};

export default Breadcrumbs;
Breadcrumbs.propTypes = {
  dataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  total: PropTypes.any,
  isReload: PropTypes.bool,
  switchMap: PropTypes.bool,
  isReloadMap: PropTypes.bool,
  objLocation: PropTypes.any,
};
