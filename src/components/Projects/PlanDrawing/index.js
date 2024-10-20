import React from 'react';
import {Col, Collapse, Row, Skeleton} from 'antd';
import PropTypes from 'prop-types';
import Slider from 'react-slick';
import IconArrow from 'assets/icon/arrow-down-black.png';
import AppCollapse from 'components/AppCollapse';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

const PlanDrawing = ({dataPost, loading, Fancybox, changeStyle}) => {
  const {Panel} = Collapse;
  const {messages} = useIntl();
  const settings = {
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
  };

  return (
    <>
      {dataPost?.planDrawing ? (
        <Row className='section-tab'>
          <Col span={24}>
            <div className={`ground-estate`} id='tab-planDrawing'>
              {loading ? (
                <Skeleton paragraph={{rows: 6}} loading={loading} active />
              ) : (
                <AppCollapse
                  title={
                    <h3 className='title-section'>
                      <IntlMessages id='common.floorPlan' />
                    </h3>
                  }
                  description={
                    <>
                      <Fancybox options={{dragToClose: false}}>
                        <div className='planDrawing'>
                          <Slider {...settings}>
                            {dataPost?.planDrawing?.map((item, index) => {
                              return (
                                <a
                                  data-fancybox='planDrawings'
                                  href={item}
                                  key={index}
                                >
                                  <img
                                    src={item}
                                    alt={
                                      messages['common.floorPlan'] +
                                      ' ' +
                                      (index + 1)
                                    }
                                  />
                                </a>
                              );
                            })}
                          </Slider>
                        </div>
                      </Fancybox>
                    </>
                  }
                />
              )}
            </div>
          </Col>
        </Row>
      ) : (
        ''
      )}
    </>
  );
};

export default PlanDrawing;
PlanDrawing.propTypes = {
  dataPost: PropTypes.any,
  loading: PropTypes.any,
  Fancybox: PropTypes.any,
  changeStyle: PropTypes.any,
};
