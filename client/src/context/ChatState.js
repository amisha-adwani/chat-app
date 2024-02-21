import { React, useState } from "react";
import ChatContext from "./ChatContext";
import io from "socket.io-client";
const URL = "https://hushnet.onrender.com";
const socket = io(URL);
const ChatState = (props) => {
  const [message, setMessage] = useState([]);
  const [messageReceived, setMessageReceived] = useState([]);
  const [username, setUsername] = useState('Guest');
  const [errorMessage, setErrorMessage] = useState("");
  const [rooms, setRooms] = useState([]);
  return (
    <ChatContext.Provider
      value={{
        setMessage,
        message,
        messageReceived,
        setMessageReceived,
        socket,
        username,
        setUsername,
        errorMessage,
        setErrorMessage,
        rooms,
        setRooms
      }}
    >
      {props.children}
    </ChatContext.Provider>
  );
};

export default ChatState;
