import { put, takeLatest, select } from 'redux-saga/effects';
import { openLoading, closeLoading } from '../ui';
import { GET_DOCTOR_NOTIFICATION, GET_MORE_DOCTOR_NOTIFICATION, MARK_READ_NOTIFY, MARK_ALL_READ, COUNT_UNREAD_NOTIFY } from './action';
import notifycationService from '../../service/notifycationService';
import _ from "lodash"
import { getDoctorNotificationSuccessful, getMoreDoctorNotificationSuccessful, getDoctorNotification, countUnreadNotifySuccessful, countUnreadNotify } from '.';
import { message } from 'antd';


function* watchGetDoctorNotifyWorker(action) {
    try {
        const { token } = yield select(state => state.auth)
        const result = yield notifycationService.getDoctorNotify(action?.data, token);
        if (!_.isEmpty(result?.notifications?.result)) {
            yield put(getDoctorNotificationSuccessful(result?.notifications))
        } else {
            yield put(getDoctorNotificationSuccessful({ result: [], isOutOfData: true }))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
    }
}

function* watchGetMoreDoctorNotifyWorker(action) {
    try {
        const { token } = yield select(state => state.auth)
        const result = yield notifycationService.getDoctorNotify(action?.data, token);
        if (!_.isEmpty(result?.notifications)) {
            yield put(getMoreDoctorNotificationSuccessful(result?.notifications))
        } else {
            yield put(getMoreDoctorNotificationSuccessful({ result: [], isOutOfData: true }))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
    }
}

function* watchMarkReadNotify(action) {
    try {
        const { token } = yield select(state => state.auth)
        const result = yield notifycationService.markReadNotify(action?.data, token);
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
    }
}


function* watchmarkAllReadNotify(action) {
    try {
        const { token } = yield select(state => state.auth)
        const result = yield notifycationService.markAllRead(action?.data, token);
        if (!_.isEmpty(result?.notificationsUpdated)) {
            yield put(getDoctorNotification(action?.data))
            yield put(countUnreadNotify({receiver_id: action?.data.id}))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
    }
}

function* watchcountUnreadNotifyWorker(action) {
    try {
        const { token } = yield select(state => state.auth)
        const result = yield notifycationService.countUnreadNotify(action?.data, token);
        if (result?.num) {
            yield put(countUnreadNotifySuccessful(result?.num))
        } else {
            yield put(countUnreadNotifySuccessful(0))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err.toString())
        console.log(error);
    } finally {
    }
}


export function* notifySaga() {
    yield takeLatest(GET_DOCTOR_NOTIFICATION, watchGetDoctorNotifyWorker);
    yield takeLatest(GET_MORE_DOCTOR_NOTIFICATION, watchGetMoreDoctorNotifyWorker);
    yield takeLatest(MARK_READ_NOTIFY, watchMarkReadNotify);
    yield takeLatest(MARK_ALL_READ, watchmarkAllReadNotify);
    yield takeLatest(COUNT_UNREAD_NOTIFY, watchcountUnreadNotifyWorker);
}