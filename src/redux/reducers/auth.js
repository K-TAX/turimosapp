import _ from 'lodash'

const initialState= {
    token : null,
    user : null
}

export default (state = _.cloneDeep(initialState), action) => {
    const {payload , type } = action
    switch (type) {
        case "SET_USER_SESSION":
        case "CLEAN_USER_SESSION":
            return {
                ...payload
              }
        default:
            return state;
    }
}