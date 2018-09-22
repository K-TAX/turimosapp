import _ from 'lodash'

const initialState= {
    cabanas : []
}

export default (state = _.cloneDeep(initialState), action) => {
    const { type,payload } = action
    switch (type) {
        case "FETCH_CABANAS":
            return {
                ...state, 
                ...payload
              }
        default:
            return state;
    }
}