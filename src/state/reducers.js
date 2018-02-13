import { combineReducers } from 'redux'
import snackbarReducer from './snackbarReducer'
import resourceReducer from './resourceReducer'
import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
    snackbarReducer,
    resourceReducer,
    routing: routerReducer,
})

export default rootReducer