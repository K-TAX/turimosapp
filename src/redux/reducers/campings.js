import _ from 'lodash'

const initialState= {
    campings : []
}

export default (state = _.cloneDeep(initialState), action) => {
    const { type,payload } = action
    switch (type) {
        case "FETCH_CAMPINGS":
            return {
                ...state, 
                ...payload
              }
        default:
            return state;
    }
}