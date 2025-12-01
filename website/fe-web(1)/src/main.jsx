import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/global.css";  
import ChatBot from "./components/layout/ChatBot.jsx";
ReactDOM.createRoot(document.getElementById("root")).render(
  <>
    <App />
    <ChatBot />
  </>
);
