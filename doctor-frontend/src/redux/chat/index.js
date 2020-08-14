import { GET_CHAT, GET_MORE_CHAT, GET_CHAT_SUCCESSFUL,
     GET_MORE_CHAT_SUCCESSFUL, GET_THREAD_CHAT_SUCCESSFUL,
      GET_THREAD_CHAT, GET_MORE_THREAD_CHAT, GET_MORE_THREAD_CHAT_SUCCESSFUL,
       GET_USER_RELATE_DOCTOR, GET_USER_RELATE_DOCTOR_SUCCESSFUL,
        SEND_MESSAGE, GET_UNREAD_GROUP, GET_UNREAD_GROUP_SUCCESSFUL, OPEN_THREAD_LOAD, CLOSE_THREAD_LOAD, SEND_CHAT_LOAD, UPDATE_IS_READ } from "./action"

export const getChat = (payload) => {    
    return {
        type: GET_CHAT,
        payload
    }
}

export const getMoreChat = (payload) => {    
    return {
        type: GET_MORE_CHAT,
        payload
    }
}

export const getChatSuccessful = (payload) => {    
    return {
        type: GET_CHAT_SUCCESSFUL,
        payload
    }
}

export const getMoreChatSuccessful = (payload) => {    
    return {
        type: GET_MORE_CHAT_SUCCESSFUL,
        payload
    }
}




export const getThreadChat = (payload) => {    
    return {
        type: GET_THREAD_CHAT,
        payload
    }
}



export const getThreadChatSuccessful = (payload) => {    
    return {
        type: GET_THREAD_CHAT_SUCCESSFUL,
        payload
    }
}



export const getMoreThreadChat = (payload) => {    
    return {
        type: GET_MORE_THREAD_CHAT,
        payload
    }
}



export const getMoreThreadChatSuccessful = (payload) => {    
    return {
        type: GET_MORE_THREAD_CHAT_SUCCESSFUL,
        payload
    }
}


export const getUserRelateDoctor = (payload) => {
    return {
        type: GET_USER_RELATE_DOCTOR,
        payload
    }
}

export const getUserRelateDoctorSuccessful = (payload) => {
    return {
        type: GET_USER_RELATE_DOCTOR_SUCCESSFUL,
        payload
    }
}

export const sendMessage = (payload, cusId, doctor_id) => {
    return {
        type: SEND_MESSAGE,
        payload,
        cusId,
        doctor_id
    }
}

export const getUnreadGroup = (payload) => {
    return {
        type: GET_UNREAD_GROUP,
        payload,
    }
}

export const getUnreadGroupSuccessful = (payload) => {
    return {
        type: GET_UNREAD_GROUP_SUCCESSFUL,
        payload
    }
}

export const openThreadLoad = () => {
    return {
        type: OPEN_THREAD_LOAD,
    }
}

export const closeThreadLoad = () => {
    return {
        type: CLOSE_THREAD_LOAD,
    }
}

export const sendChatLoad = (bool) => {
    return {
        type: SEND_CHAT_LOAD,
        bool
    }
}

export const updateIsRead = (payload) => {
    return {
        type: UPDATE_IS_READ,
        payload
    }
}

