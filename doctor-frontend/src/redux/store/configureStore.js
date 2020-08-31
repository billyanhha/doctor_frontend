import { createStore, applyMiddleware, combineReducers } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web and AsyncStorage for react-native
import createSagaMiddleware from 'redux-saga';
import { rootSaga } from '../rootSaga';
import { uiReducer } from '../ui/reducer';
import { loadingBarReducer } from 'react-redux-loading-bar';
import { authReducer } from '../auth/reducer';
import { doctorReducer } from '../doctor/reducer';
import {packageReducer} from '../package/reducer';
import {patientReducer} from '../patient/reducer';
import { formReducer } from '../form/reducer';
import { notifyReducer } from '../notification/reducer';
import { accountReducer } from '../account/reducer';
import { chatReducer } from '../chat/reducer';
import { serviceReducer } from '../service/reducer';
import { emailReducer } from '../email/reducer';
import { callReducer } from '../call/reducer';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'doctor', 'call'] // only navigation will be persisted
};

const rootReducers = combineReducers({
  ui: uiReducer,
  loadingBar: loadingBarReducer,
  auth: authReducer,
  doctor: doctorReducer,
  package: packageReducer,
  patient: patientReducer,
  form: formReducer,
  notify: notifyReducer,
  account: accountReducer,
  chat: chatReducer,
  service: serviceReducer,
  email : emailReducer,
  call: callReducer
});

const saga = createSagaMiddleware();
const persistedReducer = persistReducer(persistConfig, rootReducers);
const store = createStore(persistedReducer, applyMiddleware(saga));
saga.run(rootSaga);

export default () => {
  let persistor = persistStore(store);
  return { store, persistor };
};
