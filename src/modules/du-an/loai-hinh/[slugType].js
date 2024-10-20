import React, {useState, useEffect} from 'react';
import {useRouter} from 'next/router';
import SearchComponent from 'components/SearchComponent';
import {onChangeSubType} from 'redux/actions/Project';
import {useDispatch, useSelector} from 'react-redux';
import PropsTypes from 'prop-types';

const CategoryType = ({postsCate, url}) => {
  const router = useRouter();
  const slug = router.asPath.split('/');
  const typeSlug = slug[1];
  const subTypeSlug = router?.query?.slugType?.split('&')[0];
  const [searchParam, setSearchParam] = useState({});

  const {isChangeSubType, subType} = useSelector(({project}) => project);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isChangeSubType) {
      const newSearchParam = {
        subTypes: subType,
        types: typeSlug,
      };
      setSearchParam(newSearchParam);
      dispatch(onChangeSubType(false));
    }
  }, [isChangeSubType]);

  useEffect(() => {
    fetchAPI();
  }, []);

  const {categories} = useSelector((state) => state.categories);
  const fetchAPI = async () => {
    const categoryList = categories?.categories?.realEstateTypeCat ?? [];
    const currentSubType = categoryList?.filter(
      (subType) => subType?.metadata === subTypeSlug,
    );
    const currentSubTypeCode = currentSubType?.filter(
      (item) => item?.parent === typeSlug,
    );
    const newSearchParam = {
      subTypes: currentSubTypeCode[0]?.code,
      types: typeSlug,
    };
    setSearchParam(newSearchParam);
  };

  return (
    <SearchComponent
      searchParam={searchParam}
      postsCate={postsCate}
      url={url}
    />
  );
};

export default CategoryType;
CategoryType.propTypes = {
  postsCate: PropsTypes.any,
  url: PropsTypes.any,
};
