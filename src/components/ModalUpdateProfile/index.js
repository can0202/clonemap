import React from 'react';
import {Button, Modal} from 'antd';
import PropTypes from 'prop-types';

import {useSelector} from 'react-redux';
import {useRouter} from 'next/router';
import {URL_CMS_SERVER} from 'shared/constants/ConfigApp';

const ModalUpdateProfile = ({openModalProfile, setOpenModalProfile}) => {
  const router = useRouter();
  const {isAuthenticated} = useSelector(({auth}) => auth);
  return (
    <>
      <Modal
        title='Thông báo'
        className='modal-login modal-users text-center'
        centered
        width={400}
        open={openModalProfile}
        onOk={() => setOpenModalProfile(false)}
        onCancel={() => setOpenModalProfile(false)}
      >
        <div className='modal-login-body'>
          <div className='modal-login-head text-center'>
            <p>
              Vui lòng cập nhật thông tin tài khoản trước khi thực hiện chức
              năng này.
            </p>
          </div>
          <div className='modal-login-footer d-flex align-center justify-between'>
            <Button
              className='btn btn-cancel'
              onClick={() => setOpenModalProfile(false)}
            >
              Hủy
            </Button>
            <Button
              key='submit'
              className='btn btn-accept'
              href={URL_CMS_SERVER + '/user/information'}
              target='_blank'
              rel='noopener noreferrer'
            >
              Cập nhật ngay
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalUpdateProfile;
ModalUpdateProfile.propTypes = {
  openModalProfile: PropTypes.any,
  setOpenModalProfile: PropTypes.any,
};
