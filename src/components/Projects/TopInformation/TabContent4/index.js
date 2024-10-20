import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';

const TabContent4 = ({dataPost, Fancybox}) => {
  return (
    <div className='progress-project'>
      {dataPost?.progress || dataPost?.progressFiles ? (
        <>
          <p
            dangerouslySetInnerHTML={{
              __html: dataPost?.progress,
            }}
            className={`${dataPost?.progress ? 'mb-16' : ''}`}
          ></p>
          <Fancybox options={{dragToClose: false}}>
            <div className='progress-file'>
              {dataPost?.progressFiles?.map((item, index) => {
                return (
                  <a href={item?.url} data-fancybox='progress' key={index}>
                    <img src={item?.url} alt={item?.fileName} />
                  </a>
                );
              })}
            </div>
          </Fancybox>
        </>
      ) : (
        <IntlMessages id='common.updating' />
      )}
    </div>
  );
};

export default TabContent4;
TabContent4.propTypes = {
  dataPost: PropTypes.any,
  Fancybox: PropTypes.any,
};
