import Link from 'next/link';
import React from 'react';
import PropTypes from 'prop-types';
import {Col, Row} from 'antd';
import IntlMessages from '@crema/utility/IntlMessages';
import {URL, URL_NEW} from 'shared/constants/ConfigApp';

const News = ({newsData}) => {
  return (
    <div className='news mb-24'>
      <Row gutter={[0, 16]}>
        <Col xs={24}>
          <h4 className='title-section-2'>
            <IntlMessages id='home.news' />
          </h4>
        </Col>
        <Col xs={24}>
          <div className='tab-content'>
            {newsData?.map((item, index) => {
              return (
                <div
                  key={item?.postId}
                  className={`${
                    index === 0 || index === 1 ? 'item-top' : 'item-bottom'
                  } item item-${index}`}
                >
                  <Link
                    legacyBehavior
                    passHref
                    href={`${URL}/news/${item?.postName}`}
                  >
                    <a>
                      {(index === 0 || index === 1) && (
                        <div className='img'>
                          <img
                            className='w-100 border-radius'
                            src={item?.thumbnail}
                            alt={item?.postTitle}
                          />
                        </div>
                      )}

                      <div className='info info-big'>
                        {(index === 0 || index === 1) && (
                          <ul className='tag'>
                            <li>{item?.categories[0]?.name}</li>
                            <li>{item?.date}</li>
                          </ul>
                        )}

                        <h2
                          className='limit-text limit-text-2'
                          title={item?.postTitle}
                        >
                          {item?.postTitle}
                        </h2>
                        {(index === 0 || index === 1) && (
                          <p className='limit-text limit-text-2'>
                            {item?.postExcerpt}
                          </p>
                        )}
                      </div>
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </Col>
        <Col xs={24}>
          <div className='d-flex flex-column align-center'>
            <a
              href={`${URL}/news/category/hot-news`}
              className='btn btn-readmore'
              target='_blank'
              rel='noreferrer'
            >
              <IntlMessages id='common.readMore' />
            </a>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default News;
News.propTypes = {
  newsData: PropTypes.any,
};
