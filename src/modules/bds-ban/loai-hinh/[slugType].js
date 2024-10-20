import React, {useState, useEffect} from 'react';
import SearchComponent from 'components/SearchComponent';
import {useRouter} from 'next/router';
import {useDispatch, useSelector} from 'react-redux';
import {onChangeSubType} from 'redux/actions/Project';
import PropsTypes from 'prop-types';

const CategoryTypeSale = ({postsCate, url}) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const slug = router.asPath.split('/');
  const subTypeSlug = router?.query?.slugType?.split('&')[0];
  const typeSlug = slug[1];
  const [searchParam, setSearchParam] = useState({});
  const {isChangeSubType, subType} = useSelector(({project}) => project);

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

export default CategoryTypeSale;
CategoryTypeSale.propTypes = {
  postsCate: PropsTypes.any,
  url: PropsTypes.any,
};
