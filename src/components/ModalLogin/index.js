import React from 'react';
import {Button, Col, Modal, Row} from 'antd';
import loginImg from '../../assets/img/note-login.png';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';
import {redirectToSSOFunc} from '@crema/utility/LoginRedirect';
import {useIntl} from 'react-intl';

const ModalLogin = ({openModalLogin, setOpenModalLogin, description}) => {
  const {messages} = useIntl();
  return (
    <>
      <Modal
        title={<IntlMessages id='common.notification' />}
        className='app_modal text-center'
        centered
        width={500}
        open={openModalLogin}
        onOk={() => setOpenModalLogin(false)}
        onCancel={() => setOpenModalLogin(false)}
        footer={
          <Row gutter={[8, 0]} justify={'end'}>
            <Col flex={'none'}>
              <Button
                type='default'
                className='btn btn-cancel'
                onClick={() => setOpenModalLogin(false)}
              >
                <IntlMessages id='common.later' />
              </Button>
            </Col>
            <Col flex={'none'}>
              <Button
                type='primary'
                className='btn btn-accept'
                onClick={redirectToSSOFunc}
              >
                <IntlMessages id='common.login' />
              </Button>
            </Col>
          </Row>
        }
      >
        <div className='modal-login-body'>
          <Row style={{textAlign: 'center'}}>
            <Col xs={24}>
              <img src={loginImg.src} alt={messages['common.login']} />
              <p>{description}</p>
            </Col>
          </Row>
        </div>
      </Modal>
    </>
  );
};

export default ModalLogin;
ModalLogin.propTypes = {
  openModalLogin: PropTypes.any,
  setOpenModalLogin: PropTypes.any,
  description: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
};
