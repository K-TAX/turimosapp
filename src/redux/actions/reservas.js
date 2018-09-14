import {httpGet, httpPost,httpDelete} from '../../services/servicesHttp'
import {ENDPOINTS} from '../../constants'

export const fetchReservasAdmin = (token)=>{
    return (dispatch) => {
        httpGet(ENDPOINTS.reservas_admin,null,token).then(({data,status})=>{
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
export const limpiarReservasAnuladas = (token)=>{
    return (dispatch) => {
        httpDelete(ENDPOINTS.clean_all_anuladas,null,token).then(({data,status})=>{
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
export const cambioEstadoReserva = (token,selected,estado)=>{
    const route = estado === 1 ? ENDPOINTS.reservar :
        estado === 2 ? ENDPOINTS.anular_reserva : null;
    return (dispatch) => {
        if(route){
            const payload = {
                selected
            }
            httpPost(route,payload,token).then(({data,status})=>{
                if(status === 200){
                    dispatch({
                        type : "CAMBIO_ESTADO_RESERVA",
                        payload : {
                            reservas_admin : data
                        }
                    })
                }
            })
        }
    }
}