import React from 'react';
// import Box from '@mui/material/Box';
// import AuthWrapper from '../AuthWrapper';
// import SigninFirebase from './SigninFirebase';
// import AppLogo from '../../../@crema/core/AppLayout/components/AppLogo';
import {useEffect} from 'react';
import {useAuthMethod} from '@crema/utility/AuthHooks';

const Signin = () => {
  const {signInWithEmailAndPassword} = useAuthMethod();
  useEffect(() => {
    let data = {
      email: 'crema.demo@gmail.com',
      password: 'Pass@1!@all',
    };
    signInWithEmailAndPassword(data);
  }, []);
  return <></>;
};

export default Signin;
