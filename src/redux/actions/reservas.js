import {httpGet, httpPost,httpDelete} from '../../services/servicesHttp'
import {ENDPOINTS} from '../../constants'
import storeConfig from '../../redux/storeConfig'

export const fetchReservasAdmin = ()=>{
    const state = storeConfig.store.getState();
    return (dispatch) => {
        httpGet(ENDPOINTS.reservas_admin,null,state.auth.accessToken).then(({data,status})=>{
            if(status === 200){
                dispatch({
                    type : "FETCH_RESERVAS_ADMIN",
                    payload : {
                        reservas_admin : data
                    }
                })
            }
        })
    }
}
export const limpiarReservasAnuladas = ()=>{
    const state = storeConfig.store.getState();
    return (dispatch) => {
        httpDelete(ENDPOINTS.clean_all_anuladas,null,state.auth.accessToken).then(({data,status})=>{
            if(status === 200){
                dispatch({
                    type : "LIMPIAR_RESERVAS_ANULADAS",
                    payload : {
                        reservas_admin : data
                    }
                })
            }
        })
    }
}
export const cambioEstadoReserva = (selected,estado)=>{
    const route = estado === 1 ? ENDPOINTS.reservar :
        estado === 2 ? ENDPOINTS.anular_reserva : null;
    const state = storeConfig.store.getState();
    return async (dispatch) => {
        if(route){
            const payload = {
                selected
            }
            await new Promise(resolve=>{
                httpPost(route,payload,state.auth.accessToken).then(({data,status})=>{
                    if(status === 200){
                        dispatch({
                            type : "CAMBIO_ESTADO_RESERVA",
                            payload : {
                                reservas_admin : data
                            }
                        })
                    }
                    resolve()
                })
            })
        }
    }
}