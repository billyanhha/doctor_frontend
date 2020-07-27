import { all } from 'redux-saga/effects';
import { uiSaga } from './ui/saga';
import { loadingBarMiddleware } from 'react-redux-loading-bar';
import { authSaga } from './auth/saga';
import { doctorSaga } from './doctor/saga';
import {packageSaga} from './package/saga';
import {patientSaga} from './patient/saga';
import { formSaga } from './form/saga';
import { accountSaga } from './account/saga';

export function* rootSaga() {
  yield all([
    loadingBarMiddleware(),
    authSaga(),
    doctorSaga(),
    uiSaga(),
    packageSaga(),
    patientSaga(),
    formSaga(),
    accountSaga()
  ]);
}
