import React from 'react';
import AppPage from '../../@crema/hoc/AppPage';
import asyncComponent from '../../@crema/utility/asyncComponent';

const Home = asyncComponent(() => import('../../modules/home/index'));
export default AppPage(() => <Home />);
