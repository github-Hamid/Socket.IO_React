import "./App.css";
// this library is for connecting client side to socket server
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

// connect client to socket.io server
// first argument is url that we are running socket.io server
const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      // this 'room' as second argument is data
      // in callback function in the server
      socket.emit("join_room", room);
      setShowChat(true);
    }
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join the Chat</h3>
          <input
            type="text"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            value={username}
            placeholder="John..."
          />
          <input
            onChange={(e) => {
              setRoom(e.target.value);
            }}
            value={room}
            type="text"
            placeholder="Room ID..."
          />
          <button onClick={joinRoom}>Join A Room</button>{" "}
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
