import { put, takeLatest, select } from 'redux-saga/effects';
import { GET_FORM } from './action';
import { openLoading, closeLoading } from '../ui';
import _ from 'lodash'
import { message } from 'antd';
import formService from "../../service/formService"
import { getPackageResultFormSuccessful, getAppointmentResultFormSuccessful } from '.';

function* watchGetFormWorker(action) {
    try {

        yield put(openLoading());
        const {token} = yield select(state => state.auth)
        const result = yield formService.getForm(action.name, token);

        if (!_.isEmpty(result?.forms)) {            
            
            switch (action.name) {
                case 'package_result_form': {
                    yield put(getPackageResultFormSuccessful(result?.forms[0]));
                    break;
                }
                case 'appointment_result_form': {
                    yield put(getAppointmentResultFormSuccessful(result?.forms[0]));
                    break;
                }
                default:
                    break;
            }
        }

    } catch (error) {
        message.destroy();
        message.error(error?.response?.data?.err)
        console.log(error);
    } finally {
        yield put(closeLoading());
    }
}



export function* formSaga() {
    yield takeLatest(GET_FORM, watchGetFormWorker);


}