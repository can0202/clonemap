import {Button, Col, Row} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import expriedImg from 'assets/img/expried.png';
import publishImg from 'assets/img/publish.png';
import IntlMessages from '@crema/utility/IntlMessages';
import {useEffect} from 'react';
import {useState} from 'react';
import {typesReplaceMapping} from 'shared/constants/AppConst';

const PostExpried = ({dataPost}) => {
  const [link, setLink] = useState('');
  let typeSegment = '';
  let locationSegment = '';

  useEffect(() => {
    if (dataPost) {
      if (dataPost?.postType?.code) {
        typeSegment = typesReplaceMapping[dataPost?.postType?.code];
      }
      if (dataPost?.typeRealEstate?.code) {
        typeSegment = `${dataPost?.typeRealEstate?.fields?.slug}`;
      }
      if (dataPost?.wards?.code) {
        locationSegment = `tai-${dataPost?.wards?.slug}-t${dataPost?.province?.code}`;
      } else if (dataPost?.district?.code) {
        locationSegment = `tai-${dataPost?.district?.slug}-t${dataPost?.province?.code}`;
      } else if (dataPost?.province?.code) {
        locationSegment = `tai-${dataPost?.province?.slug}-t${dataPost?.province?.code}`;
      } else {
        locationSegment = '';
      }

      setLink(`${typeSegment}${locationSegment ? `-${locationSegment}` : ''}`);
    }
  }, [dataPost]);

  return (
    <>
      {dataPost?.status?.code === 'expired' ? (
        <div className='mt-24 noti_post'>
          <Row gutter={[8, 0]} align={'middle'} justify={'space-between'}>
            <Col xs={18}>
              <Row gutter={[0, 8]}>
                <Col xs={24}>
                  <h4>
                    <IntlMessages id='common.postingExpired' />
                  </h4>
                </Col>
                <Col xs={24}>
                  <p>
                    <IntlMessages id='common.postingExpiredSearch' />
                  </p>
                </Col>
                <Col xs={24}>
                  <Button
                    type='primary'
                    href={`/${link}`}
                    className='btn btn-search'
                  >
                    <span>
                      <IntlMessages id='common.search' />
                    </span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                    >
                      <path
                        d='M3.33398 10H16.6673M16.6673 10L11.6673 5M16.6673 10L11.6673 15'
                        stroke='#FEFEFE'
                        strokeWidth='1.5'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                      />
                    </svg>
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <img src={expriedImg.src} alt={dataPost?.status?.name} />
            </Col>
          </Row>
        </div>
      ) : (
        dataPost?.transactedStatus?.code === '1' && (
          <div className='mt-24 noti_post'>
            <Row gutter={[8, 0]} align={'middle'} justify={'space-between'}>
              <Col xs={18}>
                <Row gutter={[0, 8]}>
                  <Col xs={24}>
                    <h4>
                      <IntlMessages id='common.postingPublish' />
                    </h4>
                  </Col>
                  <Col xs={24}>
                    <p>
                      <IntlMessages id='common.postingExpiredSearch' />
                    </p>
                  </Col>
                  <Col xs={24}>
                    <Button
                      type='primary'
                      href={`/${link}`}
                      className='btn btn-search'
                    >
                      <span>
                        <IntlMessages id='common.search' />
                      </span>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='20'
                        height='20'
                        viewBox='0 0 20 20'
                        fill='none'
                      >
                        <path
                          d='M3.33398 10H16.6673M16.6673 10L11.6673 5M16.6673 10L11.6673 15'
                          stroke='#FEFEFE'
                          strokeWidth='1.5'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                    </Button>
                  </Col>
                </Row>
              </Col>
              <Col xs={6}>
                <img
                  src={publishImg.src}
                  alt={dataPost?.transactedStatus?.name}
                />
              </Col>
            </Row>
          </div>
        )
      )}
    </>
  );
};

export default PostExpried;
PostExpried.propTypes = {
  dataPost: PropTypes.any,
};
