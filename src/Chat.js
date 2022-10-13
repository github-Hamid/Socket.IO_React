import React, { useEffect, useState } from "react";
//for scrolling down
import ScrollToBottom from "react-scroll-to-bottom";
// in this component we are going to sending messages and receiving messages
// through socket.io so, we need the socket which we created in App file as props
// wee need the room to see which room user particpates in
// wee need username to show the name for message
function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  // listen whenever there is a change in socket(messages)
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => {
        return [...list, data];
      });
    });
  }, [socket]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };

      await socket.emit("send_message", messageData);
      // show added message for the sender
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };
  return (
    <div className="chat-window">
      <div className="chat-header">
        <p>Live Chat</p>
      </div>

      <div className="chat-body">
        <ScrollToBottom className="message-container">
          {messageList.map((message) => {
            return (
              <div
                className="message"
                id={username === message.author ? "you" : "other"}
              >
                <div>
                  <div className="message-content">
                    <p>{message.message}</p>
                  </div>
                  <div className="message-meta">
                    <p id="time">{message.time}</p>
                    <p id="author">{message.author}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          onChange={(e) => {
            setCurrentMessage(e.target.value);
          }}
          value={currentMessage}
          placeholder="Message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
}

export default Chat;
