import {Avatar, Divider, List, Skeleton} from 'antd';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import PropTypes from 'prop-types';

const RenderItem = ({dataNotification, handleLoadMoreData}) => {
  return (
    <div className='list-item'>
      <List
        itemLayout='horizontal'
        dataSource={dataNotification}
        renderItem={(item, index) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item?.group?.iconUrl} />}
              title={<a>{item.title}</a>}
              description='Ant Design, a design language for background applications, is refined by Ant UED Team'
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default RenderItem;
RenderItem.propTypes = {
  handleLoadMoreData: PropTypes.func,
  dataNotification: PropTypes.any,
};
