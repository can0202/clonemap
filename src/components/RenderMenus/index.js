import React from 'react';
import PropTypes from 'prop-types';

const RenderMenus = ({menus, subCate}) => {
  let menusMain = [];
  menus?.forEach((ele) => {
    let item = subCate?.filter((item) => item?.parent == ele?.key);
    let eleOption = '';
    eleOption = {
      label: ele?.label,
      key: ele?.key,
      children: ele?.children ? ele?.children : item,
    };
    menusMain?.push(eleOption);
  });

  const renderChildren = (children) => {
    if (children?.children?.length === 0) {
      return null;
    }
    return (
      <ul className='sub-menu'>
        {children?.children?.map((child, index) => (
          <li key={index}>
            <h4>
              <a
                href={`${
                  children?.key === 'kham-pha'
                    ? child?.href
                    : `${children?.key}/loai-hinh/${child?.metadata}`
                }`}
              >
                {child?.name}
              </a>
            </h4>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <ul>
      {menusMain?.map((item, index) => (
        <li key={index}>
          <h3>
            <a href={item?.key}>{item?.label}</a>
          </h3>
          {renderChildren(item)}
        </li>
      ))}
    </ul>
  );
};

export default RenderMenus;
RenderMenus.propTypes = {
  menus: PropTypes.any,
  subCate: PropTypes.any,
};
