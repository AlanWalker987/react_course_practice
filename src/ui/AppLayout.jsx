import { Outlet, useNavigation } from "react-router-dom";
import CartOverview from "../features/cart/CartOverview";
import SearchOrder from "../features/order/SearchOrder";
import Header from "./Header";
import Loader from "./Loader";

function AppLayout() {

    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    return (
        <div className="layout">
            {isLoading && <Loader />}
            <Header />
            <main>
                <Outlet />
            </main>
            <CartOverview />
        </div>
    )
}

export default AppLayout;