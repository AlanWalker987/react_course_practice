import { useState } from 'react';
import Logo from './Logo';
import Form from './Form';
import PackingList from './PackingList';
import Stats from './Stats';
import '../index.css';


// const initialItems = [
//   { id: 1, description: "Passports", quantity: 2, packed: false },
//   { id: 2, description: "Socks", quantity: 12, packed: false },
//   { id: 3, description: "Bags", quantity: 2, packed: true },
//   { id: 4, description: "Gifts", quantity: 20, packed: true },
// ];

const App = () => {

  const [items, setItems] = useState([]);

  const handleAddItems = (item) => {
    setItems((items) => [...items, item]);
  }

  const handleDeleteItem = (id) => {
    setItems((items) => items.filter((item) => item.id !== id))
  }

  const handleToggleItem = (id) => {
    setItems((item) => items.map((item) => item.id === id ? { ...item, packed: !item.packed } : item))
  }

  const deleteItems = () => {
    const confirmStatus = window.confirm('Are you sure you want to clear the items ?')

    if (confirmStatus) setItems([]);
  }

  return (
    <div className='app'>
      <Logo />
      <Form onAddItems={handleAddItems} />
      <PackingList items={items} onToggleItem={handleToggleItem} onDeleteItem={handleDeleteItem} onClearItems={deleteItems} />
      <Stats items={items} />
    </div>
  )
}

export default App;
