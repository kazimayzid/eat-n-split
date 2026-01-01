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
    setSelectedFriends((cur) => cur?.id === friend.id ? null : friend)

    setShowAddFriend(false)
   
  }

  function handleSplitBill(value) {
    setFriends((friends) => friends.map((friend) => friend.id === selectedFriends?.id ? {...friend, balance: friend.balance +value} : friend));

    setSelectedFriends(null)
    
  }
 

  return (
    <>
      <div className="app">
        <div className="sidebar">
          <FriendsList friends={friends} onHandleSelectedFriends={handleSelectedFriends} selectedFriends={selectedFriends}/>
          {showAddFriend && (
            <FormAddFriend onHandleAddFriends={handleAddFriends} />
          )}

          <Button onSmash={() => setShowAddFriend(() => !showAddFriend)}>
            {showAddFriend ? "Close" : "Add friend"}
          </Button>
        </div>

        {
          selectedFriends && <FormSplitBill  selectedFriends={selectedFriends} onSplitBill={handleSplitBill}/>
        }
      </div>
    </>
  );
}

function FriendsList({ friends, onHandleSelectedFriends, selectedFriends }) {
  return (
    <>
      <ul>
        {friends.map((friend) => (
          <Friend onHandleSelectedFriends={onHandleSelectedFriends} selectedFriends={selectedFriends} friend={friend} key={friend.id}></Friend>
        ))}
      </ul>
    </>
  );
}

function Friend({ friend, onHandleSelectedFriends, selectedFriends}) {

  const isSelected = selectedFriends?.id === friend.id
  return (
    <>
      <li className={isSelected ? "selected" : ""}>
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

        <Button onSmash={() => onHandleSelectedFriends(friend)}>{isSelected? "Close" : "Select"}</Button>
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

function FormSplitBill({selectedFriends, onSplitBill}) {
  const[bill, setBill] = useState("")
  const[paidByUser, setPaidByUser ] = useState("")

  const paidByFriend = bill ? bill - paidByUser : ""
  const[whoIsPaying, setWhoIsPaying] = useState("user")

  function handleSubmite (e) {
    e.preventDefault()

    if (!bill || !paidByUser) return;
  

    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser)

  }
  return (
    <>
      <form onSubmit={handleSubmite} action="" className="form-split-bill">
        <h2>Split a bill with {selectedFriends.name}</h2>

        <label htmlFor="">💸 Bill value</label>
        <input type="text" value={bill} onChange={(e) => setBill(Number(e.target.value))}/>
        <label htmlFor="">🕴️ Your expense</label>
        <input type="text" value={paidByUser} onChange={(e) => setPaidByUser(Number(e.target.value > bill ? paidByUser : e.target.value))}/>
        <label htmlFor="">👬 {selectedFriends.name}'s expense</label>
        <input type="text" disabled value={paidByFriend}/>

        <label htmlFor="">🤑 Who is paying the bill</label>
        <select value={whoIsPaying} onChange={(e) => setWhoIsPaying(e.target.value)}>
          <option value="user">You</option>
          <option value="friend">{selectedFriends.name}</option>
        </select>
        <Button>Split bill</Button>
      </form>
    </>
  );
}
