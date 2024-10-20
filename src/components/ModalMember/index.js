import React from 'react';
import {Button, Col, Modal, Row} from 'antd';
import PropTypes from 'prop-types';

import {URL_CMS_SERVER} from 'shared/constants/ConfigApp';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

const ModalMember = ({openProfile, setOpenProfile, profile}) => {
  const {messages} = useIntl();
  return (
    <>
      <Modal
        title={<IntlMessages id='common.notification' />}
        className='modal-login modal-users text-center'
        centered
        width={480}
        open={openProfile}
        onOk={() => setOpenProfile(false)}
        onCancel={() => setOpenProfile(false)}
        footer={
          <Row gutter={[8, 0]}>
            <Col xs={12}>
              <Button
                type='default'
                className='btn btn-cancel'
                onClick={() => setOpenProfile(false)}
                style={{width: '100%'}}
              >
                <IntlMessages id='common.later' />
              </Button>
            </Col>
            <Col xs={12}>
              <Button
                key='submit'
                type='primary'
                className='btn btn-accept'
                href={
                  profile?.enrollInfo?.step === -1 ||
                  profile?.enrollInfo?.step === 0 ||
                  profile?.enrollInfo?.step === 1
                    ? URL_CMS_SERVER + '/user-member/member'
                    : URL_CMS_SERVER + '/user-member/certificate'
                }
                target='_blank'
                rel='noopener noreferrer'
              >
                {profile?.enrollInfo?.step === -1 ||
                profile?.enrollInfo?.step === 0 ||
                profile?.enrollInfo?.step === 1
                  ? messages['common.enrollVARSMembership']
                  : messages['common.updateCertificate']}
              </Button>
            </Col>
          </Row>
        }
      >
        <div className='modal-login-body'>
          <div className='modal-login-head text-center'>
            <p>
              <IntlMessages id='common.notiRatingEnterprise' />
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalMember;
ModalMember.propTypes = {
  openProfile: PropTypes.any,
  setOpenProfile: PropTypes.any,
  profile: PropTypes.any,
};
