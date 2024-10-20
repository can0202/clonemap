import React, {useState} from 'react';
import {Form, Input} from 'antd';
import PropTypes from 'prop-types';
import {useIntl} from 'react-intl';

const BoxSearch = ({
  switchMap,
  onChangeSearchParam,
  onChangeMapSearchParam,
  setIsReload,
  setDataObject,
  dataObject,
  setCurrentPage,
  setMapDataObj,
  mapDataObj,
  openFullMap,
}) => {
  const {Search} = Input;
  const {messages} = useIntl();
  const [inputValue, setInputValue] = useState('');
  const [oldValue, setOldValue] = useState('');
  // xử lý search text
  const searchTextByBlurInput = (e) => {
    if (inputValue !== oldValue) {
      triggerSearch();
    }
  };
  const onSearchText = (e) => {
    if (!switchMap) {
      onChangeSearchParam({searchText: e, page: 1});
      setCurrentPage(1);
      setIsReload(true);
      setMapDataObj({
        ...mapDataObj,
        searchText: e,
      });
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
        block: 'end',
      });
    } else {
      onChangeMapSearchParam({searchText: e, page: 1});
      setDataObject({
        ...dataObject,
        searchText: e,
      });
      if (!openFullMap) {
        window.scrollTo({
          top: 300,
          behavior: 'smooth',
          block: 'end',
        });
      }
    }
  };
  const handleChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && inputValue !== oldValue) {
      triggerSearch();
    }
  };
  const triggerSearch = () => {
    setOldValue(inputValue);
    onSearchText(inputValue);
  };
  return (
    <div className='box-search'>
      <Form.Item name='searchTextHeader' className='form-item'>
        <Search
          allowClear
          placeholder={messages['common.searchHint']}
          onSearch={onSearchText}
          onChange={handleChange}
          prefix={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='16'
              height='16'
              viewBox='0 0 16 16'
              fill='none'
            >
              <path
                d='M7.66536 13.9997C11.1632 13.9997 13.9987 11.1641 13.9987 7.66634C13.9987 4.16854 11.1632 1.33301 7.66536 1.33301C4.16756 1.33301 1.33203 4.16854 1.33203 7.66634C1.33203 11.1641 4.16756 13.9997 7.66536 13.9997Z'
                stroke='#BDBDBD'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
              <path
                d='M14.6654 14.6663L13.332 13.333'
                stroke='#BDBDBD'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          }
          onBlur={searchTextByBlurInput}
          onKeyDown={handleKeyDown}
          autoComplete='off'
        />
      </Form.Item>
    </div>
  );
};

export default BoxSearch;
BoxSearch.propTypes = {
  switchMap: PropTypes.any,
  onChangeMapSearchParam: PropTypes.any,
  onChangeSearchParam: PropTypes.any,
  dataObject: PropTypes.any,
  setDataObject: PropTypes.any,
  mapDataObj: PropTypes.any,
  setMapDataObj: PropTypes.any,
  setIsReload: PropTypes.any,
  setCurrentPage: PropTypes.any,
  openFullMap: PropTypes.bool,
};
