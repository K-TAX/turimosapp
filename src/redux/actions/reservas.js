import {httpGet, httpPost,httpDelete} from '../../services/servicesHttp'
import {ENDPOINTS} from '../../constants'
import storeConfig from '../../redux/storeConfig'
import {Toast} from 'native-base'
import moment from 'moment'
import {enumerateDaysBetweenDates} from '../../services/dateServices'

async function getReservasReservadas(id,reservasRef){
    return await new Promise(resolve=>{
      httpGet(ENDPOINTS.reservas_reservadas,id).then(({data,status})=>{
        if(status === 200){
          reservasRef.reservas.push(...data);
          resolve();
        }
      })
    })
  }

export const fetchAndMakeReservasPeriods = ()=>{
    const state = storeConfig.store.getState();
    return async (dispatch) => {
        await new Promise(async resolve=>{
                const {cabanas} = state.cabanas;
                if(cabanas.length > 0){
                let reservasRef = { reservas : []};
                let promises = []
                cabanas.forEach(cabana=>{
                    promises.push(getReservasReservadas(cabana.Id,reservasRef))
                })
                await Promise.all(promises);
                dispatch({
                    type : "FETCH_AND_MAKE_RESERVAS_PERIODS",
                    payload : {
                        reservasPeriods : await mapReservas(reservasRef.reservas)
                    }
                })
                resolve()
            }
        });
    }
}
export const fetchAndMakeReservasPeriodsCampings = ()=>{
    const state = storeConfig.store.getState();
    return async (dispatch) => {
        await new Promise(async resolve=>{
                const {campings} = state.campings;
                if(campings.length > 0){
                let reservasRef = { reservas : []};
                let promises = []
                campings.forEach(camping=>{
                    promises.push(getReservasReservadas(camping.Id,reservasRef))
                })
                await Promise.all(promises);
                dispatch({
                    type : "FETCH_AND_MAKE_RESERVAS_PERIODS_CAMPINGS",
                    payload : {
                        reservasPeriodsCampings : await mapReservasCampings(reservasRef.reservas)
                    }
                })
                resolve()
            }
        });
    }
}
export const fetchReservasAdmin = ()=>{
    const state = storeConfig.store.getState();
    return async (dispatch) => {
        await new Promise(resolve=>{
            httpGet(ENDPOINTS.reservas_admin,null,state.auth.accessToken).then(({data,status})=>{
                if(status === 200){
                    dispatch({
                        type : "FETCH_RESERVAS_ADMIN",
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
export const fetchReservasAdminCampings = ()=>{
    const state = storeConfig.store.getState();
    return async (dispatch) => {
        await new Promise(resolve=>{
            httpGet(ENDPOINTS.reservas_admin_campings,null,state.auth.accessToken).then(({data,status})=>{
                if(status === 200){
                    dispatch({
                        type : "FETCH_RESERVAS_ADMIN_CAMPINGS",
                        payload : {
                            reservas_admin_campings : data
                        }
                    })
                }
                resolve()
            })
        })
    }
}
export const limpiarReservasAnuladas = (isCamping)=>{
    const state = storeConfig.store.getState();
    return (dispatch) => {
        httpDelete(ENDPOINTS.clean_all_anuladas,isCamping ? 1:0,state.auth.accessToken).then(({data,status})=>{
            if(status === 200){
                dispatch({
                    type : "LIMPIAR_RESERVAS_ANULADAS",
                    payload : {
                        [isCamping?"reservas_admin_campings":"reservas_admin"] : data
                    }
                })
            }
        })
    }
}
export const cambioEstadoReserva = (selected,estado,isCamping = false)=>{
    const route = estado === 1 ? ENDPOINTS.reservar :
        estado === 2 ? ENDPOINTS.anular_reserva : null;
    const state = storeConfig.store.getState();
    return async (dispatch) => {
        if(route){
            const payload = {
                selected,
                isCamping
            }
            await new Promise(resolve=>{
                httpPost(route,payload,state.auth.accessToken).then(async ({data,status})=>{
                    if(status === 200){
                        dispatch({
                            type : "CAMBIO_ESTADO_RESERVA",
                            payload : {
                                [isCamping?"reservas_admin_campings":"reservas_admin"] : data.data
                            }
                        })
                        if(isCamping)
                        await storeConfig.store.dispatch(fetchAndMakeReservasPeriodsCampings())
                        else
                        await storeConfig.store.dispatch(fetchAndMakeReservasPeriods())

                        Toast.show({
                            type : data.success ? "success" : "warning",
                            text : data.message,
                            position : "top",
                            duration : data.success ? 3000 : 6800
                        })
                    }
                    resolve()
                }).catch(err=>{
                    resolve()
                })
            })
        }
    }
}

const colors = {alerces : "#bf360c",arrayanes : "#005662",casona : "#00c853"}

const mapReservas = async (reservasPeriods)=>{
    return new Promise(resolve=>{
      const obj = {};
      reservasPeriods.forEach(reserva=>{
        let index = reserva.Cabana === "alerces" ? 0 :reserva.Cabana === "arrayanes" ? 1 : 2;
        if(typeof obj[reserva.Llegada] !== "object"){
          obj[reserva.Llegada] = {};
        }
        if(!Array.isArray(obj[reserva.Llegada].periods)){
          obj[reserva.Llegada].periods = [
            { color: 'transparent' },
            { color: 'transparent' },
            { color: 'transparent' }
          ]
        }
        if(reserva.Salida === reserva.Llegada){
          obj[reserva.Llegada].periods[index] = {startingDay: true,endingDay: true, color: colors[reserva.Cabana]}
        }else{
          obj[reserva.Llegada].periods[index] = {startingDay: true,endingDay: false,color: colors[reserva.Cabana]}
        }
        if(reserva.Salida > reserva.Llegada){
          let betweenDates = enumerateDaysBetweenDates(reserva.Llegada,reserva.Salida);
          betweenDates.forEach((date,i)=>{
            let strDate = moment(date).format("YYYY-MM-DD").toString();
            if(typeof obj[strDate] !== "object"){
              obj[strDate] = {};
            }
            if(!Array.isArray(obj[strDate].periods)){
              obj[strDate].periods = [
                { color: 'transparent' },
                { color: 'transparent' },
                { color: 'transparent' }
              ]
            }
            if(betweenDates.length - 1 === i){
                obj[strDate].periods[index] = {
                 startingDay: false,
                 endingDay: true,
                 color: colors[reserva.Cabana]
                }
            }else{
                obj[strDate].periods[index] = {
                  startingDay: false,
                  endingDay: false,
                  color: colors[reserva.Cabana]
                }
            }
          })
        }
      })
      resolve(obj)
    })
  }

const colorsCamping = {camping1 : "#bf360c",camping2 : "#005662",camping3 : "#00c853",camping4 : "#ffd600",camping5 : "#8e24aa",camping6 : "#1b5e20"}

const mapReservasCampings = async (reservasPeriods)=>{
    return new Promise(resolve=>{
      const obj = {};
      reservasPeriods.forEach(reserva=>{
        let index = reserva.Cabana === "camping1" ? 0 :reserva.Cabana === "camping2" ? 1 : 
        reserva.Cabana === "camping3" ? 2 : reserva.Cabana === "camping4" ? 3 : reserva.Cabana === "camping5" ? 4:
        reserva.Cabana === "camping6" ? 5 : null;
        if(typeof obj[reserva.Llegada] !== "object"){
          obj[reserva.Llegada] = {};
        }
        if(!Array.isArray(obj[reserva.Llegada].periods)){
          obj[reserva.Llegada].periods = [
            { color: 'transparent' },
            { color: 'transparent' },
            { color: 'transparent' },
            { color: 'transparent' },
            { color: 'transparent' },
            { color: 'transparent' }
          ]
        }
        if(reserva.Salida === reserva.Llegada){
          obj[reserva.Llegada].periods[index] = {startingDay: true,endingDay: true, color: colorsCamping[reserva.Cabana]}
        }else{
          obj[reserva.Llegada].periods[index] = {startingDay: true,endingDay: false,color: colorsCamping[reserva.Cabana]}
        }
        if(reserva.Salida > reserva.Llegada){
          let betweenDates = enumerateDaysBetweenDates(reserva.Llegada,reserva.Salida);
          betweenDates.forEach((date,i)=>{
            let strDate = moment(date).format("YYYY-MM-DD").toString();
            if(typeof obj[strDate] !== "object"){
              obj[strDate] = {};
            }
            if(!Array.isArray(obj[strDate].periods)){
              obj[strDate].periods = [
                { color: 'transparent' },
                { color: 'transparent' },
                { color: 'transparent' },
                { color: 'transparent' },
                { color: 'transparent' },
                { color: 'transparent' }
              ]
            }
            if(betweenDates.length - 1 === i){
                obj[strDate].periods[index] = {
                 startingDay: false,
                 endingDay: true,
                 color: colorsCamping[reserva.Cabana]
                }
            }else{
                obj[strDate].periods[index] = {
                  startingDay: false,
                  endingDay: false,
                  color: colorsCamping[reserva.Cabana]
                }
            }
          })
        }
      })
      resolve(obj)
    })
  }