import {httpGet} from '../../services/servicesHttp'
import {ENDPOINTS} from '../../constants'

export const fetchCabanas = ()=>{
    return async (dispatch) => {
        await new Promise(resolve=>{
            httpGet(ENDPOINTS.cabanas).then(({data : cabanas,status})=>{
                if(status === 200){
                    dispatch({
                        type : "FETCH_CABANAS",
                        payload : {
                            cabanas
                        }
                    })
                }
                resolve()
            })
        })
    }
}