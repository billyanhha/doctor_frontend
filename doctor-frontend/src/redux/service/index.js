import { SET_CURRENT_SERVICE_PAGE, GET_SERVICE, SAVE_SERVICE, ADD_SERVICE, EDIT_SERVICE, SAVE_SERVICE_CATEGORY, GET_SERVICE_CATEGORY, ADD_SERVICE_CATEGORY, EDIT_SERVICE_CATEGORY, GET_SERVICE_REQUEST, SAVE_SERVICE_REQUEST, EDIT_SERVICE_REQUEST } from "./action"

export const setCurrentServicePage = (index) => {    
    return {
        type: SET_CURRENT_SERVICE_PAGE,
        index
    }
}

export const getService = (data) => {    
    return {
        type: GET_SERVICE,
        data
    }
}

export const saveService = (services) => {    
    return {
        type: SAVE_SERVICE,
        services
    }
}


export const getServiceCategory = (data) => {    
    return {
        type: GET_SERVICE_CATEGORY,
        data
    }
}

export const saveServiceCategory = (categorires) => {    
    return {
        type: SAVE_SERVICE_CATEGORY,
        categorires
    }
}



export const getServiceRequest = (data) => {    
    return {
        type: GET_SERVICE_REQUEST,
        data
    }
}

export const saveServiceRequest = (requests) => {    
    return {
        type: SAVE_SERVICE_REQUEST,
        requests
    }
}




