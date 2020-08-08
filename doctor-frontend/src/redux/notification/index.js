import { SAVE_IO_INSTANCE, CLEAR_IO_INSTANCE, GET_DOCTOR_NOTIFICATION, GET_DOCTOR_NOTIFICATION_SUCCESSFUL, GET_MORE_DOCTOR_NOTIFICATION, GET_MORE_DOCTOR_NOTIFICATION_SUCCESSFUL, MARK_READ_NOTIFY, MARK_ALL_READ, COUNT_UNREAD_NOTIFY, COUNT_UNREAD_NOTIFY_SUCCESSFUL } from "./action"

export const saveIoInstance = (data) => {
    return {
        type: SAVE_IO_INSTANCE,
        data
    }
}

export const clearIoInstance = () => {
    return {
        type: CLEAR_IO_INSTANCE,
    }
}

export const getDoctorNotification = (data) => {
    return {
        type: GET_DOCTOR_NOTIFICATION,
        data
    }
}

export const getDoctorNotificationSuccessful = (data) => {
    return {
        type: GET_DOCTOR_NOTIFICATION_SUCCESSFUL,
        data
    }
}

export const getMoreDoctorNotification = (data) => {
    return {
        type: GET_MORE_DOCTOR_NOTIFICATION,
        data
    }
}

export const getMoreDoctorNotificationSuccessful = (data) => {
    return {
        type: GET_MORE_DOCTOR_NOTIFICATION_SUCCESSFUL,
        data
    }
}


export const markReadNotify = (data) => {
    return {
        type: MARK_READ_NOTIFY,
        data
    }
}


export const markAllRead = (data) => {
    return {
        type: MARK_ALL_READ,
        data
    }
}

export const countUnreadNotify = (data) => {
    return {
        type: COUNT_UNREAD_NOTIFY,
        data
    }
}

export const countUnreadNotifySuccessful = (data) => {
    return {
        type: COUNT_UNREAD_NOTIFY_SUCCESSFUL,
        data
    }
}