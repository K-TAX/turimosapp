import _ from 'lodash'

const initialState= {
    abonos : {},
    tempAbonos : {
        abonos : [],
        montoAbonado : 0
    }
}

export default (state = _.cloneDeep(initialState), action) => {
    const { type,payload } = action
    switch (type) {
        case "ADD_ABONO":
        case "DELETE_ABONO":
        case "FETCH_ABONOS":
            return _.set(_.cloneDeep(state),"abonos",payload.abonos);
        case "ADD_TEMP_ABONO":
        case "DELETE_TEMP_ABONO":
            return _.set(_.cloneDeep(state),"tempAbonos",payload.tempAbonos);
        case "CLEAN_TEMP_ABONOS":
        return _.set(_.cloneDeep(state),"tempAbonos",{
            abonos : [],
            montoAbonado : 0
        });
        default:
            return state;
    }
}