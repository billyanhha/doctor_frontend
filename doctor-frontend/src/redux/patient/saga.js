import { put, takeLatest, select } from 'redux-saga/effects';
import { openLoading, closeLoading } from '../ui';
import { GET_PATIENT_INFO,
} from './action';
import patientService from '../../service/patientService'
import { getPatientInfoSuccessful 
} from '.';

import _ from 'lodash';

function* watchPatientInfo(action) {
    try {
        yield put(openLoading())
        const { token } = yield select(state => state.auth)
        const result = yield patientService.getPatientInfo(action?.patientId,token);   
        if (!_.isEmpty(result) && !_.isEmpty(result?.patient)) {
            yield put(getPatientInfoSuccessful(result?.patient));
        }
    } catch (error) {
        console.log(error);
    } finally {
        yield put(closeLoading())
    }
}

export function* patientSaga() {
    yield takeLatest(GET_PATIENT_INFO, watchPatientInfo);
}