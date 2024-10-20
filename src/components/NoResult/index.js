import {Col, Row} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const NoResult = ({image, title, description, isFullheight = false}) => {
  return (
    <div
      className={clsx({
        not_found: true,
        isFullheight: isFullheight,
      })}
    >
      <Row gutter={[0, 16]}>
        <Col xs={24}>
          <img src={image} alt={title} />
        </Col>
        <Col xs={24}>
          <h4>{title}</h4>
        </Col>
        {description && (
          <Col xs={24}>
            <p>{description}</p>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default NoResult;
NoResult.propTypes = {
  image: PropTypes.any,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.any]),
  description: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.any,
  ]),
  isFullheight: PropTypes.bool,
};
