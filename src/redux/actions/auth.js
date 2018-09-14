import {httpPost} from '../../services/servicesHttp'
import {ENDPOINTS} from '../../constants'
export const setUserSession = (email,password)=>{
    const payload = { email , password }; 
    return (dispatch) => {
        httpPost(ENDPOINTS.authenticate,payload).then(({data,status})=>{
            if(status === 200){
                dispatch({
                    type : "SET_USER_SESSION",
                    payload : {
                        token : data.token,
                        user : data.user
                    }
                })
            }
        })
    }
}
export const cleanUserSession = ()=>{
    return (dispatch)=>{
        dispatch({
            type : "CLEAN_USER_SESSION",
            payload : {
                token : null,
                user : null
            }
        })
    }
}