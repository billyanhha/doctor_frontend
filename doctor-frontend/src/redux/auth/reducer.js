
import _ from "lodash"
import { DOCTOR_LOGIN_SUCCESSFUL, DOCTOR_LOGOUT } from "./action";


const initialState = {
   isLoggedIn: false,
   token: '',
   stepRegister: 0,
}
 
export const authReducer = (state = initialState, action) => {
   switch (action.type) {
      case DOCTOR_LOGIN_SUCCESSFUL: {
         let newState = { ...state, isLoggedIn: true, token: action?.token }
         return newState;
      } 
      case DOCTOR_LOGOUT: {
         let newState = { ...state, isLoggedIn: false, token: '' }
         return newState;
      } 
      default: {
         return state;
      }
   }
}
