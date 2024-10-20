import React, {useState, useEffect} from 'react';
import {Form, Select} from 'antd';
import PropTypes from 'prop-types';
import {fetchProjectCat} from 'pages/api/projectCat';
import {useCallback} from 'react';
import {debounce} from '@mui/material';
import IntlMessages from '@crema/utility/IntlMessages';
import {useIntl} from 'react-intl';
import IconArrow from 'assets/icon/ArrowDown.png';
import {filterOptionSearch} from 'shared/constants/AppConst';

const FormProject = () => {
  const {messages} = useIntl();
  const [page, setPage] = useState(1);
  const [isLoadListProject, setIsLoadListProject] = useState(true);
  const [listReProjectCat, setListReProjectCat] = useState([]);
  const [projectSearchObject, setProjectSearchObject] = useState({
    page: page,
    pageSize: 10,
    searchText: '',
  });
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    if (isLoadListProject) {
      const setReProjectCatList = async () => {
        let list = [...(isSearch ? [] : listReProjectCat)];
        const resultData = await fetchProjectCat(projectSearchObject);
        const reProjectCatList = resultData?.data?.elements ?? [];
        list = [
          ...list,
          ...reProjectCatList.map((project) => ({
            value: project.code,
            label: project.name,
          })),
        ];
        setListReProjectCat(list);
      };
      setReProjectCatList();
      setIsLoadListProject(false);
      setIsSearch(false);
    }
  }, [isLoadListProject]);

  const fetchDropdownProject = async (value) => {
    const projectSearchObject = {
      page: 1,
      pageSize: 10,
      searchText: value,
    };

    setProjectSearchObject(projectSearchObject);
    setIsSearch(true);
    setIsLoadListProject(true);
  };

  const debounceProject = useCallback(
    debounce((nextValue) => fetchDropdownProject(nextValue), 200),
    [],
  );

  const onScroll = async (event) => {
    const target = event.target;
    if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
      setPage((pre) => pre + 1);
      let newProjectSearchObject = {
        ...projectSearchObject,
        page: page + 1,
      };
      setProjectSearchObject(newProjectSearchObject);
      target.scrollTo(0, target.scrollHeight);
      setIsLoadListProject(true);
    }
  };

  const onSearchProject = (e) => {
    debounceProject(e);
  };

  return (
    <Form.Item
      className='post-item-project'
      name='projectBdsFilter'
      label={<IntlMessages id='common.project' />}
    >
      <Select
        showSearch
        mode='multiple'
        loading={isLoadListProject}
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
        onSearch={onSearchProject}
        placeholder={messages['common.projectHint']}
        options={listReProjectCat}
      ></Select>
    </Form.Item>
  );
};

export default FormProject;
FormProject.propTypes = {};
