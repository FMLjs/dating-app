import { createStore } from 'redux'
import userReducer from './reducers/userReducer';
import { configureStore } from "@reduxjs/toolkit";

const rootReducer = {
    user: userReducer
}

const store = configureStore({
    reducer: rootReducer
});

export default store;