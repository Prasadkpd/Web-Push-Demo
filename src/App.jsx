import { getToken, onMessage } from "firebase/messaging";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Message from "./components/Message";
import { messaging } from "./firebase/firebaseConfig";

function App() {
  const { VITE_APP_VAPID_KEY } = import.meta.env;
  const [tokens, settokens] = useState('');

  async function requestPermission() {
    //requesting permission using Notification API
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: VITE_APP_VAPID_KEY,
      });
      settokens(token);
      //We can send token to server
      console.log("Token generated : ", token);
    } else if (permission === "denied") {
      //notifications are blocked
      alert("You denied for the notification");
    }
  }

  

  onMessage(messaging, (payload) => {
    console.log("incoming msg");
    toast(<Message notification={payload.notification} />);
  });

  const copyToClipboard = () => {
  if (tokens) {
    navigator.clipboard.writeText(tokens);
    alert("Token copied to clipboard!", tokens);
  }
};
  return (
    <>
      <div className="card">
        <button onClick={() => requestPermission()}>Request Permission</button>
      </div>
      <button onClick={copyToClipboard}>Copy Token to Clipboard</button>
      <p>Token: {tokens}</p>
      <ToastContainer />
    </>
  );
}

export default App;
