import {put, takeLatest} from "redux-saga/effects";
import {openLoading, closeLoading} from "../ui";
import { message } from 'antd';


import {VERIFY_EMAIL} from "./action";
import doctorService from "../../service/doctorService";
import { verifyEmailSuccessful } from ".";

function* watchVerifyEmail(action) {
    try {
        yield put(openLoading());
        const result = yield doctorService.verifyEmail(action.tokenEmail);
        if (result) {
            message.destroy();
            yield put(verifyEmailSuccessful(true));
            message.success('Xác thực email thành công! Bạn đã có thể đăng nhập vào hệ thống', 5);
        }
    } catch (error) {
        yield put(verifyEmailSuccessful(error?.response?.data?.err ?? false));
        message.destroy();
        message.error(error?.response?.data?.err, 4)
    } finally {
        yield put(closeLoading())
    }
}

export function* emailSaga() {
    yield takeLatest(VERIFY_EMAIL, watchVerifyEmail);
}
