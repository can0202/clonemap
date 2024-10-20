import Head from 'next/head';
import React from 'react';
import Logo from 'assets/img/logo_app.png';
import PropTypes from 'prop-types';

const SiteMapComponent = ({url, sitemapConfig}) => {
  return (
    <>
      <Head>
        <title>Sơ đồ website</title>
        <link rel='canonical' href={url} />
        <meta name='generator' content='VARS CONNECT' />
        <meta name='robots' content='index, follow' />
        <meta
          name='keywords'
          content='vars land, bất động sản, mua bán bất động sản, cho thuê bất động sản, mua bán nhà đất, m&a'
        />
        <meta
          name='description'
          content='Vars Land - Chuyên trang mua bán nhà đất, nền tảng đăng tin bất động sản mua bán, cho thuê nhà đất, dự án, căn hộ chung cư, văn phòng, M&A nhà đất uy tín hàng đầu Việt Nam.'
        />
        <meta property='og:url' content={url} />
        <meta property='og:type' content='website' />
        <meta
          property='og:title'
          content='VARs Land - Website số 1 về bất động sản - Mua bán, cho thuê, M&A nhà đất toàn quốc'
        />
        <meta
          property='og:description'
          content='Vars Land - Chuyên trang mua bán nhà đất, nền tảng đăng tin bất động sản mua bán, cho thuê nhà đất, dự án, căn hộ chung cư, văn phòng, M&A nhà đất uy tín hàng đầu Việt Nam.'
        />
        <meta property='og:image' itemProp='thumbnailUrl' content={Logo.src} />
        <meta
          property='og:image:alt'
          content='VARs Land - Website số 1 về bất động sản - Mua bán, cho thuê, M&A nhà đất toàn quốc'
        />
        <meta property='og:image:width' content='800' />
        <meta property='og:image:height' content='400' />
      </Head>
      <div className='site-map'>
        <div className='container'>
          {sitemapConfig?.map((group, groupIndex) => {
            let groupClass = '';
            switch (groupIndex) {
              case 0:
                groupClass = 'section-1 section-grid-1';
                break;
              case 1:
                groupClass = 'section-2 section-grid-3';
                break;
              case 2:
                groupClass = 'section-3 section-grid-4';
                break;
              case 3:
                groupClass = 'section-4 section-grid-2';
                break;
              default:
                groupClass = '';
            }

            return (
              <section
                className={`section-grid ${groupClass}`}
                key={groupIndex}
              >
                {group?.map((item, index) => (
                  <ul className='top-level' key={index}>
                    <li>
                      <a href={item?.url}>{item?.label}</a>
                      {item?.children?.length > 0 && (
                        <ul className='sub'>
                          {item?.children?.map((child, childIndex) => (
                            <li key={childIndex}>
                              <a href={child?.url}>{child?.label}</a>
                              {child?.children?.length > 0 && (
                                <ul className='sub'>
                                  {child?.children?.map(
                                    (child2, childIndex2) => (
                                      <li key={childIndex2}>
                                        <a href={child2?.url}>
                                          {child2?.label}
                                        </a>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                  </ul>
                ))}
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SiteMapComponent;
SiteMapComponent.propTypes = {
  url: PropTypes.any,
  sitemapConfig: PropTypes.any,
};
