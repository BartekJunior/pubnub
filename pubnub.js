"use strict";

const firstDiv = document.getElementById(`firstDiv`);

firstDiv.style.backgroundColor = `red`;

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
      title: "greeting",
      description: message,
    },
  };
  await pubnub.publish(publishPayload);
};
