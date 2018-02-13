import React from 'react'
import ReactDOM from 'react-dom'
import HomePage from './pages/HomePage'
import ResourceFieldsPage from './pages/ResourceFieldsPage'
import CreateReactClass from 'create-react-class'
import rootReducer from './state/reducers'
import thunk from 'redux-thunk'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import { Router, Route, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'

// Add the reducers to store
const store = createStore(
    rootReducer,
    applyMiddleware(thunk)
)

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store)

const rootEl = document.querySelector('#root')

const App = CreateReactClass({

    render: function() {
        return (
            <Provider store={store}>
                <Router history={history}>
                    <Route path="/" component={HomePage}/>
                    <Route path="/resource/:id" component={ResourceFieldsPage}/>
                </Router>
            </Provider>
        )
    }

});

ReactDOM.render(<App />, rootEl);