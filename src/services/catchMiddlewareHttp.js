import NavigationService from './navigationService'
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
                type : "warning",
                position : "top"
            })
            break;
        case "token_expired" :
            Toast.show({
                text : "La sesión a expirado, vuelva a iniciar sesión.",
                type : "warning",
                position : "top"
            })
            // store.dispatch(authActions.cleanUserSession());
            NavigationService.navigate("Auth",{})
            break;
        case "user_not_found" :
            Toast.show({
                text : "El usuario no existe.",
                type : "warning",
                position : "top"
            })
        case "invalid.credentials" :
            Toast.show({
                text : "Credenciales Incorrectas.",
                type : "warning",
                position : 'top',
                
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