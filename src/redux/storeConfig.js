import {createStore,applyMiddleware} from 'redux'
import reducers from './reducers/index'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
//middlewares
import logger from 'redux-logger'
import thunk from 'redux-thunk'


let middlewares = [];

middlewares.push(thunk)
middlewares.push(logger);

const persistConfig = {
  key: 'root',
  storage,
  blacklist : ["ui","reservas","abonos"]
}

const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(persistedReducer,applyMiddleware(...middlewares))

const persistor = persistStore(store)

export default {
  store,
  persistor
}
