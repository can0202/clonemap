import React from 'react';
import PropTypes from 'prop-types';
import {Collapse} from 'antd';

const AppCollapse = ({title, description, defaultActiveKey, onchange}) => {
  const {Panel} = Collapse;
  return (
    <Collapse
      expandIcon={({isActive}) => (
        <svg
          xmlns='http://www.w3.org/2000/svg'
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
        >
          <path
            d='M19 9L12 15L5 9'
            stroke='#6C6868'
            strokeWidth='1.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      )}
      collapsible='header'
      defaultActiveKey={['1']}
      expandIconPosition={'end'}
      onChange={onchange}
    >
      <Panel header={title} key='1' className='description-panel'>
        {description}
      </Panel>
    </Collapse>
  );
};

export default AppCollapse;
AppCollapse.propTypes = {
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  defaultActiveKey: PropTypes.any,
  onchange: PropTypes.func,
};
