import _ from 'lodash'

const initialState= {
    abonos : {}
}

export default (state = _.cloneDeep(initialState), action) => {
    const { type,payload } = action
    switch (type) {
        case "ADD_ABONO":
        case "DELETE_ABONO":
        case "FETCH_ABONOS":
            return _.set(_.cloneDeep(state),"abonos",payload.abonos);
        default:
            return state;
    }
}