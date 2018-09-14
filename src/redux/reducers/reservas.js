import _ from 'lodash'

const initialState= {
    reservas_admin : null
}

export default (state = _.cloneDeep(initialState), action) => {
    const { type,payload } = action
    switch (type) {
        case "CAMBIO_ESTADO_RESERVA":
        case "LIMPIAR_RESERVAS_ANULADAS":
        case "FETCH_RESERVAS_ADMIN":
            return {
                ...state, 
                ...payload
              }
        default:
            return state;
    }
}