import React from 'react';
import PropTypes from 'prop-types';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import IconDownload from 'assets/icon/download-red.png';

const TabContent3 = ({dataPost, renderHtml}) => {
  const {messages} = useIntl();
  return (
    <div className='legal-project'>
      <div className='legal-project-text'>
        <p
          className='description'
          style={{marginBottom: '0'}}
          dangerouslySetInnerHTML={{
            __html: renderHtml ? renderHtml : messages['common.updating'],
          }}
        ></p>
        {dataPost?.legalFiles?.length > 0 && (
          <ul className='legal-project-file' style={{marginTop: '16px'}}>
            {dataPost?.legalFiles?.map((item, index) => {
              return (
                <li key={index} className='d-flex justify-between'>
                  <a href={item.url} download>
                    <div className='d-flex align-center justify-between'>
                      <span>
                        <IntlMessages id='common.legalRecords' /> {index + 1}
                      </span>
                      <img
                        src={IconDownload.src}
                        alt={
                          messages['common.legalRecords'] + ' ' + (index + 1)
                        }
                      />
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TabContent3;
TabContent3.propTypes = {
  dataPost: PropTypes.any,
  renderHtml: PropTypes.any,
};
