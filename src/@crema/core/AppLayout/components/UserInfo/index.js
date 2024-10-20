import React, {useState, useEffect} from 'react';
import {useAuthUser} from '../../../../utility/AuthHooks';
import Avatar from '@mui/material/Avatar';
import PropTypes from 'prop-types';
import {useRouter} from 'next/router';
import NoThumb from 'assets/img/EmptyAvatar.png';
import {useDispatch, useSelector} from 'react-redux';
import {onLogOut} from 'redux/actions';
import {
  URL_API,
  URL_CMS_SERVER,
  USER_ACCOUNT_SSO,
} from 'shared/constants/ConfigApp';
import {Button, Col, List, Row} from 'antd';
import {UserOutlined, PlusOutlined} from '@ant-design/icons';
import ModalLogout from '../ModalLogout';
import axios from 'axios';
import {useRef} from 'react';
import {deleteCookie} from 'cookies-next';
import IntlMessages from '@crema/utility/IntlMessages';
import {redirectToSSOFunc} from '@crema/utility/LoginRedirect';

const UserInfo = ({color}) => {
  const dispatch = useDispatch();
  const {isAuthenticated, profile, accessToken} = useSelector(({auth}) => auth);
  const [openModal, setOpenModal] = useState(false);
  const {user} = useAuthUser();
  const router = useRouter();
  const [isToggle, setIsToggle] = useState(true);

  const popupRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsToggle(true);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isToggle]);

  // Handle Toggle User info
  const handleToggle = () => {
    setIsToggle(!isToggle);
  };
  const handleLogout = async () => {
    const result = await axios.post(`${URL_API}/vid/api/auth/logout/all`, {
      sessionToken: accessToken,
    });
    if (result?.data?.code == 200) {
      dispatch(onLogOut());
      deleteCookie('varsTkWeb');
      router.push(window.location.href);
    }
  };

  return (
    <>
      <Row
        gutter={[5, 5]}
        style={{padding: '10px'}}
        className='row-button-head'
      >
        <Col ref={popupRef}>
          {!isAuthenticated ? (
            <Button
              icon={<UserOutlined />}
              type='text'
              size='large'
              onClick={redirectToSSOFunc}
            >
              <IntlMessages id={`common.login`} />
            </Button>
          ) : (
            <>
              <div className='menu-user-sso'>
                <Avatar
                  className=''
                  src={profile?.avatar ? profile?.avatar : NoThumb.src}
                  size={40}
                  onClick={handleToggle}
                />
                <div
                  className={`menu-user-sso-info ${isToggle ? '' : 'active'}`}
                >
                  <div className='profile-highlight d-flex'>
                    <Avatar
                      src={profile?.avatar ? profile?.avatar : NoThumb.src}
                      size={40}
                      onClick={(e) => e.preventDefault()}
                    />
                    <div className='details'>
                      <div
                        id='profile-name'
                        className='limit-text limit-text-1'
                      >
                        {profile?.fullName}
                      </div>
                      <div
                        id='profile-footer'
                        className='limit-text limit-text-1'
                      >
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
                          avatar={
                            <img src={item?.icon?.src} alt={item?.text} />
                          }
                          title={<a href={item?.url}>{item?.text}</a>}
                        />
                      </List.Item>
                    )}
                  />
                  <div
                    className='btn-logout user-logout'
                    onClick={handleLogout}
                  >
                    <p>
                      <IntlMessages id={`common.logout`} />
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </Col>
        <Col>
          <Button
            className='btn-post btn-main'
            type='text'
            icon={<PlusOutlined />}
            size='large'
            href={`${URL_CMS_SERVER}/post/management?sb=true`}
          >
            <IntlMessages id={`common.postNews`} />
          </Button>
        </Col>
      </Row>
      <ModalLogout openModal={openModal} setOpenModal={setOpenModal} />
    </>
  );
};

export default UserInfo;

UserInfo.defaultProps = {
  color: 'text.secondary',
};

UserInfo.propTypes = {
  color: PropTypes.string,
};
