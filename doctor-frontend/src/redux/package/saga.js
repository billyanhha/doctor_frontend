import { put, takeLatest, select } from 'redux-saga/effects';
import { openLoading, closeLoading } from '../ui';
import { 
    DOCTOR_ACCEPT_PACKAGE,
    DOCTOR_REJECT_PACKAGE,
    NOT_ASSIGN_PACKAGE_QUERY,
    ASSIGN_PACKAGE_QUERY,
    NEXT_NOT_ASSIGN_PACKAGE_QUERY,
    NEXT_ASSIGN_PACKAGE_QUERY,
    GET_DOCTOR_PACKAGE,
    GET_PACKAGE_INFO,
    GET_ALL_APPOINTMENT,
    GET_PACKAGE_SERVICES,
    GET_PACKAGE_APPOINTMENTS,
    GET_PACKAGE_STATUS,
    ADD_SERVICE_PACKAGE,
    EDIT_SERVICE_PACKAGE,
    DELETE_SERVICE_PACKAGE,
    ADD_APPOINTMENT_PACKAGE,
    UPDATE_PACKAGE,
    UPDATE_APPOINTMENT_PACKAGE,
    CHANGE_PACKAGE_STATUS

    ,
} from './action';
import packageService from '../../service/packageService'
import {  
    doctorAcceptPackageSuccessful,
    doctorRejectPackageSuccessful,
    notAssignPackageQuerySuccessful,
    assignPackageQuerySuccessful,
    nextNotAssignPackageQuerySuccessful,
    nextAssignPackageQuerySuccessful,
    getDoctorPackageSuccessful,
    getPackageInfoSuccessful,
    getAllAppointmentByPackageSuccessful,
    getPackageServicesSuccessful,
    getPackageAppointmentsSuccessful,
    getPackageStatusSuccessful,
    getPackageServices,
    deleteServicePackageSuccessul,
    getPackageAppointments,
    addAppointmentPackageSuccessul,
    getPackageInfo,
    getPackageStatus
} from '.';
import _ from 'lodash'
import { message } from 'antd';
import moment from 'moment'
import { getAppointmentsFromTo } from '../doctor';
import { notAssignPackageQuery, 
    assignPackageQuery

} from '../package/index';


function* watchDoctorAcceptPackage(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth);
        const query = { sortBy: 'created_at', page: 1, searchBy: "name"};
        const result = yield packageService.doctorAcceptPackage(action?.doctorId, action?.packageId, token);
        // if (!_.isEmpty(result) && !_.isEmpty(result?.packages)) {
        console.log(result);
        if (!_.isEmpty(result) && !_.isEmpty(result?.packageStatusCreated)) {
            yield put(getPackageStatus(action?.packageId))
            yield put(doctorAcceptPackageSuccessful(result?.packages));
            yield put(getPackageAppointments(action?.packageId))
            
            yield put(notAssignPackageQuery(action?.doctorId, query));
            yield put(assignPackageQuery(action?.doctorId, query));
            message.destroy();
            message.success("Chấp nhận thành công")
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading())
    }
}

function* watchDoctorRejectPackage(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth);
        const query = { sortBy: 'created_at', page: 1, searchBy: "name"};
        const result = yield packageService.doctorRejectPackage(action?.doctorId, action?.packageId, action?.note, token);
        // if (!_.isEmpty(result) && !_.isEmpty(result.packages)) {
        console.log(result);
        if (!_.isEmpty(result) && !_.isEmpty(result.packageStatusCreated)) {
            yield put(getPackageStatus(action.packageId))
            yield put(doctorRejectPackageSuccessful(result.packages));
            yield put(getPackageAppointments(action?.packageId));

            yield put(assignPackageQuery(action?.doctorId, query));
            message.destroy();
            message.success("Đã từ chối thành công với lý do: " + action?.note);
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading())
    }
}

function* watchGetNotAsignPackageQuery(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getNotAssignPackageQuery(action.doctorId, action.query, token);
        if (!_.isEmpty(result) && !_.isEmpty(result.packages)) {
            yield put(notAssignPackageQuerySuccessful(result.packages));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading())
    }
}

function* watchGetAssignPackageQuery(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getAssignPackageQuery(action.doctorId, action.query, token);
        if (!_.isEmpty(result) && !_.isEmpty(result.packages)) {
            yield put(assignPackageQuerySuccessful(result.packages));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading())
    }
}


