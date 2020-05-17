import { createStore, applyMiddleware } from "redux";
import rootReducer from "./store/reducer"
import thunkMiddleware from "redux-thunk";

export default (initialState = {}) => createStore(rootReducer,initialState,applyMiddleware(thunkMiddleware));
