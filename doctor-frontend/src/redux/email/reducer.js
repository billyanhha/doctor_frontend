import { VERIFY_EMAIL_SUCCESSFUL } from "./action";

const initialState = {
   verifyEmail: null
}
 
export const emailReducer = (state = initialState, action) => {
   switch (action.type) {
      case VERIFY_EMAIL_SUCCESSFUL:
         state = { ...state, verifyEmail: action?.result}
         return state;
      default: {
         return state;
      }
   }
}
