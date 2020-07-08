import { put, takeLatest } from 'redux-saga/effects';
import { showLoading, hideLoading } from 'react-redux-loading-bar'
import { OPEN_LOADING, CLOSE_LOADING } from './action';




function* watchOpenLoadingWorker() {
    yield put(showLoading())

}

function* watchCloseLoadingWorker() {
    yield put(hideLoading())
}




export function* uiSaga() {
    yield takeLatest(OPEN_LOADING, watchOpenLoadingWorker);
    yield takeLatest(CLOSE_LOADING, watchCloseLoadingWorker);

}