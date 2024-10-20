import React from 'react';
import {useThemeContext} from '../../../../utility/AppContextProvider/ThemeContextProvider';
import PropTypes from 'prop-types';
import {Box} from '@mui/material';
import {useRouter} from 'next/router';

const AppLogo = ({logo}) => {
  const {theme} = useThemeContext();
  const contextPath = process.env.CONTEXT_PATH;
  const router = useRouter();
  const pathHome = router.asPath;

  return (
    <Box
      sx={{
        padding: 2.5,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      className='app-logo header-logo'
    >
      {pathHome === '/' ? (
        <h1>
          <a href={logo?.hrefUrl} className='d-flex'>
            <img src={logo?.iconUrl} alt='Varsland.vn' />
          </a>
        </h1>
      ) : (
        <a href={logo?.hrefUrl} className='d-flex'>
          <img src={logo?.iconUrl} alt='Varsland.vn' />
        </a>
      )}
    </Box>
  );
};

export default AppLogo;
AppLogo.propTypes = {
  color: PropTypes.string,
  logo: PropTypes.any,
};
