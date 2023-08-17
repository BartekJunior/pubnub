"use strict";

const firstDiv = document.getElementById(`firstDiv`);
const lastDiv = document.getElementById(`lastDiv`);

firstDiv.style.backgroundColor = `red`;

const alpha = document.getElementById(`alpha`);
const betha = document.getElementById(`betha`);
const gamma = document.getElementById(`gamma`);
const sigma = document.getElementById(`sigma`);

let hehe;
hehe = document.createElement(`div`);
hehe.style.display = `block`;
hehe.style.width = `100px`;
hehe.style.height = `100px`;
hehe.style.backgroundColor = `green`;

let x = 999;

///// PUBNUB /////
const buttonClick = () => {
  var input = document.getElementById("message-body");
  publishMessage(input.value);

  input.value = "";
};

const showMessage = (msg) => {
  var message = document.createElement("div");
  message.innerText = msg;
  document.getElementById("messages").appendChild(message);
};



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
let same;
let shits;



document.addEventListener(`click`, function (e) {
  if (e.target === alpha) {
    color = `blue`;
    e.target.style.backgroundColor = color;
  }
});

const myListener3 = (msg) => {
  color = alpha.style.backgroundColor;

};

let pubnub;
const setupPubNub = () => {
  // Update this block with your publish/subscribe keys
  pubnub = new PubNub({
    publishKey: "pub-c-39f0e485-ce55-4006-a9bd-6a780b9e77d2",
    subscribeKey: "sub-c-b19a2a4a-e6cc-4a73-84dd-364e0fa0eeb6",
    userId: "demol",
  });

  // add listener
  const listener = {
    status: (statusEvent) => {
      if (statusEvent.category === "PNConnectedCategory") {
        console.log("Connected");
      }
    },

    message: (messageEvent) => {
      showMessage(messageEvent.message.description);
      myListener3(messageEvent.message.description);
    },

    presence: (presenceEvent) => {
      // handle presence
    },
  };

  pubnub.addListener(listener);

  // publish message

  // subscribe to a channel
  pubnub.subscribe({
    channels: ["hello_world"],
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
