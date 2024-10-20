import {Tabs} from 'antd';
import React from 'react';

const TabContent = () => {
  return (
    <div className='notification_content var-section-tab'>
      <Tabs defaultActiveKey='1' items={items} />
    </div>
  );
};

export default TabContent;
