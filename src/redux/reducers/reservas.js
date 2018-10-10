import _ from 'lodash'

const initialState= {
    reservasPeriods : {},
    reservasPeriodsCampings : {},
    reservas_admin : null,
    reservas_admin_campings : null
}

export default (state = _.cloneDeep(initialState), action) => {
    const { type,payload } = action
    switch (type) {
        case "FETCH_AND_MAKE_RESERVAS_PERIODS":
        case "FETCH_AND_MAKE_RESERVAS_PERIODS_CAMPINGS":
            return {
                ...state, 
                ...payload
              }
        case "CAMBIO_ESTADO_RESERVA":
        case "LIMPIAR_RESERVAS_ANULADAS":
        case "FETCH_RESERVAS_ADMIN":
        case "FETCH_RESERVAS_ADMIN_CAMPINGS":
            return {
                ...state, 
                ...payload
              }
        default:
            return state;
    }
}