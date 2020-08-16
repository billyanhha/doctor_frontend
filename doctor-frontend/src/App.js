import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import LoadingBar from 'react-redux-loading-bar';
import './App.css';
import NoMatch from './systemPages/NoMatch';
import SystemLogin from './systemPages/SystemLogin'
import DoctorNewFeedTab from './systemPages/DoctorNewFeedTab';
import DoctorTimeTable from './systemPages/DoctorTimeTable';
import PrivateRoute from './routeConfig/PrivateRoute';
import Package from './systemPages/Package';
import PackageDetail from './systemPages/PackageDetail';
import ChartJs from './systemPages/ChartForPackage';
import ViewDoctorProfile from './systemPages/ViewDoctorProfile';
import DoctorRequestService from './systemPages/DoctorRequestService';
import Notify from './components/Notify';
import ForgotPassword from './systemPages/ForgotPassword';
import Messenger from './systemPages/Messenger';
import FloatingButton from './components/FloatingButton';
import ViewForm from './systemPages/ViewForm';
import Service from './systemPages/Service';
import VerifyEmail from './systemPages/VerifyEmail';

require('dotenv').config()

const App = () => {

  return (
    <BrowserRouter >
      <FloatingButton />
      <LoadingBar showFastActions className="loading-bar" />
      <Notify />
      <Switch >
        <Route exact path="/login" render={(props) => <SystemLogin {...props} />} />
        <Route exact path="/forgot-password/:token" render={props => <ForgotPassword {...props} />} />
        <Route exact path="/verify-email/:token" render={(props) => <VerifyEmail {...props} />} />
        
        {/* <Route exact path='/new' component={NewFeed} /> */}
        <PrivateRoute exact path='/'>
          <DoctorNewFeedTab />
        </PrivateRoute>
        <PrivateRoute exact path='/timetable'>
          <DoctorTimeTable />
        </PrivateRoute>
        <PrivateRoute exact path='/package'>
          <Package />
        </PrivateRoute>
        <PrivateRoute exact path='/package/:id'>
          <PackageDetail />
        </PrivateRoute>
        <PrivateRoute exact path='/chart'>
          <ChartJs />
        </PrivateRoute>
        <PrivateRoute exact path='/profile'>
          <ViewDoctorProfile />
        </PrivateRoute>
        <PrivateRoute exact path='/newService'>
          <DoctorRequestService />
        </PrivateRoute>
        <PrivateRoute exact path="/messenger/:id">
          <Messenger />
        </PrivateRoute>
        <PrivateRoute exact path='/viewForm'>
          <ViewForm />
        </PrivateRoute>
        <PrivateRoute exact path='/viewServiceCategory'>
          <Service />
        </PrivateRoute>
        {/* <Route exact path="/" render={(props) => <DoctorDashboard {...props} />} /> */}
        <Route path="*"><NoMatch /> </Route>
      </Switch>
    </BrowserRouter>
  );
};

export default App;