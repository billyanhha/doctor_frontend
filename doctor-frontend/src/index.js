import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import configureStore from './redux/store/configureStore';
import { PersistGate } from 'redux-persist/integration/react';
import 'antd/dist/antd.css'; // Import Ant Design styles by less entry
import 'react-chat-elements/dist/main.css';
import { ConfigProvider } from 'antd';
import vi_VN from 'antd/es/locale/vi_VN';
const { store, persistor } = configureStore();


ReactDOM.render(
  <ConfigProvider locale={vi_VN}>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor} >
        <App />
      </PersistGate>
    </Provider>
  </ConfigProvider>
  ,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
