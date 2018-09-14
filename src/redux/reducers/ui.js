import _ from 'lodash'

const initialState= {
    drawerOpen : false,
    title : 'Home'
}

export default (state = _.cloneDeep(initialState), action) => {
    const { type,payload } = action
    switch (type) {
        case "TOGGLE_DRAWER":
            const newState =  _.cloneDeep(state);
            newState.drawerOpen = !newState.drawerOpen;
            return {
                ...state, 
                ...newState
              }
        case "CHANGE_TITLE":
            return {
                ...state, 
                ...payload
              }
        default:
            return state;
    }
}