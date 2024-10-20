import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Row, Skeleton} from 'antd';
import BedIcon from 'assets/icon/Bed.png';
import PointIcon from 'assets/icon/focus-point.png';
import BathtubIcon from 'assets/icon/Bathtub.png';
import MapIcon from 'assets/icon/MapPin.png';
import imgCart from 'assets/img/Image.png';

const CartItem = () => {
  return (
    <div className='item'>
      <div className='img-thumbnail'>
        <img src={imgCart.src} alt='' />
      </div>
      <div className='text'>
        <Row gutter={[0, 4]}>
          <Col xs={24}>
            <h3 className='title-item'>
              Newly built boutique hotel in Oku-Kagurazaka
            </h3>
          </Col>
          <Col xs={24}>
            <ul className='options'>
              <li>
                <img src={BedIcon.src} alt='' />
                <span>3</span>
              </li>
              <li>
                <img src={BathtubIcon.src} alt='' />
                <span>4</span>
              </li>
              <li>
                <img src={PointIcon.src} alt='' />
                <span>
                  4,049 <span className='unit'>sqft</span>
                </span>
              </li>
            </ul>
          </Col>
          <Col xs={24}>
            <p className='percent'>
              Gross Yeild <label>5.8%</label>
            </p>
          </Col>
          <Col xs={24}>
            <Row
              gutter={[16, 0]}
              className='address'
              align='middle'
              justify='space-between'
            >
              <Col xs={50}>
                <img src={MapIcon.src} alt='' /> <span>Tokyo, Japan</span>
              </Col>
              <Col xs={50}>
                <span className='price'>$42,779</span>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default CartItem;
CartItem.propTypes = {};
