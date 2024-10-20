import React, {memo} from 'react';
import {Button, Col, Modal, Row, Spin} from 'antd';
import PropTypes from 'prop-types';
import clsx from 'clsx';

const AppModal = ({
  openModal,
  setOpenModal,
  title,
  description,
  children,
  width,
  onClosable,
  handleClose,
  handleSave,
  closeText,
  saveText,
  handleSubmit,
  submitText,
  className,
  contentLoading,
  isFullScreen = false,
}) => {
  return (
    <Modal
      maskClosable={false}
      centered
      className={clsx({
        app_modal: true,
        className: className,
        isFullScreen: isFullScreen,
      })}
      onCancel={() => {
        if (onClosable) {
          onClosable();
        }
        setOpenModal(false);
      }}
      open={openModal}
      width={width}
      title={title}
      destroyOnClose
      footer={
        submitText || closeText || saveText ? (
          <Row gutter={[8, 8]} justify={'space-between'} align={'middle'}>
            {saveText && (
              <Col flex={'none'}>
                <Button
                  type='text'
                  className='btn btn-delete'
                  onClick={handleSave}
                >
                  {saveText}
                </Button>
              </Col>
            )}
            {(closeText || submitText) && (
              <Col
                flex={'none'}
                style={{width: `${closeText || submitText ? '100%' : ''} `}}
              >
                <Row gutter={[8, 0]} justify={'end'}>
                  {closeText && (
                    <Col flex={'none'}>
                      <Button
                        className='btn btn-close'
                        type='default'
                        onClick={handleClose}
                      >
                        {closeText}
                      </Button>
                    </Col>
                  )}

                  {submitText && (
                    <Col flex={'none'}>
                      <Button
                        className='btn btn-apply'
                        type='primary'
                        onClick={handleSubmit}
                      >
                        {submitText}
                      </Button>
                    </Col>
                  )}
                </Row>
              </Col>
            )}
          </Row>
        ) : null
      }
    >
      {contentLoading ? (
        <div className='text-center'>
          <Spin />
        </div>
      ) : (
        <>
          {description}
          {children}
        </>
      )}
    </Modal>
  );
};

export default memo(AppModal);
AppModal.propTypes = {
  openModal: PropTypes.bool,
  setOpenModal: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.any]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  children: PropTypes.oneOfType([PropTypes.any, PropTypes.node]),
  handleSubmit: PropTypes.func,
  handleClose: PropTypes.func,
  handleSave: PropTypes.func,
  submitText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.any,
  ]),
  closeText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.any,
  ]),
  saveText: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
    PropTypes.any,
  ]),
  disabled: PropTypes.bool,
  contentLoading: PropTypes.bool,
  width: PropTypes.number,
  onClosable: PropTypes.any,
  className: PropTypes.string,
  isFullScreen: PropTypes.bool,
};
