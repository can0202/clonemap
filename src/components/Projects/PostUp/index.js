import React from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Row} from 'antd';
import IntlMessages from '@crema/utility/IntlMessages';
import {typesReplaceMapping} from 'shared/constants/AppConst';

const PostUp = (props) => {
  const {dataPost, loading} = props;
  const typeSlug = typesReplaceMapping[dataPost?.type];

  return (
    <>
      <div className='sidebar-contact'>
        <Row gutter={[0, 16]}>
          <Col xs={24}>
            <h2>
              <IntlMessages id='common.postingsProject' />
            </h2>
          </Col>
          <Col xs={24}>
            <Row gutter={[0, 12]}>
              {dataPost.statistics?.sale?.fields?.totalPost > 0 && (
                <Col xs={24}>
                  <Button
                    type='default'
                    href={`/${
                      typesReplaceMapping[dataPost.statistics?.sale?.code]
                    }/?projects=${dataPost.id}`}
                    target='_blank'
                  >
                    {dataPost.statistics?.sale?.fields?.totalPost ? (
                      <span>
                        <span style={{marginRight: '8px'}}>
                          {dataPost.statistics?.sale?.fields?.totalPost}
                        </span>
                        <IntlMessages id='common.tradingNews' />
                      </span>
                    ) : (
                      <IntlMessages id='common.tradingNewsNotFound' />
                    )}
                  </Button>
                </Col>
              )}

              {dataPost.statistics?.rent?.fields?.totalPost > 0 && (
                <Col xs={24}>
                  <Button
                    type='default'
                    href={`/${
                      typesReplaceMapping[dataPost.statistics?.rent?.code]
                    }/?projects=${dataPost.id}`}
                    target='_blank'
                  >
                    {dataPost.statistics?.rent?.fields?.totalPost ? (
                      <span>
                        <span style={{marginRight: '8px'}}>
                          {dataPost.statistics?.rent?.fields?.totalPost}
                        </span>
                        <IntlMessages id='common.rentalnews' />
                      </span>
                    ) : (
                      <IntlMessages id='common.rentalnewsNotFound' />
                    )}
                  </Button>
                </Col>
              )}
            </Row>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default PostUp;
PostUp.propTypes = {
  dataPost: PropTypes.any,
  loading: PropTypes.any,
};
