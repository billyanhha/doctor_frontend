import { GET_CHAT_SUCCESSFUL, GET_MORE_CHAT_SUCCESSFUL, GET_THREAD_CHAT_SUCCESSFUL, GET_MORE_THREAD_CHAT_SUCCESSFUL, GET_USER_RELATE_DOCTOR_SUCCESSFUL, GET_UNREAD_GROUP_SUCCESSFUL, OPEN_THREAD_LOAD, CLOSE_THREAD_LOAD, SEND_CHAT_LOAD } from "./action";

const initialState = {
    chatList: [],
    isOutOfChatListData: false,
    currenThreadChat: {data: [], isOutOfData : false},
    userRelateDoctor: [],
    nonReadGroupNumber: 0,
    threadLoad: false,
    sendChatLoad: false
}

export const chatReducer = (state = initialState, action) => {
    switch(action.type) {
        case GET_CHAT_SUCCESSFUL : {
            state = {...state , chatList: action?.payload?.result, isOutOfChatListData: action?.payload?.isOutOfData};
            return state
        }
        case GET_MORE_CHAT_SUCCESSFUL : {
            state = {...state , chatList: [...state.chatList , ...action?.payload?.result], isOutOfChatListData: action?.payload?.isOutOfData};
            return state
        }
        case GET_THREAD_CHAT_SUCCESSFUL : {
            state = {...state , currenThreadChat: {data: action?.payload?.result, isOutOfData : action?.payload?.isOutOfData}};
            return state
        }
        case GET_MORE_THREAD_CHAT_SUCCESSFUL : {
            state = {...state , currenThreadChat: {data: [...action?.payload?.result , ...state?.currenThreadChat?.data  ], isOutOfData : action?.payload?.isOutOfData}};
            return state
        }
        case GET_USER_RELATE_DOCTOR_SUCCESSFUL : {
            state = {...state , userRelateDoctor: action?.payload};
            return state
        }
        case GET_UNREAD_GROUP_SUCCESSFUL : {
            state = {...state , nonReadGroupNumber: action?.payload};
            return state
        }
        case OPEN_THREAD_LOAD : {
            state = {...state , threadLoad: true};
            return state
        }
        case CLOSE_THREAD_LOAD : {
            state = {...state , threadLoad: false};
            return state
        }
        case SEND_CHAT_LOAD : {
            state = {...state , sendChatLoad: action.bool};
            return state
        }
        default:  {
            return state;
        }
    }
}
