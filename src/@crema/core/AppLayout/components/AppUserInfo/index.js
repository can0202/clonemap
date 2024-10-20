import {Avatar, Col, Dropdown, List, Row} from 'antd';
import React from 'react';
import {useSelector} from 'react-redux';
import {URL_CMS_SERVER} from 'shared/constants/ConfigApp';
import PropTypes from 'prop-types';
import NoThumb from 'assets/img/EmptyAvatar.png';
import iconUser from 'assets/user/user.png';
import iconUserEdit from 'assets/user/user-edit.png';
import iconLogout from 'assets/user/lock.png';
import IntlMessages from '@crema/utility/IntlMessages';
import ModalLogout from '../ModalLogout';
import {useState} from 'react';
import {useIntl} from 'react-intl';

const AppUserInfo = ({handleToggleUser, isUserActive}) => {
  const {profile} = useSelector(({auth}) => auth);
  const [openModal, setOpenModal] = useState(false);
  const {messages} = useIntl();

  const USER_ACCOUNT_SSO = [
    {
      id: 'vmenu-my-account',
      icon: iconUser,
      text: messages['common.accountInfo'],
      url: `${URL_CMS_SERVER}/user/information`,
    },
    {
      id: 'vmenu-my-profile',
      icon: iconUserEdit,
      text: messages['common.representative'],
      url: `${URL_CMS_SERVER}/profiles?code=${profile?.identifyCode}&object=agent`,
    },
    {
      id: 'vmenu-change-password',
      icon: iconLogout,
      text: messages['common.changePassword'],
      url: `${URL_CMS_SERVER}/user/password`,
    },
  ];
  return (
    <>
      <div className='menu-user-sso'>
        <Avatar
          className=''
          src={profile?.avatar ? profile?.avatar : NoThumb.src}
          size={36}
          onClick={handleToggleUser}
          alt={profile?.fullName}
        />
        <div className={`menu-user-sso-info ${isUserActive ? '' : 'active'}`}>
          <div className='profile-highlight d-flex'>
            <Avatar
              style={{flex: 'none'}}
              src={profile?.avatar ? profile?.avatar : NoThumb.src}
              size={40}
              onClick={(e) => e.preventDefault()}
              alt={profile?.fullName}
            />
            <div className='details'>
              <div id='profile-name' className='limit-text limit-text-1'>
                {profile?.fullName}
              </div>
              <div id='profile-footer' className='limit-text limit-text-1'>
                {profile?.email}
              </div>
            </div>
          </div>
          <List
            className='list-info-user'
            itemLayout='horizontal'
            dataSource={USER_ACCOUNT_SSO}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  avatar={<img src={item?.icon?.src} alt={item?.text} />}
                  title={
                    <a href={item?.url} target='_blank' rel='noreferrer'>
                      {item?.text}
                    </a>
                  }
                />
              </List.Item>
            )}
          />
          <div
            className='btn-logout user-logout'
            onClick={() => setOpenModal(true)}
          >
            <p>
              <IntlMessages id={`common.logout`} />
            </p>
          </div>
        </div>
      </div>

      <ModalLogout openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};

export default AppUserInfo;
AppUserInfo.propTypes = {
  handleToggleUser: PropTypes.func,
  isUserActive: PropTypes.bool,
};
