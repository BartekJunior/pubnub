"use strict";

const UUID = prompt(`Jak masz na imie?`);

const firstDiv = document.getElementById(`firstDiv`);
const lastDiv = document.getElementById(`lastDiv`);

firstDiv.style.backgroundColor = `red`;

const alpha = document.getElementById(`alpha`);
const betha = document.getElementById(`betha`);
const gamma = document.getElementById(`gamma`);
const sigma = document.getElementById(`sigma`);


let newObj;
const myListener2 = (msg) => {
  if (msg === `newObj`) {
    console.log(typeof msg);
    newObj = {
      name: `bartek`,
      age: 35,
      region: `Poznan`,
      language: `js`,
      hot: true,
    };
  }
};

const myListener = (msg) => {
  if (msg === `newObj`) {
    x = 777;
    lastDiv.appendChild(hehe);
  }
};

let color;
document.addEventListener(`click`, function (e) {
  if (e.target === alpha) {
    color = `blue`;
    e.target.style.backgroundColor = color;
  }
});

let same = {
  player: UUID,
  wood: 12,
  stone: 40,
};

gamma.addEventListener(`click`, function () {
  same = {
    player: UUID,
    wood: 77,
    stone: 109,
  };
});

sigma.addEventListener(`click`, function () {
  publishMessage(same);
});

const myListener3 = (msg) => {
  console.log(msg);
  if (same !== msg) same = msg;
};



const input = document.getElementById("message-body");
const send = document.getElementById("send");

///// PUBNUB /////
const buttonClick = () => {
  publishMessage(input.value);

  input.value = "";
  input.disabled = true;
  send.disabled = true;

};

const showMessage = (msg) => {
  var message = document.createElement("div");
  message.innerText = msg;
  document.getElementById("messages").appendChild(message);
};


const onlineUsers = new Set();
let pubnub;

const setupPubNub = () => {
  // Update this block with your publish/subscribe keys
  pubnub = new PubNub({
    publishKey: "pub-c-39f0e485-ce55-4006-a9bd-6a780b9e77d2",
    subscribeKey: "sub-c-b19a2a4a-e6cc-4a73-84dd-364e0fa0eeb6",
    userId: UUID,
  });

  // add listener
  const listener = {
    status: (statusEvent) => {
      if (statusEvent.category === "PNConnectedCategory") {
        onlineUsers.add(pubnub.getUUID()); // Add the initial user's UUID
        console.log("Connected");
      }
    },

    message: (messageEvent) => {
      showMessage(messageEvent.message.description);
      myListener3(messageEvent.message.description);

      console.log(messageEvent);

      if(messageEvent.publisher !== UUID) {
        
        input.disabled = false;
        send.disabled = false;
      }
    },


    presence: (event) => {
      if (event.action === "join") {
        onlineUsers.add(event.uuid);
        console.log(`User ${event.uuid} has joined. Online users:`);
        console.log(`The online users are: ${Array.from(onlineUsers)}`);
        console.log(event);
        

      } else if (event.action === "leave") {
        onlineUsers.delete(event.uuid);
        console.log(`User ${event.uuid} has left. Online users:`);
        console.log(`The online users are: ${Array.from(onlineUsers)}`);
        console.log(event);
      }
    },



  };

  pubnub.addListener(listener);
  // publish message

  // subscribe to a channel
  pubnub.subscribe({
    channels: ["hello_world"],
    withPresence: true,
  });
};

// run after page is loaded
window.onload = setupPubNub;

// "publish message"
const publishMessage = async (message) => {
  // With the right payload, you can publish a message, add a reaction to a message,
  // send a push notification, or send a small payload called a signal.
  const publishPayload = {
    channel: "hello_world",
    message: {
      description: message,
    },
  };

  console.log(publishPayload);
  await pubnub.publish(publishPayload);
};



// Prevent relaod page //
// window.onbeforeunload = function() {
//     return `Dude`
// }
