import { put, takeLatest, select, takeEvery } from 'redux-saga/effects';
import { GET_CHAT, GET_MORE_CHAT, GET_THREAD_CHAT, GET_MORE_THREAD_CHAT, GET_USER_RELATE_DOCTOR, GET_UNREAD_GROUP, SEND_MESSAGE, UPDATE_IS_READ } from './action';
import _ from 'lodash';
import { openLoading, closeLoading } from '../ui';
import { message } from 'antd';
import chatService from '../../service/chatService';
import { getChatSuccessful, getMoreChatSuccessful, getChat,getThreadChatSuccessful, getMoreThreadChatSuccessful, getUserRelateDoctorSuccessful, getUnreadGroupSuccessful, getThreadChat, closeThreadLoad, openThreadLoad, sendChatLoad } from '.';


function* watchGetChatWorker(action) {
    try {
        yield put(openLoading())
        const {token} = yield select(state => state.auth)
        const result = yield chatService.getChat(action.payload, token);
        if (!_.isEmpty(result?.result)) {

            yield put(getChatSuccessful(result?.result));
        } else {
            yield put(getChatSuccessful([]));

        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }

}

function* watchGetMoreChatWorker(action) {
    try {
        yield put(openLoading())
        const {token} = yield select(state => state.auth)
        const result = yield chatService.getMoreChat(action.payload , token);
        if (!_.isEmpty(result?.result)) {

            yield put(getMoreChatSuccessful(result?.result));
        } else {
            yield put(getMoreChatSuccessful([]));

        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }

}

function* watchGetThreadChatWorker(action) {
    try {
        
        yield put(openThreadLoad())
        const {token} = yield select(state => state.auth)
        const result = yield chatService.getThreadChat(action.payload , token);
        if (!_.isEmpty(result?.result)) {

            yield put(getThreadChatSuccessful(result?.result));
        } else {
            yield put(getThreadChatSuccessful([]));

        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeThreadLoad())
    }

}

function* watchGetMoreThreadChatWorker(action) {
    try {
        yield put(openThreadLoad())
        const {token} = yield select(state => state.auth)
        const result = yield chatService.getMoreThreadChat(action.payload , token);
        if (!_.isEmpty(result?.result)) {

            yield put(getMoreThreadChatSuccessful(result?.result));
        } else {
            yield put(getMoreThreadChatSuccessful([]));

        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeThreadLoad())
    }

}

function* watchUserRelateDoctorWorker(action) {
    try {
        yield put(openLoading())
        const {token} = yield select(state => state.auth)
        const result = yield chatService.getUserRelateDoctor(action.payload , token);
        if (!_.isEmpty(result?.customers)) {

            yield put(getUserRelateDoctorSuccessful(result?.customers));
        } else {
            yield put(getUserRelateDoctorSuccessful([]));

        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }

}


function* watchGetUnreadWorker(action) {
    try {
        yield put(openLoading())
        const {token} = yield select(state => state.auth)
        const result = yield chatService.getUnreadGroup(action.payload , token);
        if (!_.isEmpty(result?.result?.num_group_unread)) {

            yield put(getUnreadGroupSuccessful(result?.result?.num_group_unread));
        } else {
            yield put(getUnreadGroupSuccessful(0));

        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(closeLoading())
    }

}


function* watchSendMessageWorker(action) {
    try {
        yield put(sendChatLoad(true))
        const {token} = yield select(state => state.auth)
        const result = yield chatService.sendMessage(action.payload, action.doctor_id , token);
        if(!_.isEmpty(result?.result?.id)){
            const payloadThread = { cusId: action.cusId, doctor_id: action.doctor_id }
            yield put(getThreadChat(payloadThread))
            const payloadChat = { page: 1, id: action.doctor_id }
            yield put(getChat(payloadChat))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
        yield put(sendChatLoad(false))
    }

}


function* watchUpdateIsReadWorker(action) {
    try {
        const {token} = yield select(state => state.auth)
        const result = yield chatService.updateIsRead(action.payload , token);
        if(!_.isEmpty(result?.result)){
            const payloadChat = { page: 1, id: action.payload.doctor_id }
            yield put(getChat(payloadChat))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? 'Hệ thống quá tải, xin thử lại sau!', 3);
    } finally {
    }

}

export function* chatSaga() {

    yield takeLatest(GET_CHAT, watchGetChatWorker);
    yield takeLatest(GET_MORE_CHAT, watchGetMoreChatWorker);
    yield takeLatest(GET_THREAD_CHAT, watchGetThreadChatWorker);
    yield takeLatest(GET_MORE_THREAD_CHAT, watchGetMoreThreadChatWorker);
    yield takeLatest(GET_USER_RELATE_DOCTOR, watchUserRelateDoctorWorker);
    yield takeLatest(GET_UNREAD_GROUP, watchGetUnreadWorker);
    yield takeEvery(SEND_MESSAGE, watchSendMessageWorker);
    yield takeLatest(UPDATE_IS_READ, watchUpdateIsReadWorker);

}