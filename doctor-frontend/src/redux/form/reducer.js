import { GET_PACKAGE_RESULT_FORM_SUCCESSFUL, GET_APPOINTMENT_RESULT_FORM_SUCCESSFUL } from "./action";



const initialState = {
    packageResultForm: {},
    appointmentResultForm: {},
    currentForm: {}
}

export const formReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_PACKAGE_RESULT_FORM_SUCCESSFUL : {           
            // state = {...state , packageResultForm: action.data};
            state = {...state , packageResultForm: action.data, currentForm: action.data};
            return state
        }
        case GET_APPOINTMENT_RESULT_FORM_SUCCESSFUL : {
            state = {...state , appointmentResultForm: action.data};
            state = {...state , appointmentResultForm: action.data, currentForm: action.data};
            return state
        }
        default:  {
            return state;
        }
    }
}
