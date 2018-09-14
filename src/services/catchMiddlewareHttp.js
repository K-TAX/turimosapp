import * as uiActions from '../redux/actions/ui'
import * as authActions from '../redux/actions/auth'
import storeConfig from '../redux/storeConfig'
import { Toast } from 'native-base';

export default (errorResponse)=>{
    const { store } = storeConfig;
    const {data} = errorResponse;
    switch(data.error){
        case "token_not_provided" :
            Toast.show({
                text : "Usted no está logeado , debe iniciar sesión.",
                type : "warning"
            })
            break;
        case "token_expired" :
            Toast.show({
                text : "La sesión a expirado, vuelva a iniciar sesión.",
                type : "warning"
            })
            setTimeout(()=>{
                store.dispatch(authActions.cleanUserSession())
            },2100)
            break;
        case "user_not_found" :
            Toast.show({
                text : "El usuario no existe.",
                type : "warning"
            })
        case "invalid.credentials" :
            Toast.show({
                text : "Credenciales Incorrectas.",
                type : "warning"
            })
            break;
        case "file_exist" :
            Toast.show({
                text : "Este titulo ya existe.",
                type : "warning"
            })
            break;
    }
}