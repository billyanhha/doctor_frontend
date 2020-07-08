import { put, takeLatest, all, select } from 'redux-saga/effects';
import { openLoading, closeLoading } from '../ui';
import doctorService from '../../service/doctorService'
import sService from '../../service/sService';
import _ from 'lodash'
import { doctorLogout } from '../auth';
import { message } from 'antd';
import {
    GET_DOCTOR_LOGIN,
    GET_APPOINTMENTS_FROM_TO, 
    GET_APPOINTMENTS_DETAIL, 
    GET_PATIENT_DETAIL,
    GET_DOCTOR_DETAIL,
    CHANGE_DOCTOR_PASSWORD,
    REQUEST_NEW_SERVICE,
    DOCTOR_GET_ALL_SERVICE_REQUEST
} from './action';
import {
    getDoctorLoginSuccessful,
    getAppointmentsDetailSuccessful, 
    getPatientDetailSuccessful, 
    getAppointmentsFromToSuccessful,
    getDoctorDetailSuccessful,
    changeDoctorPasswordSuccessfull,
    getAllServiceRequestSuccessfully
} from '.';
import { notAssignPackageQuery, 
    assignPackageQuery,
    getAllAppointmentByPackage 
} from '../package/index';

function* wachGetDoctorLoginbWorker(action) {
    let query = { sortBy: "created_at", page: 1, searchBy: "name",duplicated:false };
    let query2 = { sortBy: "created_at", page: 1, searchBy: "name",duplicated:true };
    try {
        yield put(openLoading())

        if (action.token) {
            const result = yield doctorService.getDoctorByJwt(action.token);
            if (result && result.data) {
                yield all([
                    put(getDoctorLoginSuccessful(result.data)),
                    //Cac ham khoi tao gia tri ban dau cho Newfeed
                    put(assignPackageQuery(result.data.id, query2)),
                    put(notAssignPackageQuery(result.data.id, query2)),
                    put(assignPackageQuery(result.data.id, query)),  
                    put(notAssignPackageQuery(result.data.id, query)),
                ]);
            }
        }
    } catch (error) {
        if (error.toString().includes('status code 401')) {
            yield put(doctorLogout());
            message.error('Phiên đã hết hạn , vui lòng đăng nhập lại', 3)
        }
        console.log(error);
    } finally {
        // do long running stuff
        yield put(closeLoading())
    }
}

function* watchGetAppointmentsFromTo(action) {
    try {
        yield put(openLoading());
        if (action.docID && action.dateFrom && action.dateTo) {
            const {token} = yield select(state => state.auth)
            const result = yield doctorService.getAppointmentsTimeTable(action, token);
            if (result && result.appointments) {
                yield put(getAppointmentsFromToSuccessful(result.appointments));
            } else {
                message.destroy();
                message.error('Không thể lấy dữ liệu cuộc hẹn', 3);
            }
        }
    } catch (error) {
        message.error('Hệ thống quá tải, xin hãy thử lại', 3);
        console.log(error);
    } finally {
        yield put(closeLoading())
    }
}

function* watchGetAppointmentsDetail(action) {
    try {
        // const doctorID = yield select(state => state?.currentDoctor?.id);
        yield put(openLoading());
        if (action.appointmentsID) {
            const {token} = yield select(state => state.auth)
            const result = yield doctorService.getAppointmentsDetail(action.appointmentsID, token);
            if (result) {
                
                yield put(getAppointmentsDetailSuccessful(result));
            }
        } else {
            message.destroy();
            message.error('Không có cuộc hẹn này!', 3);
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchGetPatientDetail(action) {
    try {
        yield put(openLoading());
        if (action.patientID) {
            const {token} = yield select(state => state.auth)
            const result = yield doctorService.getPatientDetail(action.patientID, token);
            if (result) {
                yield put(getPatientDetailSuccessful(result));
            }
        } else {
            message.destroy();
            message.error('Không có bệnh nhân này!', 3);
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchGetDoctorDetailWorker(action) {
    try {
        yield put(openLoading());
        const result = yield doctorService.getDoctorDetail(action?.id);
        console.log("thoong tin bac si:", result);
        if (!_.isEmpty(result)) {
            yield put(getDoctorDetailSuccessful(result));
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchChangeDoctorPassword(action) {
    try {
        yield put(openLoading());
        const result = yield doctorService.changePassword(action?.doctorId,action?.curPass,action?.newPass,action?.confirmPass,action?.token);
        console.log('result update pass',result);
        if (!_.isEmpty(result)) {
            yield put(changeDoctorPasswordSuccessfull(result));
            message.success("Đổi mật khẩu thành công");
        }
    } catch (error) {
        message.error(error?.response?.data?.err)
        console.log(error?.response?.data?.err);
    } finally {
        yield put(closeLoading());
    }
}

function* watchRequestNewSerice(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield doctorService.requestNewService(action?.doctorId, action?.data, token);
        message.success("Gửi yêu cầu thành công");
        // if (!_.isEmpty(result)) {
        //     yield put(requestNewService(action?.data?.packageId))
        // }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchDoctorGetAllServiceRequest(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield doctorService.getAllServiceRequest(action?.doctorId, token);
        if (!_.isEmpty(result)) {
            yield put(getAllServiceRequestSuccessfully(result?.serviceRequest))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

// function* watchDoctorGetAllService(action) {
//     try {
//         yield put(openLoading());
//         const result = yield sService.getServiceForHome();
//         console.log('result update pass',result);
//         if (!_.isEmpty(result)) {
//             yield put(changeDoctorPasswordSuccessfull(result));
//             message.success("Đổi mật khẩu thành công");
//         }
//     } catch (error) {
//         message.error(error?.response?.data?.err)
//         console.log(error?.response?.data?.err);
//     } finally {
//         yield put(closeLoading());
//     }
// }


export function* doctorSaga() {
    yield takeLatest(GET_DOCTOR_LOGIN, wachGetDoctorLoginbWorker);
    yield takeLatest(GET_APPOINTMENTS_FROM_TO, watchGetAppointmentsFromTo);
    yield takeLatest(GET_APPOINTMENTS_DETAIL, watchGetAppointmentsDetail);
    yield takeLatest(GET_PATIENT_DETAIL, watchGetPatientDetail);
    yield takeLatest(GET_DOCTOR_DETAIL, watchGetDoctorDetailWorker);
    yield takeLatest(CHANGE_DOCTOR_PASSWORD, watchChangeDoctorPassword);
    yield takeLatest(REQUEST_NEW_SERVICE, watchRequestNewSerice);
    yield takeLatest(DOCTOR_GET_ALL_SERVICE_REQUEST, watchDoctorGetAllServiceRequest);
    
    
}