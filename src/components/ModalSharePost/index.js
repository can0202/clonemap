import React from 'react';
import {Button, Input, Modal} from 'antd';
import PropTypes from 'prop-types';
import {useRef} from 'react';

const ModalSharePost = ({
  dataPost,
  handleCopyText,
  modalCopyText,
  setModalCopyText,
}) => {
  const textRef = useRef(null);
  return (
    <>
      <Modal
        className='modal-copy-text'
        title='Chia sẻ bài viết'
        centered
        open={modalCopyText}
        onOk={() => setModalCopyText(false)}
        onCancel={() => setModalCopyText(false)}
        footer={null}
      >
        <div className='copy_text'>
          <Input
            ref={textRef}
            placeholder='Basic usage'
            defaultValue={dataPost?.detailUrl}
          />
          <Button onClick={handleCopyText}>Sao chép</Button>
        </div>
      </Modal>
    </>
  );
};

export default ModalSharePost;
ModalSharePost.propTypes = {
  handleCopyText: PropTypes.any,
  dataPost: PropTypes.any,
  setModalCopyText: PropTypes.any,
  modalCopyText: PropTypes.any,
};
