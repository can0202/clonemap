import {Col, Row} from 'antd';
import React from 'react';
import loginImg from 'assets/img/note-login.png';
import PropTypes from 'prop-types';

const Login = ({description}) => {
  return (
    <Row style={{textAlign: 'center'}}>
      <Col xs={24}>
        <img src={loginImg.src} alt='' />
        <p>{description}</p>
      </Col>
    </Row>
  );
};

export default Login;
Login.propTypes = {
  description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};
