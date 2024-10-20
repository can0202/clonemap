import React, {createContext, useCallback, useContext, useState} from 'react';
import defaultConfig from './defaultConfig';
import PropTypes from 'prop-types';

// const LayoutContext = createContext();
// const LayoutActionsContext = createContext();
const LayoutContext = createContext({
  footer: defaultConfig.footer,
  navStyle: defaultConfig.navStyle,
  layoutType: defaultConfig.layoutType,
  footerType: defaultConfig.footerType,
  direction: defaultConfig.direction,
});

const LayoutActionsContext = createContext({
  updateLayoutType: () => {},
  updateNavStyle: () => {},
  setFooterType: () => {},
  setFooter: () => {},
  updateDirection: () => {},
});

export const useLayoutContext = () => useContext(LayoutContext);

export const useLayoutActionsContext = () => useContext(LayoutActionsContext);

const LayoutContextProvider = ({children}) => {
  const [layoutType, updateLayoutType] = useState(defaultConfig.layoutType);
  const [navStyle, updateNavStyle] = useState(defaultConfig.navStyle);
  const [direction, updateDirection] = useState(defaultConfig.direction);
  const [footerType, setFooterType] = useState(defaultConfig.footerType);
  const [footer, setFooter] = useState(defaultConfig.footer);
  const [headerType, setHeaderType] = useState(defaultConfig.headerType);

  // const updateNavStyle = useCallback((navStyle) => {
  //   setNavStyle(navStyle);
  // }, []);

  return (
    <LayoutContext.Provider
      value={{
        navStyle,
        direction,
        footerType,
        footer,
        headerType,
        layoutType,
      }}
    >
      <LayoutActionsContext.Provider
        value={{
          setFooter,
          setFooterType,
          updateNavStyle,
          updateLayoutType,
          setHeaderType,
          updateDirection,
        }}
      >
        {children}
      </LayoutActionsContext.Provider>
    </LayoutContext.Provider>
  );
};

export default LayoutContextProvider;

LayoutContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
