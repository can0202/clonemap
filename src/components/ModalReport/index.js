import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Radio,
  Row,
  Space,
  notification,
} from 'antd';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {fetchCategoryAll} from 'pages/api/category';
import {postReport} from 'pages/api/postReport';
import {useDispatch, useSelector} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {SHOW_MESSAGE} from 'shared/constants/ActionTypes';

const ModalReport = ({dataPost, openModalReport, setOpenModalReport}) => {
  const dispatch = useDispatch();
  const {messages} = useIntl();
  const {isAuthenticated, accessToken, profile} = useSelector(({auth}) => auth);
  const [form] = Form.useForm();
  const {TextArea} = Input;
  const [showTextArea, setShowTextArea] = useState(false);
  const [value, setValue] = useState('6');
  const [title, setTitle] = useState('');
  const [textTextArea, setTextTextArea] = useState('');
  const [dataReport, setDataReport] = useState([]);
  const [enable, setEnable] = useState(true);

  const onChange = (e) => {
    setValue(e.target.value);
    setTitle(e.target.label);
    if (e.target.value === '10') {
      setShowTextArea(true);
    } else {
      setShowTextArea(false);
    }
  };

  const handleChangeTextArea = (e) => {
    if (e.target.value.length > 0) {
      setEnable(false);
    } else {
      setEnable(true);
    }
    setTextTextArea(e.target.value);
  };

  // get list report
  const fetchApi = async () => {
    const result = await fetchCategoryAll();
    setDataReport(result?.data?.categories?.reportReasonCat);
  };
  useEffect(() => {
    fetchApi();
  }, []);

  // Call api report post
  const fetchReport = async () => {
    const dataReport = {
      target: {
        id: dataPost?.id,
        type: 5,
      },
      reason: {
        code: value,
        name: title,
        metadata: textTextArea,
      },
    };
    const resultData = await postReport(dataReport, accessToken);
    if (resultData?.status === 'success') {
      dispatch({
        type: SHOW_MESSAGE,
        payload: {
          type: 'success',
          description: resultData?.message,
        },
      });
      setOpenModalReport(false);
    }
  };

  const handleConfirmReport = () => {
    fetchReport();
  };
  return (
    <>
      {dataReport?.length > 0 && (
        <Modal
          title={<IntlMessages id='common.reportPosted' />}
          className='app_modal modal-report'
          centered
          width={480}
          open={openModalReport}
          onOk={() => setOpenModalReport(false)}
          onCancel={() => setOpenModalReport(false)}
          footer={
            <Row gutter={[8, 0]} justify={'end'}>
              <Col>
                <Button
                  type='default'
                  onClick={() => setOpenModalReport(false)}
                >
                  <IntlMessages id='common.cancel' />
                </Button>
              </Col>
              <Col>
                <Button
                  key='submit'
                  type='primary'
                  className={`${showTextArea && enable ? 'disable' : ''}`}
                  onClick={handleConfirmReport}
                >
                  <IntlMessages id='common.apply' />
                </Button>
              </Col>
            </Row>
          }
        >
          <div className='modal-login-body'>
            <div className='modal-login-head'>
              <p>
                <IntlMessages id='common.notiReport' />
              </p>
              <Form form={form} name='modal-report' autoComplete='off'>
                <Form.Item>
                  <Radio.Group value={value}>
                    <Space direction='vertical'>
                      {dataReport?.map((ele, index) => {
                        if (ele.parent === '2')
                          return (
                            <Radio
                              label={ele.name}
                              value={ele.code}
                              key={index}
                              onChange={onChange}
                            >
                              {ele.name}
                            </Radio>
                          );
                      })}
                    </Space>
                  </Radio.Group>
                </Form.Item>
                {showTextArea && (
                  <Form.Item
                    name='otherReasons'
                    style={{marginBottom: '30px', marginTop: '16px'}}
                    rules={[
                      {
                        required: true,
                        message: messages['common.reasonReportRequired'],
                      },
                    ]}
                  >
                    <TextArea
                      allowClear
                      showCount
                      maxLength={255}
                      rows={4}
                      placeholder={messages['common.reasonReportHint']}
                      onChange={handleChangeTextArea}
                    />
                  </Form.Item>
                )}
              </Form>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ModalReport;
ModalReport.propTypes = {
  setOpenModalReport: PropTypes.any,
  openModalReport: PropTypes.any,
  dataPost: PropTypes.any,
  accessToken: PropTypes.any,
};
