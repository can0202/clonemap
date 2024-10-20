import React from 'react';
import PropTypes from 'prop-types';
import {Col, Row, Tooltip} from 'antd';

const TooltipVarsMember = ({enable, titleVas, image, description}) => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        height: '20px',
      }}
    >
      {titleVas}
      <img src={image} alt={titleVas} style={{height: '20px', width: '20px'}} />
      {enable && (
        <Tooltip
          placement='bottomLeft'
          title={
            <Row gutter={[0, 8]} className='notiVars content'>
              <Col xs={24}>
                <h3>{titleVas}</h3>
              </Col>
              <Col xs={24}>
                <p>{description}</p>
              </Col>
            </Row>
          }
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
          >
            <circle cx='9.99935' cy='10.0003' r='8.33333' stroke='#181414' />
            <path
              d='M10 14.167V9.16699'
              stroke='#181414'
              strokeLinecap='round'
            />
            <ellipse
              cx='0.833333'
              cy='0.833333'
              rx='0.833333'
              ry='0.833333'
              transform='matrix(1 0 0 -1 9.16602 7.5)'
              fill='#181414'
            />
          </svg>
        </Tooltip>
      )}
    </div>
  );
};

export default TooltipVarsMember;
TooltipVarsMember.propTypes = {
  enable: PropTypes.bool,
  titleVas: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  image: PropTypes.any,
  description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};
