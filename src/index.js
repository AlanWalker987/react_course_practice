import React from 'react'
import ReactDOM from 'react-dom/client';
import './index.css'

function App(){
    return (
        <div className='container'>
           <Header />
           <Menu />
           <Footer />
        </div>
    )
}

const pizzaData = [
    {
      name: "Focaccia",
      ingredients: "Bread with italian olive oil and rosemary",
      price: 6,
      photoName: "pizzas/focaccia.jpg",
      soldOut: false,
    },
    {
      name: "Pizza Margherita",
      ingredients: "Tomato and mozarella",
      price: 10,
      photoName: "pizzas/margherita.jpg",
      soldOut: false,
    },
    {
      name: "Pizza Spinaci",
      ingredients: "Tomato, mozarella, spinach, and ricotta cheese",
      price: 12,
      photoName: "pizzas/spinaci.jpg",
      soldOut: false,
    },
    {
      name: "Pizza Funghi",
      ingredients: "Tomato, mozarella, mushrooms, and onion",
      price: 12,
      photoName: "pizzas/funghi.jpg",
      soldOut: false,
    },
    {
      name: "Pizza Salamino",
      ingredients: "Tomato, mozarella, and pepperoni",
      price: 15,
      photoName: "pizzas/salamino.jpg",
      soldOut: true,
    },
    {
      name: "Pizza Prosciutto",
      ingredients: "Tomato, mozarella, ham, aragula, and burrata cheese",
      price: 18,
      photoName: "pizzas/prosciutto.jpg",
      soldOut: false,
    },
  ];
  

const Header = () => {
    // const style = { color : 'green', fontSize : '48px', textTransform : 'uppercase'}
    return(
        <header className='header'>
            <h1> 
            FAST REACT PIZZA CO.
            </h1>
        </header>
    )
}

const Menu = () => {
    const pizzas = pizzaData;
    //const pizzas = [];
    const numOfPizzas = pizzas.length;

    return(
        <main className='menu'>
            <h2>Our Menu</h2>
            {
                numOfPizzas > 0 ?  <ul className='pizzas'>
                {
                    pizzaData.map((pizza) => {
                        return(
                            <Pizza soldOut={pizza.soldOut} name={pizza.name} ingredients={pizza.ingredients} price={pizza.price} photoName={pizza.photoName} />
                        )
                    })
                }
            </ul> : <p>We're still working on the menu. Please come back later :)</p>
            }
           
        </main>
    )
}

const Footer = () => {
    const hour = new Date().getHours();
    const openHour = 12;
    const closeHour = 22;
    const isOpen = hour >= openHour && hour <= closeHour;

    return(
        <footer className='footer'>
             {
                isOpen && (
                   <Order openHour={openHour} closeHour={closeHour} />
                )
             }
        </footer>
    )
}

const Order = ( {openHour, closeHour} ) =>{
    return(
        <div className='order'>
            <p>
                We're open from {openHour} until {closeHour}:00. Come visit us or order online.
            </p>
            <button className='btn'>Order</button>
    </div>
    )
}

const Pizza = ({ name, photoName, ingredients, price, soldOut}) => {
    return(
        <li className={`pizza ${soldOut ? 'sold-out' : ''}`}>
            <img src={photoName} alt={name}/>
            <div>
                <h3>{name}</h3>
                <p>{ingredients}</p>
                <span>{soldOut ? 'SOLD OUT' : price}</span>
            </div>
        </li>
    )
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
)