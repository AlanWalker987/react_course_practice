import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(showAddFriend => !showAddFriend);
  }

  function handleAddFriend(friend) {
    setFriends(friends => [...friends, friend])
    setShowAddFriend(false);
  }

  function handleSelectedFriend(friend) {
    setSelectedFriend(friend);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList friends={friends} onSelectFriend={handleSelectedFriend} />
        {showAddFriend && <FormAddFriend onAddFriend={handleAddFriend} />}
        <Button onAddFriend={handleShowAddFriend}>{showAddFriend ? 'Close' : 'Add Friend'}</Button>
      </div>
      {selectedFriend && <FormSplitBill />}
    </div>
  )
}

function FriendList({ friends, onSelectFriend }) {
  return (
    <ul>
      {
        friends.map((friend) => <Friend friend={friend} key={friend.key} onSelectFriend={onSelectFriend} />)
      }
    </ul>
  )
}

function Button({ onAddFriend, children }) {
  return (
    <button className="button" onClick={onAddFriend}>{children}</button>
  )
}

function Friend({ friend, onSelectFriend }) {
  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && <p className="red">You owe {friend.name} {Math.abs(friend.balance)}$</p>}
      {friend.balance > 0 && <p className="green">{friend.name} oews you {Friend.balance}$</p>}
      {friend.balance === 0 && <p>You and {friend.balance} are even</p>}
      <Button onClick={() => onSelectFriend(friend)}>Select</Button>
    </li>
  )
}

function FormAddFriend({ onAddFriend }) {

  const [name, setName] = useState('');
  const [image, setImage] = useState('https://i.pravatar.cc/48?u');

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !image) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id,
      name,
      image: `${image}=${id}`,
      balance: 0
    }

    onAddFriend(newFriend)

    setName('');
    setImage('https://i.pravatar.cc/48?u');

  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>👫 Friend's name</label>
      <input type="text" value={name} onChange={e => setName(e.target.value)} />

      <label>🌆 Image URL</label>
      <input type="text" value={image} onChange={e => setImage(e.target.value)} />

      <Button>Add</Button>
    </form>
  )
}

function FormSplitBill() {
  return (
    <form className="form-split-bill">
      <h2>Split a bill with X</h2>

      <label>💰 Bill Value</label>
      <input type="text" />

      <label>👦 Your Expense</label>
      <input type="text" />

      <label>👫 X's Expense</label>
      <input type="text" />

      <label>🤑 Who is paying the bill ?</label>
      <select>
        <option value='user'>You</option>
        <option value='user'>X</option>
      </select>

      <Button>Split Bill</Button>
    </form>
  )
}