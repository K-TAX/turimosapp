import {httpPost} from '../../services/servicesHttp'
import {ENDPOINTS} from '../../constants'
export const setUserSession = (email,password,nav)=>{
    const payload = { email , password }; 
    return (dispatch) => {
        httpPost(ENDPOINTS.authenticate,payload).then(({data,status})=>{
            if(status === 200){
                dispatch({
                    type : "SET_USER_SESSION",
                    payload : {
                        accessToken : data.token,
                        user : data.user
                    }
                })
                nav.navigate("App")
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