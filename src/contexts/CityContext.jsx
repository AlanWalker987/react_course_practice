import { useContext, useEffect, useReducer, useState } from "react";
import { createContext } from "react";

const BASE_URL = "http://localhost:9000";
const CitiesContext = createContext();

const initialState = {
    cities: [],
    isLoading: false,
    currentCity: {},
    error: ""
}

function reducer(state, action) {
    switch (action.type) {
        case "loading":
            return { ...state, isLoading: true };
        case "cities/loaded":
            return { ...state, isLoading: false, cities: action.payload };
        case "city/loaded":
            return { ...state, isLoading: false, currentCity: action.payload }
        case "city/created":
            return { ...state, isLoading: false, cities: [...state.cities, action.payload] }
        case "city/deleted":
            return { ...state, isLoading: false, cities: state.cities.filter(city => city.id !== action.payload) }
        case "rejected":
            return { ...state, isLoading: false, error: action.payload };
        case "loadingDone":
            return { ...state, isLoading: false };
        default: throw new Error("Unknown action type");
    }
}


function CitiesProvider({ children }) {
    // const [cities, setCities] = useState([]);
    // const [isLoading, setIsLoading] = useState(false);
    // const [currentCity, setCurrentCity] = useState({});

    const [{ cities, isLoading, currentCity }, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        async function fetchCities() {
            dispatch({ type: "loading" })
            try {
                const res = await fetch(`${BASE_URL}/cities`);
                const data = await res.json();
                dispatch({ type: "cities/loaded", payload: data })
            } catch (error) {
                dispatch({ type: "rejected", payload: "Error in fetching the cities" });
            } finally {
                dispatch({ type: "loadingDone" })
            }
        }
        fetchCities()
    }, [])

    async function getCity(cityid) {
        dispatch({ type: "loading" })
        try {
            const res = await fetch(`${BASE_URL}/cities/${cityid}`);
            const data = await res.json();
            dispatch({ type: "city/loaded", payload: data })
        } catch (error) {
            dispatch({ type: "rejected", payload: "Error in fetching the city" })
        } finally {
            dispatch({ type: "laodingDone" })
        }
    }

    async function createCity(newCity) {
        dispatch({ type: "loading" })
        try {
            const res = await fetch(`${BASE_URL}/cities`, {
                method: 'POST',
                body: JSON.stringify(newCity),
                headers: {
                    "Content-type": "application/json"
                },
            })
            const data = await res.json();
            dispatch({ type: "city/created", payload: data })
        } catch (error) {
            dispatch({ type: "rejected", payload: "Error in Creating the city" })
        } finally {
            dispatch({ type: "loadingDone" })
        }
    }

    async function deleteCity(id) {
        dispatch({ type: "loading" })
        try {
            await fetch(`${BASE_URL}/cities/${id}`, {
                method: 'DELETE'
            })
            dispatch({ type: "city/deleted", payload: id })
        } catch (error) {
            dispatch({ type: "rejected", payload: "There was a error in deleting the city" })
        } finally {
            dispatch({ type: "loadingDone" })
        }

    }

    return <CitiesContext.Provider value={{
        cities, isLoading, currentCity, getCity, createCity, deleteCity
    }}>{children}</CitiesContext.Provider>
}

function useCities() {
    const context = useContext(CitiesContext);
    if (context === undefined) throw new Error("cities context was used outside the cities provider");
    return context;
}

export { CitiesProvider, useCities }