import _ from 'lodash'

const initialState= {
}

export default (state = _.cloneDeep(initialState), action) => {
    const { type,payload } = action
    switch (type) {
       
        default:
            return state;
    }
}