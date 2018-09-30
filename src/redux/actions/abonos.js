import {httpGet, httpPost,httpDelete} from '../../services/servicesHttp'
import {ENDPOINTS} from '../../constants'
import storeConfig from '../../redux/storeConfig'
import {Toast} from 'native-base'

export const fetchAbonos = (reservaId)=>{
    const state = storeConfig.store.getState();
    return async (dispatch) => {
        await new Promise(resolve=>{
            httpGet(ENDPOINTS.abonos,reservaId,state.auth.accessToken).then(({data,status})=>{
                if(status === 200){
                    let montoAbonado = data.length ? data.map(x=>x.Monto).reduce((a,b)=>parseInt(a,10)+parseInt(b,10)) : 0;
                    dispatch({
                        type : "FETCH_ABONOS",
                        payload : {
                            abonos : {
                                ...state.abonos.abonos,
                                [reservaId] : {
                                    data,
                                    montoAbonado,
                                }
                            }
                        }
                    })
                }
                resolve()
            })
        })
    }
}
export const addAbono = (monto,reservaId)=>{
    const state = storeConfig.store.getState();
    return async (dispatch) => {
        await new Promise(resolve=>{
            const payload = {
                monto,
                reservaId
            }
            httpPost(ENDPOINTS.add_abono,payload,state.auth.accessToken).then(({data,status})=>{
                if(status === 200){
                    let montoAbonado = data.length ? data.map(x=>x.Monto).reduce((a,b)=>parseInt(a,10)+parseInt(b,10)) : 0;
                    dispatch({
                        type : "ADD_ABONO",
                        payload : {
                            abonos : {
                                ...state.abonos.abonos,
                                [reservaId] : {
                                    data,
                                    montoAbonado,
                                }
                            }
                        }
                    })
                    Toast.show({
                        type : "success",
                        text : "Abono Agregado Exitosamente.",
                        position : "top",
                        duration : 2000
                    })
                }
                resolve()
            })
        })
    }
}
export const deleteAbono = (abonoId,reservaId)=>{
    const state = storeConfig.store.getState();
    return async (dispatch) => {
        await new Promise(resolve=>{
            httpDelete(ENDPOINTS.delete_abono,abonoId,state.auth.accessToken).then(({data,status})=>{
                if(status === 200){
                    let montoAbonado = data.length ? data.map(x=>x.Monto).reduce((a,b)=>parseInt(a,10)+parseInt(b,10)) : 0;
                    dispatch({
                        type : "DELETE_ABONO",
                        payload : {
                            abonos : {
                                ...state.abonos.abonos,
                                [reservaId] : {
                                    data,
                                    montoAbonado,
                                }
                            }
                        }
                    })
                }
                resolve()
            })
        })
    }
}
