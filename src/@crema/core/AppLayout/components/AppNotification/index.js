import {Button, Col, Drawer, List, Row, Skeleton, Spin, Tabs, Tag} from 'antd';
import React, {useState, useEffect} from 'react';
import {
  onApproveInvite,
  onDeletedAllNotifications,
  onDeletedIdNotifications,
  onGetInviteEmployees,
  onGetNotificationGroup,
  onGetNotifications,
  onGetPostDetailById,
  onReadAllNotifications,
  onReadIdNotifications,
} from 'pages/api/vland';
import {useDispatch, useSelector} from 'react-redux';
import {SHOW_MESSAGE} from 'shared/constants/ActionTypes';
import IntlMessages from '@crema/utility/IntlMessages';
import InfiniteScroll from 'react-infinite-scroll-component';
import NoResult from 'components/NoResult';
import emtyImage from 'assets/img/empty_notifi.png';
import {URL, URL_CMS_SERVER} from 'shared/constants/ConfigApp';
import AppModal from 'components/AppModal';

const AppNotification = () => {
  const {TabPane} = Tabs;
  const dispatch = useDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [isReload, setIsReload] = useState(true);
  const [isReloadGroup, setIsReloadGroup] = useState(true);
  const [dataNotiGroup, setDataNotiGroup] = useState([]);
  const [dataNotification, setDataNotification] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState(0);
  const [params, setParams] = useState({
    page: currentPage,
    pageSize: 10,
    group: '0',
  });
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [isLoadData, setIsLoadData] = useState(true);
  const {accessToken} = useSelector(({auth}) => auth);
  const [dataById, setDataById] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState({
    title: '',
    className: '',
    description: '',
    submitText: '',
    closeText: '',
    handleClose: () => {},
    handleSubmit: () => {},
    width: 'auto',
    onClosable: () => {},
    isFullScreen: false,
  });

  const typeInt = dataById?.data?.type || '';

  useEffect(() => {
    if (dataById) {
      switch (typeInt) {
        case '1':
          //Thong bao phe duyet/tu choi dang ky hoi vien
          window.open(
            URL_CMS_SERVER + `/user-member/member`,
            '_blank',
            'noreferrer',
          );
          break;
        case '2':
          //Thong bao phe duyet/tu choi dang ky doanh nghiep
          window.open(
            URL_CMS_SERVER + `/enterprise/information`,
            '_blank',
            'noreferrer',
          );
          break;
        case '3':
          // Lịch sử giao dịch
          const objectType = dataById?.data?.objectType;
          if (objectType === '1') {
            window.open(
              URL_CMS_SERVER +
                `/transaction/history?tk=${dataById?.data?.detailId}`,
              '_blank',
              'noreferrer',
            );
          } else {
            window.open(
              URL_CMS_SERVER +
                `/transaction/promo-wallet?tk=${dataById?.data?.detailId}`,
              '_blank',
              'noreferrer',
            );
          }

          break;
        case '4':
          // Chi tiết lời mời
          const fetchApiInvite = async () => {
            const result = await onGetInviteEmployees();
            if (result?.length > 0) {
              window.open(
                URL_CMS_SERVER + `/enterprise/invite`,
                '_blank',
                'noreferrer',
              );
            } else {
              setModalData({
                title: <IntlMessages id='common.notification' />,
                description: dataById?.content,
                submitText: <IntlMessages id='common.close' />,
                handleSubmit: () => {
                  setOpenModal(false);
                },
              });
              setOpenModal(true);
            }
          };
          fetchApiInvite();
          break;
        case '5':
          //Nhan vien chap nhan loi moi doanh nghiep
          window.open(
            URL_CMS_SERVER + `/enterprise/management`,
            '_blank',
            'noreferrer',
          );
          break;
        case '6':
          //Phe duyet/tu choi chung chi
          window.open(
            URL_CMS_SERVER + `/user-member/certificate`,
            '_blank',
            'noreferrer',
          );
          break;
        case '7':
          // detail post
          const fetchApi = async () => {
            const postDetail = await onGetPostDetailById(
              dataById?.data?.detailId,
            );
            if (postDetail?.data) {
              setModalData({
                title: <IntlMessages id='common.notification' />,
                description: dataById?.content,
                submitText: <IntlMessages id='common.viewListing' />,
                closeText: <IntlMessages id='common.close' />,
                handleClose: () => {
                  setOpenModal(false);
                },
                handleSubmit: () => {
                  window.open(
                    postDetail?.data?.detailUrlForSeo,
                    '_blank',
                    'noreferrer',
                  );
                },
              });
              setOpenModal(true);
            }
          };
          fetchApi();
          break;
        case '8':
          // Chi tiết mạng xã hội
          setModalData({
            title: <IntlMessages id='common.notification' />,
            description: dataById?.content,
            submitText: <IntlMessages id='common.close' />,
            handleSubmit: () => {
              setOpenModal(false);
            },
          });
          setOpenModal(true);
          break;
        case '9':
          // Bình luận
          setModalData({
            title: <IntlMessages id='common.notification' />,
            description: dataById?.content,
            submitText: <IntlMessages id='common.close' />,
            handleSubmit: () => {
              setOpenModal(false);
            },
          });
          setOpenModal(true);
          break;
        case '10':
          setModalData({
            title: <IntlMessages id='common.notification' />,
            description: dataById?.content,
            submitText: <IntlMessages id='common.close' />,
            handleSubmit: () => {
              setOpenModal(false);
            },
          });
          setOpenModal(true);
          break;
        case '11':
          // Chi tiết media
          setModalData({
            title: <IntlMessages id='common.notification' />,
            description: dataById?.content,
            submitText: <IntlMessages id='common.close' />,
            handleSubmit: () => {
              setOpenModal(false);
            },
          });
          setOpenModal(true);
          break;
        case '12':
          // Refer Friend
          window.open(
            URL_CMS_SERVER + `/invite-friends`,
            '_blank',
            'noreferrer',
          );
          break;
        case '13':
          // Profile Individual
          window.open(
            URL_CMS_SERVER + `/user/information`,
            '_blank',
            'noreferrer',
          );
          break;
        case '14':
          setModalData({
            title: <IntlMessages id='common.notification' />,
            description: dataById?.content,
            submitText: <IntlMessages id='common.close' />,
            handleSubmit: () => {
              setOpenModal(false);
            },
          });
          setOpenModal(true);
          break;
        case '15':
          // Representative
          setModalData({
            title: <IntlMessages id='common.notification' />,
            description: dataById?.content,
            submitText: <IntlMessages id='common.close' />,
            handleSubmit: () => {
              setOpenModal(false);
            },
          });
          setOpenModal(true);
          break;
        case '16':
          // Post Search
          window.open(
            URL + `?filterSavedId=${dataById?.data?.detailId}&isEdit=false`,
            '_blank',
            'noreferrer',
          );
          break;
        case '17':
          // Post Search
          window.open(
            URL_CMS_SERVER + `/enterprise/management`,
            '_blank',
            'noreferrer',
          );
          break;
        case '18':
          // Affiliate
          window.open(
            URL_CMS_SERVER + `/invite-friends`,
            '_blank',
            'noreferrer',
          );
          break;
        case '19':
          window.open(dataById?.data?.url, '_blank', 'noreferrer');
          break;
        case '20':
          // Follow
          break;
        case '21':
          break;
        case '22':
          // Detail Market Research
          break;
        case '24':
          // Chấp nhận / từ chối
          setModalData({
            title: <IntlMessages id='common.notification' />,
            description: dataById?.content,
            submitText: <IntlMessages id='common.accept' />,
            closeText: <IntlMessages id='common.reject' />,
            handleClose: async () => {
              const id = dataById?.data?.detailId ?? '';
              const status = 3;
              await onApproveInvite({id, status});
              setOpenModal(false);
            },
            handleSubmit: async () => {
              const id = dataById?.data?.detailId ?? '';
              const status = 1;
              await onApproveInvite({id, status});
              setOpenModal(false);
            },
          });
          setOpenModal(true);
          break;
        case '27':
        // eKYC
        default:
          break;
      }
    }
  }, [dataById]);

  const fetchNotificationGroup = async () => {
    const res = await onGetNotificationGroup(accessToken);
    setDataNotiGroup(res?.data);
    setIsReloadGroup(false);
  };

  useEffect(() => {
    if (isReloadGroup) {
      fetchNotificationGroup();
    }
  }, [isReloadGroup]);

  const fetchNotification = async () => {
    const res = await onGetNotifications(params, accessToken);
    setTotalPage(Math.ceil(res?.data?.total / res?.data?.pageSize));
    setCurrentPage(res?.data?.currentPage);
    setDataNotification(res?.data?.elements);
    setIsReload(false);
    setIsLoadData(false);
  };

  useEffect(() => {
    if (isReload || isLoadData) {
      fetchNotification();
    }
  }, [isReload, isLoadData]);

  const onChange = (key) => {
    setParams({
      ...params,
      group: key,
      page: 1,
    });
    setCurrentPage(1);
    setDataNotification([]);
    setIsReload(true);
    setIsLoadData(true);
  };

  const loadMoreData = async () => {
    if (currentPage >= totalPage || isLoadMore) return;
    setIsLoadMore(true);
    const nextPage = currentPage + 1;
    const payload = {
      ...params,
      page: nextPage,
    };
    const res = await onGetNotifications(payload, accessToken);
    const newData = res?.data?.elements || [];
    setDataNotification((prev) => [...prev, ...newData]);
    setTotalPage(Math.ceil(res?.data?.total / res?.data?.pageSize));
    setCurrentPage(res?.data?.currentPage);
    setIsLoadMore(false);
  };

  const renderTotalUnread = () => {
    const number = dataNotiGroup && dataNotiGroup[0]?.totalUnread;
    if (number > 99) {
      return '99+';
    } else if (number > 0) {
      return number;
    } else {
      return null;
    }
  };

  const handleShowNoti = () => {
    setIsOpen(true);
    setIsReload(true);
    setIsReloadGroup(true);
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const handleDeleteIdNoti = async (id) => {
    const res = await onDeletedIdNotifications(id, accessToken);
    if (res?.code === 200) {
      const newData = dataNotification?.filter((item) => item?.id !== id);
      setDataNotification(newData);
      dispatch({
        type: SHOW_MESSAGE,
        payload: {
          type: 'success',
          description: res?.message,
        },
      });
    } else {
      dispatch({
        type: SHOW_MESSAGE,
        payload: {
          type: 'error',
          description: res?.message,
        },
      });
    }
    setIsReloadGroup(true);
  };
  const handleDeleteAll = async () => {
    const res = await onDeletedAllNotifications(accessToken);
    if (res?.code === 200) {
      dispatch({
        type: SHOW_MESSAGE,
        payload: {
          type: 'success',
          description: res?.message,
        },
      });
    } else {
      dispatch({
        type: SHOW_MESSAGE,
        payload: {
          type: 'error',
          description: res?.message,
        },
      });
    }
    setIsReload(true);
    setIsReloadGroup(true);
  };

  const handleReadAll = async () => {
    await onReadAllNotifications(accessToken);
    setIsReload(true);
    setIsReloadGroup(true);
  };

  const handleReadById = async (info) => {
    const res = await onReadIdNotifications(info?.id, accessToken);
    if (res?.code === 200) {
      const newData = dataNotification?.map((item) => {
        if (item.id === info?.id) {
          // Extract URLs from metadata
          const [unreadUrl, readUrl] = item?.group?.metadata?.split('|');
          return {
            ...item,
            isRead: true,
            group: {
              ...item.group,
              iconUrl: readUrl, // Use the read URL from metadata
            },
          };
        }
        return item;
      });
      setDataNotification(newData);
    }
    setDataById(info);
    setIsReloadGroup(true);
  };

  return (
    <>
      <Drawer
        title={
          <Row
            gutter={[8, 0]}
            align={'middle'}
            justify={'space-between'}
            className='notification_title'
          >
            <Col>
              <h3>
                <IntlMessages id='common.notification' />
              </h3>
            </Col>
          </Row>
        }
        onClose={onClose}
        open={isOpen}
        footer={
          <Row gutter={[8, 0]} align={'middle'} justify={'space-between'}>
            <Col>
              <Button
                type='text'
                className='btn-delete'
                onClick={handleDeleteAll}
              >
                <IntlMessages id='common.deleteAll' />
              </Button>
            </Col>
            <Col>
              <Button
                type='default'
                className='mark_read'
                onClick={handleReadAll}
                style={{display: 'flex', alignItems: 'center', gap: '8px'}}
              >
                <IntlMessages id='common.markRead' />
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='20'
                  height='20'
                  viewBox='0 0 20 20'
                  fill='none'
                >
                  <path
                    d='M3.33203 10.75L5.95108 13.75L12.4987 6.25'
                    stroke='#D1132A'
                    stroke-Width='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                  <path
                    d='M16.668 6.30176L9.5249 13.8018L9.16797 13.333'
                    stroke='#D1132A'
                    stroke-Width='1.5'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </Button>
            </Col>
          </Row>
        }
      >
        <div className='notification_content var-section-tab'>
          <Tabs defaultActiveKey={['1']} onChange={onChange}>
            {dataNotiGroup?.map((item, index) => {
              return (
                <TabPane
                  className='nav-tab'
                  tab={
                    <p>
                      {item?.group?.name}{' '}
                      {item?.totalUnread > 0 && <Tag>{item?.totalUnread}</Tag>}
                    </p>
                  }
                  tabKey={item?.group?.code}
                  key={item?.group?.code}
                >
                  {isReload ? (
                    <div
                      style={{
                        display: 'flex',
                        height: 'calc(100vh - 194px)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Spin />
                    </div>
                  ) : (
                    <div className='tab-content-notification'>
                      <div
                        id={`scrollableDiv_${item?.group?.code}`}
                        style={{
                          height: 'calc(100vh - 194px)',
                          overflow: 'auto',
                        }}
                      >
                        <InfiniteScroll
                          dataLength={dataNotification.length}
                          next={loadMoreData}
                          hasMore={currentPage < totalPage}
                          scrollableTarget={`scrollableDiv_${item?.group?.code}`}
                        >
                          <List
                            dataSource={dataNotification}
                            renderItem={(item) => {
                              const [unreadUrl, readUrl] =
                                item?.group?.metadata?.split('|');
                              return (
                                <List.Item
                                  key={item?.email}
                                  className={`item ${
                                    item?.isRead ? 'selected' : ''
                                  }`}
                                >
                                  <List.Item.Meta
                                    className='text'
                                    onClick={() => handleReadById(item)}
                                    avatar={
                                      <div className='image'>
                                        <img
                                          src={
                                            item?.isRead ? readUrl : unreadUrl
                                          }
                                          alt=''
                                        />
                                      </div>
                                    }
                                    title={<a>{item.title}</a>}
                                    description={
                                      <Row gutter={[0, 4]}>
                                        <Col xs={24}>
                                          <p
                                            dangerouslySetInnerHTML={{
                                              __html: item?.contentHtml,
                                            }}
                                          ></p>
                                        </Col>
                                        <Col xs={24}>
                                          <ul className='date'>
                                            <li>
                                              {item?.data?.enterpriseId ? (
                                                <IntlMessages id='common.businessAccount' />
                                              ) : (
                                                <IntlMessages id='common.personalAccount' />
                                              )}
                                            </li>
                                            <li>{item?.notificationDate}</li>
                                          </ul>
                                        </Col>
                                      </Row>
                                    }
                                  />
                                  <div className='action'>
                                    {!item?.isRead && (
                                      <div className='dot'></div>
                                    )}
                                    <Button
                                      type='outline'
                                      onClick={() =>
                                        handleDeleteIdNoti(item?.id)
                                      }
                                    >
                                      <svg
                                        xmlns='http://www.w3.org/2000/svg'
                                        width='24'
                                        height='24'
                                        viewBox='0 0 24 24'
                                        fill='none'
                                      >
                                        <path
                                          d='M9.17188 4C9.58371 2.83481 10.695 2 12.0012 2C13.3074 2 14.4186 2.83481 14.8305 4'
                                          stroke='#6C6868'
                                          strokeWidth='1.5'
                                          strokeLinecap='round'
                                        />
                                        <path
                                          d='M20.5001 6H3.5'
                                          stroke='#6C6868'
                                          strokeWidth='1.5'
                                          strokeLinecap='round'
                                        />
                                        <path
                                          d='M18.8346 8.5L18.3747 15.3991C18.1977 18.054 18.1092 19.3815 17.2442 20.1907C16.3792 21 15.0488 21 12.388 21H11.6146C8.95382 21 7.62342 21 6.75841 20.1907C5.8934 19.3815 5.8049 18.054 5.62791 15.3991L5.16797 8.5'
                                          stroke='#6C6868'
                                          strokeWidth='1.5'
                                          strokeLinecap='round'
                                        />
                                        <path
                                          d='M9.5 11L10 16'
                                          stroke='#6C6868'
                                          strokeWidth='1.5'
                                          strokeLinecap='round'
                                        />
                                        <path
                                          d='M14.5 11L14 16'
                                          stroke='#6C6868'
                                          strokeWidth='1.5'
                                          strokeLinecap='round'
                                        />
                                      </svg>
                                    </Button>
                                  </div>
                                </List.Item>
                              );
                            }}
                            locale={{
                              emptyText: (
                                <NoResult
                                  title={
                                    <IntlMessages id='common.notNotification' />
                                  }
                                  image={emtyImage.src}
                                  isFullheight={true}
                                />
                              ),
                            }}
                          />
                        </InfiniteScroll>
                      </div>
                    </div>
                  )}
                </TabPane>
              );
            })}
          </Tabs>
        </div>
      </Drawer>

      <div className='notification'>
        <Button onClick={handleShowNoti}>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='20'
            height='20'
            viewBox='0 0 20 20'
            fill='none'
          >
            <path
              d='M15.6243 8.09163V7.50446C15.6243 4.28052 13.1062 1.66699 10 1.66699C6.8938 1.66699 4.37573 4.28052 4.37573 7.50446V8.09163C4.37573 8.79629 4.17476 9.48518 3.79817 10.0715L2.8753 11.5083C2.03235 12.8206 2.67587 14.6044 4.14197 15.0194C7.97728 16.1051 12.0227 16.1051 15.858 15.0194C17.3241 14.6044 17.9676 12.8206 17.1247 11.5083L16.2018 10.0715C15.8252 9.48518 15.6243 8.79629 15.6243 8.09163Z'
              stroke='#181414'
            />
            <path
              d='M6.25 15.833C6.79586 17.2895 8.26871 18.333 10 18.333C11.7313 18.333 13.2041 17.2895 13.75 15.833'
              stroke='#181414'
              strokeLinecap='round'
            />
          </svg>
          {dataNotiGroup[0]?.totalUnread > 0 && (
            <span className='dot'>{renderTotalUnread()}</span>
          )}
        </Button>
      </div>

      {openModal && (
        <AppModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          title={modalData.title}
          submitText={modalData.submitText}
          closeText={modalData.closeText}
          handleClose={modalData.handleClose}
          handleSubmit={modalData.handleSubmit}
          className={modalData.className}
          description={modalData.description}
          width={modalData.width}
          isFullScreen={modalData.isFullScreen}
        />
      )}
    </>
  );
};

export default AppNotification;
AppNotification.propTypes = {};
