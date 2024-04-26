import {configureStore} from '@reduxjs/toolkit'
import {todoReducer} from './Features/todoSlice'

//we get all functions to the store
//informing the store
export const Store=configureStore({
    reducer:todoReducer,
})
