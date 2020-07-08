import {  OPEN_LOADING, CLOSE_LOADING } from "./action"

export const openLoading = () => {    
    return {
        type: OPEN_LOADING,
    }
}

export const closeLoading = () => {    
    return {
        type: CLOSE_LOADING,
    }
}




