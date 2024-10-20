import React from 'react';
// import AppSidebar from './AppSidebar';
// import {AppContentView} from '../../../index';
import AppThemeSetting from '../../AppThemeSetting';
import AppHeader from './AppHeader';
import clsx from 'clsx';
import Box from '@mui/material/Box';
import UserHeaderWrapper from './UserHeaderWrapper';
import AppFixedFooter from './AppFixedFooter';
import {useLayoutContext} from '../../../utility/AppContextProvider/LayoutContextProvider';
import {LayoutType} from '../../../../shared/constants/AppEnums';
import UserHeaderContainer from './UserHeaderContainer';
import PropsTypes from 'prop-types';

const UserHeader = ({children}) => {
  const {footer, layoutType, footerType} = useLayoutContext();

  return (
    <UserHeaderContainer
      className={clsx({
        boxedLayout: layoutType === LayoutType.BOXED,
        framedLayout: layoutType === LayoutType.FRAMED,
      })}
    >
      <UserHeaderWrapper
        className={clsx('userHeaderWrapper', {
          appMainFooter: footer && footerType === 'fluid',
          appMainFixedFooter: footer && footerType === 'fixed',
        })}
      >
        <AppHeader />
        <Box className='mainContent'>
          {/* <AppSidebar /> */}
          {children}
          <AppFixedFooter />
        </Box>
        <AppThemeSetting />
      </UserHeaderWrapper>
    </UserHeaderContainer>
  );
};

export default UserHeader;

UserHeader.propTypes = {
  children: PropsTypes.node,
};
