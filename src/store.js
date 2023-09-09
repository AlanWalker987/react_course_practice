import { configureStore } from "@reduxjs/toolkit";
import AccountReducer from "./features/accounts/accountSlice";
import CustomerReducer from "./features/customers/customerSlice";

const Store = configureStore({
    reducer: {
        account: AccountReducer,
        customer: CustomerReducer
    }
})

export default Store;
