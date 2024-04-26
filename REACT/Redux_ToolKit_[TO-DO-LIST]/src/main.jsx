import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { Provider } from 'react-redux'
import { Store } from './App/Store.js'



ReactDOM.createRoot(document.getElementById('root')).render(
  // wrapping the whole APP and passing the Store

  <Provider store={Store}>
    <App />
  </Provider>,
)
