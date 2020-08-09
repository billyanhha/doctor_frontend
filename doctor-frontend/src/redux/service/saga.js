import { put, takeLatest, select } from 'redux-saga/effects';
import { openLoading, closeLoading } from '../ui';
import { NotificationManager } from 'react-notifications';
import _ from "lodash"
import { saveService, saveServiceCategory,  saveServiceRequest, } from '.';
import sService from '../../service/sService';
import { GET_SERVICE,GET_SERVICE_CATEGORY,GET_SERVICE_REQUEST, } from './action';


function* watchGetServicesWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.getService(action.data, token);
        if(!_.isEmpty(result?.services?.result)){
            yield put(saveService(result?.services?.result));

        } else {
            yield put(saveService([]));

        }
    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}


function* watchGetServicesCategoryWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.getServiceCategory(action.data, token);
        if(!_.isEmpty(result?.categorires)){
            yield put(saveServiceCategory(result?.categorires));

        } else {
            yield put(saveServiceCategory([]));

        }
    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}


function* watchGetServiceRequestWorker(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield sService.getServiceRequest(action.data, token);
        if(!_.isEmpty(result?.serviceRequest)){
            yield put(saveServiceRequest(result?.serviceRequest))
        } else {
            yield put(saveServiceRequest([]))

        }
    } catch (error) {
        NotificationManager.error(error?.response?.data?.err, 'Thông báo')
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}



export function* serviceSaga() {
    yield takeLatest(GET_SERVICE, watchGetServicesWorker);
   
    yield takeLatest(GET_SERVICE_CATEGORY, watchGetServicesCategoryWorker);
   
    yield takeLatest(GET_SERVICE_REQUEST, watchGetServiceRequestWorker);

}