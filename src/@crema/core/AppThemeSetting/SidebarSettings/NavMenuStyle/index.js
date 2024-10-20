import React from 'react';
import Box from '@mui/material/Box';
import IntlMessages from '../../../../utility/IntlMessages';
import {menuStyles} from '../../../../services/db/navigationStyle';
import {
  useSidebarActionsContext,
  useSidebarContext,
} from '../../../../utility/AppContextProvider/SidebarContextProvider';
// import AppSelectedIcon from '../../../AppSelectedIcon';

const NavMenuStyle = () => {
  const {menuStyle} = useSidebarContext();

  const {updateMenuStyle} = useSidebarActionsContext();
  const onMenuStyleChange = (menuStyle) => {
    updateMenuStyle(menuStyle);
  };

  return (
    <>
      <Box component='h4' sx={{mb: 3}}>
        <IntlMessages id='customizer.sidebarMenuStyle' />
      </Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          marginLeft: '-10px',
          marginRight: '-10px',
        }}
      >
        {menuStyles.map((menu) => {
          return (
            <Box
              sx={{
                paddingLeft: 2.5,
                paddingRight: 2.5,
                marginBottom: 5,
              }}
              key={menu.id}
            >
              <Box
                sx={{
                  position: 'relative',
                  cursor: 'pointer',
                }}
                onClick={() => onMenuStyleChange(menu.alias)}
              >
                <img src={menu.image} alt='nav' />
              </Box>
            </Box>
          );
        })}
      </Box>
    </>
  );
};

export default NavMenuStyle;
