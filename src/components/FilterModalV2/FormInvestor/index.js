import React, {useState, useEffect} from 'react';
import {Form, Select} from 'antd';
import {fetchInvestorCat} from 'pages/api/investorCat';
import {useCallback} from 'react';
import {debounce} from '@mui/material';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import {filterOptionSearch} from 'shared/constants/AppConst';

const FormInvestor = ({}) => {
  const [page, setPage] = useState(1);
  const {messages} = useIntl();
  const [isLoadListInvestor, setIsLoadListInvestor] = useState(true);
  const [listReInvestorCat, setListReInvestorCat] = useState([]);
  const [investorSearchObject, setInvestorSearchObject] = useState({
    page: page,
    pageSize: 10,
    searchText: '',
  });
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    if (isLoadListInvestor) {
      const setInvestorCatList = async () => {
        let list = [...(isSearch ? [] : listReInvestorCat)];
        const resultData = await fetchInvestorCat(investorSearchObject);
        const reProjectCatList = resultData?.data?.elements ?? [];
        list = [
          ...list,
          ...reProjectCatList.map((project) => ({
            value: project.code,
            label: project.name,
          })),
        ];
        setListReInvestorCat(list);
      };
      setInvestorCatList();
      setIsLoadListInvestor(false);
      setIsSearch(false);
    }
  }, [isLoadListInvestor]);

  const fetchDropdownInvestor = async (value) => {
    const investorSearchObject = {
      page: 1,
      pageSize: 10,
      searchText: value,
    };

    setInvestorSearchObject(investorSearchObject);
    setIsSearch(true);
    setIsLoadListInvestor(true);
  };

  const debounceInvestor = useCallback(
    debounce((nextValue) => fetchDropdownInvestor(nextValue), 200),
    [],
  );

  const onScroll = async (event) => {
    const target = event.target;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      setPage((pre) => pre + 1);
      let newInvestorSearchObject = {
        ...investorSearchObject,
        page: page + 1,
      };
      setInvestorSearchObject(newInvestorSearchObject);
      target.scrollTo(0, target.scrollHeight);
      setIsLoadListInvestor(true);
    }
  };

  const onSearchInvestor = (e) => {
    debounceInvestor(e);
  };

  return (
    <>
      <Form.Item
        className='form-item'
        name='investorsFilter'
        label={<IntlMessages id='common.investor' />}
      >
        <Select
          showSearch
          mode='multiple'
          loading={isLoadListInvestor}
          onPopupScroll={onScroll}
          maxTagCount='responsive'
          filterOption={filterOptionSearch}
          filterSort={(optionA, optionB) => {
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase());
          }}
          suffixIcon={
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='20'
              height='20'
              viewBox='0 0 20 20'
              fill='none'
            >
              <path
                d='M15.8327 7.5L9.99935 12.5L4.16602 7.5'
                stroke='#6C6868'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          }
          onSearch={onSearchInvestor}
          placeholder={messages['common.investorHint']}
          options={listReInvestorCat}
        />
      </Form.Item>
    </>
  );
};

export default FormInvestor;
