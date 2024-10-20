import React from 'react';
import {Breadcrumb, Skeleton} from 'antd';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';
import {typesReplaceMapping} from 'shared/constants/AppConst';

const Breadcrumbs = (props) => {
  const {dataPost, loading} = props;
  const {messages} = useIntl();
  const typeLink = typesReplaceMapping[dataPost?.postType?.code];

  return (
    <>
      {loading ? (
        <Skeleton
          paragraph={{
            rows: 1,
          }}
          loading={loading}
          block
          active
        />
      ) : (
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
          items={[
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
            dataPost?.postType?.name
              ? {
                  title: (
                    <a
                      href={`/${typeLink}`}
                      title={dataPost?.postType?.name}
                      target='_blank'
                      rel='noreferrer'
                    >
                      {dataPost?.postType?.name}
                    </a>
                  ),
                }
              : null,
            dataPost?.typeRealEstate?.name
              ? {
                  title: (
                    <a
                      href={`/${
                        dataPost?.typeRealEstate
                          ? dataPost?.typeRealEstate?.fields?.slug
                          : ''
                      }`}
                      title={dataPost?.typeRealEstate?.name}
                    >
                      {dataPost?.typeRealEstate?.name}
                    </a>
                  ),
                }
              : null,
            dataPost?.province?.name
              ? {
                  title: (
                    <a
                      href={`/${
                        dataPost?.typeRealEstate
                          ? dataPost?.typeRealEstate?.fields?.slug
                          : ''
                      }${
                        dataPost?.province
                          ? `-tai-${dataPost?.province?.slug}-t${dataPost?.province?.code}`
                          : ''
                      }`}
                      title={dataPost?.province?.name}
                    >
                      {dataPost?.province?.name}
                    </a>
                  ),
                }
              : null,
            dataPost?.district?.name
              ? {
                  title: (
                    <a
                      href={`/${
                        dataPost?.typeRealEstate
                          ? dataPost?.typeRealEstate?.fields?.slug
                          : ''
                      }${
                        dataPost?.district
                          ? `-tai-${dataPost?.district?.slug}-t${dataPost?.province?.code}`
                          : ''
                      }`}
                      title={dataPost?.district?.name}
                    >
                      {dataPost?.district?.name}
                    </a>
                  ),
                }
              : null,
            dataPost?.wards?.name
              ? {
                  title: dataPost?.wards?.name,
                }
              : null,
          ].filter(Boolean)}
        />
      )}
    </>
  );
};

export default Breadcrumbs;
Breadcrumbs.propTypes = {
  dataPost: PropTypes.any,
  loading: PropTypes.any,
};
