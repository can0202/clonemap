import {Button, Col, Form, Input, Modal, Row, Switch, notification} from 'antd';
import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import {useDispatch, useSelector} from 'react-redux';
import {updateFilter} from 'pages/api/updateFilter';
import {saveFilter} from 'pages/api/saveFilter';
import {useRouter} from 'next/router';
import {SHOW_MESSAGE} from 'shared/constants/ActionTypes';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';

const ModalSaveFilter = ({
  form,
  dataObject,
  openModalSaveFilter,
  setOpenModalSaveFilter,
}) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const {messages} = useIntl();
  const [checkedEmail, setCheckedEmail] = useState(false);
  const [checkedApp, setCheckedApp] = useState(false);
  const [inputValueSave, setInputValueSave] = useState('');
  const [switchEmailSave, setSwitchEmailSave] = useState(false);
  const [switchAppSave, setSwitchAppSave] = useState(false);

  let isEditValue = router?.query?.isEdit;

  const {filters} = useSelector(({filter}) => filter);
  const {accessToken} = useSelector(({auth}) => auth);
  const [enable, setEnable] = useState(true);

  // Get value when has id "SAVE FILTER"
  useEffect(() => {
    if (isEditValue == 'true') {
      form.setFieldsValue({
        saveSearch: filters?.name,
      });
      setCheckedEmail(filters?.emailNotification);
      setCheckedApp(filters?.appNotification);
    }
  }, [filters]);

  // Handle Change Input Save Search
  const handleInputSave = (e) => {
    if (e.target.value.length > 0) {
      setEnable(false);
    } else {
      setEnable(true);
    }
    setInputValueSave(e.target.value);
  };
  const handleSwitchEmail = (e) => {
    setSwitchEmailSave(e);
  };
  const handleSwitchApp = (e) => {
    setSwitchAppSave(e);
  };

  // Handle Confirm Button Save Filter
  const handleConfirmSaveFilter = async () => {
    let subTypes;
    let directions;
    if (dataObject?.subTypes) {
      subTypes =
        typeof dataObject?.subTypes === 'object'
          ? dataObject?.subTypes
          : [dataObject?.subTypes];
    } else {
      subTypes = null;
    }

    if (dataObject?.directions) {
      directions =
        typeof dataObject?.directions === 'object'
          ? dataObject?.directions
          : [dataObject?.directions];
    } else {
      directions = null;
    }

    const filterObj = {
      searchText: dataObject?.searchText ? dataObject?.searchText : null,
      types: dataObject?.types ? [dataObject?.types] : [],
      subTypes: subTypes,
      status: dataObject?.status ? dataObject?.status : [],
      subStatus: dataObject?.subStatus ? dataObject?.subStatus : [],
      sortBy: dataObject?.sortBy ? dataObject?.sortBy : 'default',
      provinceCodes: dataObject?.provinceCodes
        ? [dataObject?.provinceCodes]
        : [],
      districtCodes: dataObject?.districtCodes
        ? [dataObject?.districtCodes]
        : [],
      wardCodes: dataObject?.wardCodes ? [dataObject?.wardCodes] : [],
      directions: directions,
      areaFrom: dataObject?.areaFrom ? dataObject?.areaFrom : null,
      areaTo: dataObject?.areaTo ? dataObject?.areaTo : null,
      priceFrom: dataObject?.priceFrom ? dataObject?.priceFrom : null,
      priceTo: dataObject?.priceTo ? dataObject?.priceTo : null,
      investors: dataObject?.investors ? dataObject?.investors : [],
      bedrooms: dataObject?.bedrooms ? dataObject?.bedrooms : [],
      projects: dataObject?.projects ? dataObject?.projects : [],
      postBy: dataObject?.postBy ? dataObject?.postBy : [],
      isOutstanding: dataObject?.isOutstanding
        ? dataObject?.isOutstanding
        : false,
      isPostByVARS: dataObject?.isPostByVARS ? dataObject?.isPostByVARS : false,
    };
    // get id filter when "SAVE_FILTER"
    const id_filter = filters?.id;
    const payload = {
      name: inputValueSave,
      filter: JSON.stringify(filterObj),
      emailNotification: switchEmailSave,
      appNotification: switchAppSave,
    };
    // check ID has in FILTER trả về -> Nếu có thì update / tạo mới
    // 'id' in filters
    if (isEditValue == 'true') {
      const result = await updateFilter(id_filter, payload, accessToken);
      if (result?.code === 200) {
        dispatch({
          type: SHOW_MESSAGE,
          payload: {
            type: 'success',
            description: result?.message,
          },
        });
        setOpenModalSaveFilter(false);
      }
    } else {
      const data = await saveFilter(payload, accessToken);
      if (data?.code === 200) {
        dispatch({
          type: SHOW_MESSAGE,
          payload: {
            type: 'success',
            description: data?.message,
          },
        });
        setOpenModalSaveFilter(false);
      } else {
        dispatch({
          type: SHOW_MESSAGE,
          payload: {
            type: 'error',
            description: data?.message,
          },
        });
      }
    }
  };
  return (
    <>
      <Modal
        title={<IntlMessages id='common.saveFilter' />}
        className='modal-save-search modal-users'
        centered
        width={400}
        open={openModalSaveFilter}
        onOk={() => setOpenModalSaveFilter(false)}
        onCancel={() => setOpenModalSaveFilter(false)}
        footer={
          <Row gutter={[8, 0]}>
            <Col xs={12}>
              <Button
                block
                type='default'
                className='btn btn-cancel'
                onClick={() => setOpenModalSaveFilter(false)}
              >
                <IntlMessages id='common.cancel' />
              </Button>
            </Col>
            <Col xs={12}>
              <Button
                block
                type='primary'
                key='submit'
                className={`btn btn-accept ${enable ? 'disable' : ''}`}
                onClick={handleConfirmSaveFilter}
              >
                <IntlMessages id='common.save' />
              </Button>
            </Col>
          </Row>
        }
      >
        <div className='modal-login-body'>
          <div className='modal-login-head text-center'>
            <Form form={form} name='modal-save-search' autoComplete='off'>
              <Form.Item
                label={messages['common.filterName']}
                name='saveSearch'
                className='input-save-search'
                rules={[
                  {
                    required: true,
                    message: messages['common.filterNameRequired'],
                  },
                ]}
              >
                <Input
                  showCount
                  maxLength={255}
                  placeholder={messages['common.filterNameHint']}
                  onChange={handleInputSave}
                  allowClear
                />
              </Form.Item>
              <Form.Item
                label={messages['common.receiveNotiMail']}
                name='switchEmail'
                className='input-switch-search'
              >
                <Switch
                  defaultChecked={checkedEmail}
                  onChange={handleSwitchEmail}
                />
              </Form.Item>
              <Form.Item
                label={messages['common.receiveNotiApp']}
                name='switchApp'
                className='input-switch-search'
              >
                <Switch
                  defaultChecked={checkedApp}
                  onChange={handleSwitchApp}
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ModalSaveFilter;
ModalSaveFilter.propTypes = {
  form: PropTypes.any,
  openModalSaveFilter: PropTypes.any,
  setOpenModalSaveFilter: PropTypes.any,
  dataObject: PropTypes.any,
};
