// src/chat.js

// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBq3enhOeAa89Hpd3BvWLcTYyftO12gyFM",
    authDomain: "anon-chat-14b52.firebaseapp.com",
    databaseURL: "https://anon-chat-14b52-default-rtdb.firebaseio.com",
    projectId: "anon-chat-14b52",
    storageBucket: "anon-chat-14b52.appspot.com",
    messagingSenderId: "62108076273",
    appId: "1:62108076273:web:53c34771233d3426af8150"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const db = firebase.database();
  const auth = firebase.auth();
  
  auth.signInAnonymously().catch(console.error);
  
  const messagesDiv = document.getElementById('chatMessages');
  const input = document.getElementById('chatInput');
  const button = document.querySelector('button[onclick="sendMessage()"]');
  
  let lastSentTime = 0;
  
  window.sendMessage = function () {
    const text = input.value.trim();
    if (!text) return;
    const now = Date.now();
    if (now - lastSentTime < 5000) {
      alert("Please wait 5 seconds before sending another message.");
      return;
    }
    lastSentTime = now;
  
    db.ref("messages").push({
      name: "Anon",
      text,
      timestamp: now
    });
  
    input.value = "";
  };
  
  button.onclick = sendMessage;
  
  db.ref("messages").limitToLast(20).on("child_added", snapshot => {
    const { name, text } = snapshot.val();
    const msg = document.createElement("div");
    msg.textContent = `${name}: ${text}`;
    msg.style.fontSize = "12px";
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });
  
  // Also allow sending message with Enter key
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  