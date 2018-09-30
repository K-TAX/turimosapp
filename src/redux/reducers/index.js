import auth from './auth'
import ui from './ui'
import cabanas from './cabanas'
import reservas from './reservas'
import abonos from './abonos'
import { combineReducers } from 'redux'

export default combineReducers({
    auth,
    ui,
    cabanas,
    reservas,
    abonos
});