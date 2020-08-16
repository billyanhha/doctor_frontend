import { put, takeLatest, select} from 'redux-saga/effects';
import authService from '../../service/authService'
import { openLoading, closeLoading } from '../ui';
import { message } from 'antd';
import { clearDoctorLogin } from '../doctor';
import { doctorLoginSuccessful } from '.';
import { DOCTOR_LOGIN, DOCTOR_LOGOUT } from './action';
import { clearIoInstance } from '../notification';



function* watchDoctorLoginWorker(action) {
    try {
        yield put(openLoading())
        message.loading('Xin vui lòng chờ');
        const result = yield authService.doctorLogin(action.doctor);

        if (result && result.token) {            
            yield put(doctorLoginSuccessful(result.token));
            message.destroy();
            message.success('Đăng nhập thành công');
        }

    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        // message.destroy()
        yield put(closeLoading())
    }
}

function* watchDoctorLogoutWorker() {
    try {
        const { io } = yield select(state => state.notify)
        if(io){
            io.emit("logout", "");
        }
        yield put(openLoading())
        yield put(clearDoctorLogin())
        yield put(clearIoInstance())

    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading())
    }
}

export function* authSaga() {
    yield takeLatest(DOCTOR_LOGIN, watchDoctorLoginWorker);
    yield takeLatest(DOCTOR_LOGOUT, watchDoctorLogoutWorker);
}