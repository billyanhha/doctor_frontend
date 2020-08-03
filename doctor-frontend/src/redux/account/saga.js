import {put, takeLatest} from "redux-saga/effects";
import {FORGOT_PASSWORD_SEND_MAIL, FORGOT_PASSWORD_SEND_PASSWORD, CHECK_EMAIL_EXPIRED} from "./action";
import {sendMailResetSuccessful, sendPasswordResetSuccessful, checkEmailExpiredSuccessful} from ".";
import accountService from "../../service/accountService";

import {message} from "antd";

import {openLoading, closeLoading} from "../ui";

function* watchSendMailReset(action) {
    try {
        yield put(openLoading());
        const result = yield accountService.sendMailReset(action);
        if (result) {
            yield put(sendMailResetSuccessful());
            message.destroy();
            message.success("Gửi yêu cầu thành công, xin hãy kiểm tra Email!", 3);
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? "Hệ thống quá tải", "Thông báo");
    } finally {
        yield put(closeLoading());
    }
}

function* watchSendPasswordReset(action) {
    try {
        yield put(openLoading());
        const result = yield accountService.sendPasswordReset(action.token, action.data);
        if (result) {
            yield put(sendPasswordResetSuccessful());
            message.destroy();
            message.success("Đặt lại mật khẩu thành công!", 2);
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err ?? "Hệ thống quá tải", "Thông báo");
    } finally {
        yield put(closeLoading());
    }
}

function* watchCheckEmailExpired(action) {
    try {
        yield put(openLoading());
        const result = yield accountService.checkEmailExpired(action.token);
        if (result) {
            yield put(checkEmailExpiredSuccessful(true));
        }
    } catch (error) {
        yield put(checkEmailExpiredSuccessful(false));
        message.destroy();
        // message.error(error?.response?.data?.err ?? "Hệ thống quá tải");
        message.error("Email xác nhận đã hết hạn, Xin hãy gửi lại yêu cầu!", 5);
    } finally {
        yield put(closeLoading());
    }
}

export function* accountSaga() {
    yield takeLatest(FORGOT_PASSWORD_SEND_MAIL, watchSendMailReset);
    yield takeLatest(FORGOT_PASSWORD_SEND_PASSWORD, watchSendPasswordReset);
    yield takeLatest(CHECK_EMAIL_EXPIRED, watchCheckEmailExpired);
}
