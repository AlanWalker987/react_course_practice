import { useState } from 'react';
export default function Form({ onAddItems }) {

    const [description, setDescription] = useState('');
    const [quantity, setQuantity] = useState(1);

    const handleSubmit = (event) => {
        event.preventDefault();

        const newItem = {
            id: Date.now(),
            quantity: quantity,
            description: description,
            packed: false
        }
        onAddItems(newItem);

        if (!description) return;

        setDescription('');
        setQuantity(1);
    }

    return (
        <form className='add-form' onSubmit={handleSubmit}>
            <h3>What do you need for your trip 😍</h3>
            <select value={quantity} onChange={e => setQuantity(+e.target.value)}>
                {
                    Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                        <option value={num} key={num}>{num}</option>
                    ))
                }
            </select>
            <input type='text' placeholder='Items...' value={description} onChange={e => setDescription(e.target.value)} />
            <button>ADD</button>
        </form>
    )
}
