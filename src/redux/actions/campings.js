import {httpGet} from '../../services/servicesHttp'
import {ENDPOINTS} from '../../constants'

export const fetchCampings = ()=>{
    return async (dispatch) => {
        await new Promise(resolve=>{
            httpGet(ENDPOINTS.campings).then(({data : campings,status})=>{
                if(status === 200){
                    dispatch({
                        type : "FETCH_CAMPINGS",
                        payload : {
                            campings
                        }
                    })
                }
                resolve()
            })
        })
    }
}