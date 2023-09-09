import React from 'react';
import CityItem from './CityItem';
import Styles from './CityList.module.css'
import Spinner from './Spinner';
import Message from './Message'
import { useCities } from '../contexts/Citycontext';

export default function CityList() {

    const { cities, isLoading } = useCities();

    if (isLoading) return <Spinner />;

    if (!cities.length)
        return (
            <Message message="Add your first city by clicking on the city in the map" />
        )

    return (
        <ul className={Styles.CityList}>
            {
                cities.map((city) => {
                    return <CityItem city={city} key={city.id} />
                })
            }
        </ul>
    )
}
