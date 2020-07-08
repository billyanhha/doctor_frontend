import {
    GET_PATIENT_INFO_SUCCESSFUL
} from "./action";
import _ from "lodash"


const initialState = {
    patientInfo: {},
}

export const patientReducer = (state = initialState, action) => {
    if (action.type === GET_PATIENT_INFO_SUCCESSFUL) {
        let newState = { ...state, patientInfo: action?.patientInfo }
        return newState;
    }else{
        return state;
    }

}