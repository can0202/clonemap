import {Button, Col, Modal, Row} from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import {URL_API} from 'shared/constants/ConfigApp';
import {useRouter} from 'next/router';
import axios from 'axios';
import {useDispatch, useSelector} from 'react-redux';
import {onLogOut} from 'redux/actions/Auth';
import {deleteCookie} from 'cookies-next';
import IntlMessages from '@crema/utility/IntlMessages';

const ModalLogout = ({openModal, setOpenModal}) => {
  const {accessToken} = useSelector(({auth}) => auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogOut = async () => {
    setOpenModal(false);
    const result = await axios.post(`${URL_API}/vid/api/auth/logout/all`, {
      sessionToken: accessToken,
    });
    if (result?.data?.code == 200) {
      dispatch(onLogOut());
      deleteCookie('varsTkWeb');
      window.location.replace(router?.asPath);
    }
  };
  return (
    <Modal
      title={<IntlMessages id='common.notification' />}
      className='modal-logout modal-users'
      centered
      width={350}
      open={openModal}
      onOk={() => setOpenModal(false)}
      onCancel={() => setOpenModal(false)}
      footer={
        <Row gutter={[8, 0]}>
          <Col xs={12}>
            <Button
              className='btn btn-cancel'
              onClick={() => setOpenModal(false)}
              style={{width: '100%'}}
            >
              <IntlMessages id='common.later' />
            </Button>
          </Col>
          <Col xs={12}>
            <Button
              key='submit'
              className='btn btn-accept'
              onClick={handleLogOut}
              style={{width: '100%'}}
            >
              <IntlMessages id={`common.yes`} />
            </Button>
          </Col>
        </Row>
      }
    >
      <div className='modal-logout-body'>
        <div className='title text-center mb-16'>
          <p>
            <IntlMessages id={`common.notiLogout`} />
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ModalLogout;
ModalLogout.propTypes = {
  openModal: PropTypes.any,
  setOpenModal: PropTypes.any,
};
