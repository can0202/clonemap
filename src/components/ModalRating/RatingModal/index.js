import {Button, Form, Input, Modal, Rate, notification} from 'antd';
import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {updateRating} from 'pages/api/rating';
import {SHOW_MESSAGE} from 'shared/constants/ActionTypes';
import {useDispatch} from 'react-redux';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

const RatingModal = ({
  setOpenRating,
  openRating,
  accessToken,
  dataPost,
  setIsLoading,
}) => {
  const dispatch = useDispatch();
  const {messages} = useIntl();
  const [form] = Form.useForm();
  const {TextArea} = Input;
  const [inputValue, setInputValue] = useState('');
  const [textAreaValue, setTextAreaValue] = useState('');
  const [starValue, setStarValue] = useState(null);
  const [enable, setEnable] = useState(true);

  const handleChangeStar = (e) => {
    setStarValue(e);
  };

  const handleInput = (e) => {
    if (e.target.value.length > 0) {
      setEnable(false);
    } else {
      setEnable(true);
    }
    setInputValue(e.target.value);
  };

  const handleChangeTextArea = (e) => {
    if (e.target.value.length > 0) {
      setEnable(false);
    } else {
      setEnable(true);
    }
    setTextAreaValue(e.target.value);
  };

  // Call api
  const fetchAPI = async () => {
    const dataParams = {
      targetType: dataPost?.author?.ratingTargetType,
      targetId: dataPost?.author?.ratingTargetId,
      star: starValue,
      title: inputValue,
      content: textAreaValue,
      refObject: {
        type: '1',
        id: dataPost?.id,
      },
    };
    const resultData = await updateRating(dataParams, accessToken);
    if (resultData?.status === 'success') {
      dispatch({
        type: SHOW_MESSAGE,
        payload: {
          type: 'success',
          description: resultData?.message,
        },
      });
      setIsLoading(true); // call lại api list rating
      setOpenRating(false);
    }
  };

  const handleConfirm = () => {
    fetchAPI();
  };
  return (
    <>
      <Modal
        title={<IntlMessages id='common.reviewAndRating' />}
        className='modal-save-search modal-users modal-report modal-rating'
        centered
        width={480}
        open={openRating}
        onOk={() => setOpenRating(false)}
        onCancel={() => setOpenRating(false)}
        footer={null}
      >
        <div className='modal-login-body'>
          <div className='modal-login-head'>
            <div className='modal-rating-title text-center'>
              <h4>
                <IntlMessages id='common.titleRating' />
              </h4>
              <h5>
                <IntlMessages id='common.clickRating' />
              </h5>
              <Rate onChange={handleChangeStar} />
            </div>
            <Form form={form} name='modal-report' autoComplete='off'>
              <Form.Item
                label={messages['common.title']}
                name='titleRating'
                className='input-modal-rating input-save-search'
              >
                <Input
                  showCount
                  maxLength={30}
                  placeholder={messages['common.titleHintRating']}
                  onChange={handleInput}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                label={messages['common.description']}
                name='descRating'
                style={{marginBottom: '30px'}}
              >
                <TextArea
                  allowClear
                  showCount
                  maxLength={255}
                  rows={4}
                  placeholder={messages['common.descriptionHintRating']}
                  onChange={handleChangeTextArea}
                />
              </Form.Item>
            </Form>
          </div>
          <div className='modal-login-footer d-flex align-center justify-end'>
            <Button
              key='submit'
              type='primary'
              className={`btn btn-accept ${enable ? 'disable' : ''}`}
              onClick={handleConfirm}
            >
              <IntlMessages id='common.apply' />
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default RatingModal;
RatingModal.propTypes = {
  setOpenRating: PropTypes.any,
  openRating: PropTypes.any,
  accessToken: PropTypes.any,
  isAuthenticated: PropTypes.any,
  dataPost: PropTypes.any,
  setIsLoading: PropTypes.any,
};
