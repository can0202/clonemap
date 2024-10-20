import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {Col, Collapse, Row, Skeleton, Tooltip} from 'antd';
import AppCollapse from 'components/AppCollapse';
import IntlMessages from '@crema/utility/IntlMessages';

const Characteristic = (props) => {
  const {dataPost} = props;
  const [styleStatus, setStyleStatus] = useState('');
  // Get Status Style
  useEffect(() => {
    switch (dataPost?.reStatus?.code) {
      case '1':
        setStyleStatus('updating');
        break;
      case '2':
        setStyleStatus('open-sale');
        break;
      case '3':
        setStyleStatus('one-sale');
        break;
      case '4':
        setStyleStatus('handed-over');
        break;
      default:
        break;
    }
  }, []);

  return (
    <div className='section-tab characteristic' id='tab-character'>
      <AppCollapse
        title={
          <h3 className='title-section'>
            <IntlMessages id='common.detailedCharacteristics' />
          </h3>
        }
        description={
          <Row gutter={[16, 8]}>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.typeDetail' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.postType?.name ? (
                          dataPost?.postType?.name
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.postType?.name ? (
                        dataPost?.postType?.name
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.typeBdsDetail' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.typeRealEstate?.name ? (
                          dataPost?.typeRealEstate?.name
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.typeRealEstate?.name ? (
                        dataPost?.typeRealEstate?.name
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.project' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.project?.name ? (
                          dataPost?.project?.name
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.project?.name ? (
                        dataPost?.project?.name
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.acreage' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.areaText ? (
                          dataPost?.areaText
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.areaText ? (
                        dataPost?.areaText
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.juridical' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.legalDoc?.name ? (
                          dataPost?.legalDoc?.name
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.legalDoc?.name ? (
                        dataPost?.legalDoc?.name
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.direction' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.direction?.name ? (
                          dataPost?.direction?.name
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.direction?.name ? (
                        dataPost?.direction?.name
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.facade' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.frontWidth ? (
                          dataPost?.frontWidth + ' m'
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.frontWidth ? (
                        dataPost?.frontWidth + ' m'
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.largeRoad' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.entrance?.name ? (
                          dataPost?.entrance?.name
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.entrance?.name ? (
                        dataPost?.entrance?.name
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.numberFloors' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.floor ? (
                          dataPost?.floor
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.floor ? (
                        dataPost?.floor
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.numberBedrooms' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.bedroom ? (
                          dataPost?.bedroom
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.bedroom ? (
                        dataPost?.bedroom
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.numberBathrooms' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.bathroom ? (
                          dataPost?.bathroom
                        ) : (
                          <IntlMessages id='common.updating' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.bathroom ? (
                        dataPost?.bathroom
                      ) : (
                        <IntlMessages id='common.updating' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>
            <Col xs={24} md={12} className='item'>
              <Row align={'middle'} justify={'space-between'}>
                <Col xs={10}>
                  <IntlMessages id='common.interior' />
                </Col>
                <Col xs={14} style={{textAlign: 'right'}}>
                  <Tooltip
                    title={
                      <p className='content'>
                        {dataPost?.furniture ? (
                          <IntlMessages id='common.yes' />
                        ) : (
                          <IntlMessages id='common.no' />
                        )}
                      </p>
                    }
                  >
                    <p className='limit-text limit-text-1'>
                      {dataPost?.furniture ? (
                        <IntlMessages id='common.yes' />
                      ) : (
                        <IntlMessages id='common.no' />
                      )}
                    </p>
                  </Tooltip>
                </Col>
              </Row>
            </Col>

            {dataPost?.furniture && (
              <Col xs={24} className='interior_details'>
                <Row gutter={[0, 8]}>
                  <Col xs={24}>
                    <h3>
                      <IntlMessages id='common.interiorDetails' />
                    </h3>
                  </Col>
                  <Col xs={24}>
                    {dataPost?.furniture && (
                      <>
                        {dataPost?.furniture?.map((item, index) => (
                          <span key={index}>{item}</span>
                        ))}
                      </>
                    )}
                  </Col>
                </Row>
              </Col>
            )}
          </Row>
        }
      />
    </div>
  );
};

export default Characteristic;
Characteristic.propTypes = {
  dataPost: PropTypes.any,
};