function* watchNextNotAssignPackageQuery(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getNotAssignPackageQuery(action.doctorId, action.query, token);
        if (!_.isEmpty(result) && !_.isEmpty(result?.packages)) {
            yield put(nextNotAssignPackageQuerySuccessful(result?.packages));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchNextAssignPackageQuery(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getAssignPackageQuery(action.doctorId, action.query, token);
        if (!_.isEmpty(result) && !_.isEmpty(result?.packages)) {
            yield put(nextAssignPackageQuerySuccessful(result?.packages));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchgetDoctorPackageQuery(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getDoctorPackage(action?.id, action.params, token);
        if (!_.isEmpty(result)) {
            yield put(getDoctorPackageSuccessful(result?.packages));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchgetPackageInfoQuery(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getPackageInfo(action?.id, token);
        if (!_.isEmpty(result?.package)) {
            yield put(getPackageInfoSuccessful(result?.package?.[0]));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}


function* watchGetAllAppointmentByPackageId(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getAllAppointmentByPackageID(action?.packageId,token);
        if (!_.isEmpty(result)) {
            yield put(getAllAppointmentByPackageSuccessful(result?.appointments));
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchgetPackageServicesWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getPackageServices(action?.id, token);
        if (!_.isEmpty(result?.services)) {
            yield put(getPackageServicesSuccessful(result?.services));
        } else {
            yield put(getPackageServicesSuccessful([]));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchgetPackageAppointmentsWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getPackageAppointments(action?.id, token);
        if (!_.isEmpty(result?.appointments)) {
            yield put(getPackageAppointmentsSuccessful(result?.appointments));
        }else {
            yield put(getPackageAppointmentsSuccessful([]));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchgetPackageStatussWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.getPackageStatus(action?.id, token);
        if (!_.isEmpty(result?.status)) {
            yield put(getPackageStatusSuccessful(result?.status));
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}


function* watchAddServicePackageWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.addServicePackage(action?.data, token);
        if (!_.isEmpty(result)) {
            yield put(getPackageServices(action?.data?.packageId))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchEditServicePackageWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.editServicePackage(action?.data, token);
        if (!_.isEmpty(result)) {
            yield put(getPackageServices(action?.data?.packageId))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}


function* watchDeleteServicePackageWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.deleteServicePackage(action?.data?.package_service_id, token);
        if (!_.isEmpty(result)) {
            yield put(deleteServicePackageSuccessul(result))
            yield put(getPackageAppointments(action?.data?.package_id))
            yield put(getPackageServices(action?.data?.package_id))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchAddAppointmentPackageWorker(action) {
    try {
        window.location.hash = '';
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.addAppointmentPackage(action?.data, token);
        if (!_.isEmpty(result.appointmentCreated?.appointment?.id)) {
            yield put(getPackageAppointments(action?.data?.packageId))
            window.location.hash = result.appointmentCreated?.appointment?.id;
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchUpdateAppointmentPackageWorker(action) {
    try {
        yield put(openLoading());
        window.location.hash = '';
        const { token } = yield select(state => state.auth)

        const result = yield packageService.updateAppointmentPackage(
            action?.doctorId,
            action?.appointmentId,
            action?.data,
            token
        );
        if (!_.isEmpty(result)) {
            yield put(getAppointmentsFromTo(action?.doctorId, 
                moment().format('YYYY-MM-DD'), moment().add(12, 'days').format('YYYY-MM-DD')));
            yield put(getPackageAppointments(action?.packageId))
            message.success("Sửa thành công")
            window.location.hash = action?.appointmentId;
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchUpdatePackageWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)

        const result = yield packageService.editPackage(action?.data, token);
        message.success("Sửa thành công");
        if (!_.isEmpty(result)) {
            yield put(getPackageInfo(action?.data?.package_id))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}

function* watchChangePackageStatusWorker(action) {
    try {
        yield put(openLoading());
        const { token } = yield select(state => state.auth)
        const result = yield packageService.changePackageStatus(action?.data, token);
        message.success("Thay đổi trạng thái thành công");
        if (!_.isEmpty(result)) {
            yield put(getPackageStatus(action?.data?.packageId))
            yield put(getPackageAppointments(action?.data?.packageId))
        }
    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}







export function* packageSaga() {
    yield takeLatest(DOCTOR_ACCEPT_PACKAGE, watchDoctorAcceptPackage);
    yield takeLatest(DOCTOR_REJECT_PACKAGE, watchDoctorRejectPackage);
    yield takeLatest(NOT_ASSIGN_PACKAGE_QUERY, watchGetNotAsignPackageQuery);
    yield takeLatest(ASSIGN_PACKAGE_QUERY, watchGetAssignPackageQuery);
    yield takeLatest(NEXT_NOT_ASSIGN_PACKAGE_QUERY, watchNextNotAssignPackageQuery);
    yield takeLatest(NEXT_ASSIGN_PACKAGE_QUERY, watchNextAssignPackageQuery);
    yield takeLatest(GET_DOCTOR_PACKAGE, watchgetDoctorPackageQuery);
    yield takeLatest(GET_PACKAGE_INFO, watchgetPackageInfoQuery);
    yield takeLatest(GET_ALL_APPOINTMENT, watchGetAllAppointmentByPackageId);
    yield takeLatest(GET_PACKAGE_SERVICES, watchgetPackageServicesWorker);
    yield takeLatest(GET_PACKAGE_APPOINTMENTS, watchgetPackageAppointmentsWorker);
    yield takeLatest(GET_PACKAGE_STATUS, watchgetPackageStatussWorker);
    yield takeLatest(ADD_SERVICE_PACKAGE, watchAddServicePackageWorker);
    yield takeLatest(EDIT_SERVICE_PACKAGE, watchEditServicePackageWorker);
    yield takeLatest(DELETE_SERVICE_PACKAGE, watchDeleteServicePackageWorker);
    yield takeLatest(ADD_APPOINTMENT_PACKAGE, watchAddAppointmentPackageWorker);
    yield takeLatest(UPDATE_APPOINTMENT_PACKAGE, watchUpdateAppointmentPackageWorker);
    yield takeLatest(UPDATE_PACKAGE, watchUpdatePackageWorker);
    yield takeLatest(CHANGE_PACKAGE_STATUS, watchChangePackageStatusWorker);
    
    
    
}