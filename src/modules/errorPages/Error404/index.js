import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import {grey} from '@mui/material/colors';
import {Fonts} from 'shared/constants/AppEnums';
import {initialUrl} from 'shared/constants/AppConst';
import img404 from 'assets/img/404-Error.png';
import {useTheme} from '@mui/material';
import {useRouter} from 'next/router';
import {Button} from 'antd';
import IntlMessages from '@crema/utility/IntlMessages';
import Head from 'next/head';

const Error404 = () => {
  const theme = useTheme();
  const history = useRouter();

  const onGoBackToHome = () => {
    history.push(initialUrl);
  };

  return (
    <>
      <Head>
        <title>404</title>
      </Head>
      <Box
        className='page-404'
        sx={{
          py: {xl: 8},
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Box className='logo-404'>
          <img src={img404.src} alt='' />
        </Box>
        <Box
          sx={{
            mb: {xs: 4, xl: 5},
          }}
        >
          <Box
            sx={{
              mb: {xs: 4, xl: 5},
              color: grey[600],
              fontSize: 16,
              fontWeight: Fonts.MEDIUM,
            }}
          >
            <Typography className='title-404'>
              <IntlMessages id='common.noti404' />
            </Typography>
            <Button
              type='primary'
              onClick={onGoBackToHome}
              className='back_to_home'
            >
              <IntlMessages id='common.goBackHome' />
            </Button>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Error404;
