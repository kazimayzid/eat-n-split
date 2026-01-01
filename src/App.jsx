import { useState } from "react";
import "./App.css";

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
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriends, setSelectedFriends] = useState(null)

  function handleAddFriends(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false)
  }

  function handleSelectedFriends (friend) {
    setSelectedFriends(friend)
  }

  return (
    <>
      <div className="app">
        <div className="sidebar">
          <FriendsList friends={friends} onHandleSelectedFriends={handleSelectedFriends}/>
          {showAddFriend && (
            <FormAddFriend onHandleAddFriends={handleAddFriends} />
          )}

          <Button onSmash={() => setShowAddFriend(() => !showAddFriend)}>
            {showAddFriend ? "Close" : "Add friend"}
          </Button>
        </div>

        {
          selectedFriends && <FormSplitBill />
        }
      </div>
    </>
  );
}

function FriendsList({ friends, onHandleSelectedFriends }) {
  return (
    <>
      <ul>
        {friends.map((friend) => (
          <Friend onHandleSelectedFriends={onHandleSelectedFriends} friend={friend} key={friend.id}></Friend>
        ))}
      </ul>
    </>
  );
}

function Friend({ friend, onHandleSelectedFriends }) {
  return (
    <>
      <li>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            You owe {friend.name} $ {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance > 0 && (
          <p className="green">
            I owe to {friend.name} $ {Math.abs(friend.balance)}
          </p>
        )}
        {friend.balance === 0 && <p>You and {friend.name} are even</p>}

        <Button onSmash={() => onHandleSelectedFriends(friend)}>Select</Button>
      </li>
    </>
  );
}

function FormAddFriend({ onHandleAddFriends }) {
  const [friendName, setFriendName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  function handleSubmite(e) {
    e.preventDefault();

    const id = crypto.randomUUID();
    const newFriend = {
      name: friendName,
      image: `${image}?=${id}`,
      balance: 0,
      id,
    };
    onHandleAddFriends(newFriend);
    setFriendName(""), setImage("https://i.pravatar.cc/48");
  }
  return (
    <>
      <form action="" className="form-add-friends" onSubmit={handleSubmite}>
        <label htmlFor="">👬 Friend name</label>
        <input
          type="text"
          value={friendName}
          onChange={(e) => setFriendName(e.target.value)}
        />

        <label htmlFor="">🔗 Image URL</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Button>Add</Button>
      </form>
    </>
  );
}

function Button({ children, onSmash }) {
  return (
    <>
      <button onClick={onSmash} className="button">
        {children}
      </button>
    </>
  );
}

function FormSplitBill() {
  return (
    <>
      <form action="" className="form-split-bill">
        <h2>Split a bill with X</h2>

        <label htmlFor="">💸 Bill value</label>
        <input type="text" />
        <label htmlFor="">🕴️ Your expense</label>
        <input type="text" />
        <label htmlFor="">👬 x"s expense</label>
        <input type="text" disabled />

        <label htmlFor="">🤑 Who is paying the bill</label>
        <select>
          <option value="user">You</option>
          <option value="friend">x</option>
        </select>
      </form>
    </>
  );
}
