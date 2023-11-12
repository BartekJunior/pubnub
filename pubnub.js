"use strict";

const UUID = prompt(`Podaj nazwę Gracza`);
// const UUID = `bart`;

const firstDiv = document.getElementById(`firstDiv`);
const lastDiv = document.getElementById(`lastDiv`);

firstDiv.style.backgroundColor = `red`;

// ------------ TURN CHANGE BART is the first player. TURN FUNCTION MADE FOR X PLAYERS!!! ------------- //
// PlayersNumber tells how many players are in the game! IT MUST BE THE RIGHT VALUE!
let onlineUsers = new Set();
const playersNumber = 2;
let turn = 1;

document.addEventListener(
  `click`,
  function (e) {
    if (pubnub._config.UUID === `bart`) {
      input.disabled = false;
      send.disabled = false;
    }
  },
  { once: true }
);

const input = document.getElementById("message-body");
const send = document.getElementById("send");
input.disabled = true;
send.disabled = true;
input.addEventListener("keydown", function (event) {
  if (event.keyCode === 13) {
    buttonClick();
  }
});

const checkUser = () => {
  const num = Math.ceil(playersNumber / onlineUsers.size);
  turn++;
  if (turn === 1 + playersNumber) turn = 1;
  if (num === turn) {
    input.disabled = false;
    send.disabled = false;
  } else {
    input.disabled = true;
    send.disabled = true;
  }
};
// ------------ TURN CHANGE ------------- //

// Dynamic variables
let i;
for (i = 1; i < 4; i++) {
  window["value" + i] = i;
}
// Dynamic variables

sendPlayer.addEventListener(`click`, function () {
  publishMessage(player);
  player.start = undefined; // disable player.start to not sending the position of first merchant anymore
});

// const testListener = (msg) => {
//   test = msg;
// }

const playerListener = (msg) => {
  console.log(`this is player BEFORE IF msg`, msg);

  if (msg.name !== player.name) window[`player` + msg.name] = msg;

  if (msg.nr == 1) player1 = msg;
  if (msg.nr == 2) player2 = msg;
  if (msg.nr == 3) player3 = msg;

  console.log(`this is player msg`, msg);

  // if (msg.nr === 1 && msg.start === 0)
  //   hexAll[msg.start].merchant = new Merchant(
  //     hexAll[msg.start],
  //     msg.color
  //   );
  // else if (msg.nr === 2 && msg.start)
  //   hexAll[msg.start].merchant = new Merchant(
  //     hexAll[msg.start],
  //     msg.color
  //   );
  // else if (msg.nr === 3 && msg.start)
  //   hexAll[msg.start].merchant = new Merchant(
  //     hexAll[msg.start],
  //     msg.color
  //   );

  //send merchant to another users
};

const resourceListener = (msg) => {
  // show start resource
  for (let i = 0; i < window.p1GlobalResourceDiv.length; i++) {
    window[`p` + msg.nr + `GlobalResourceDiv`][i].innerHTML =
      msg.resource[res[i]];
  }
  // Show player name and whole playerGlobalHud
  window[`p` + msg.nr + `Global`].children[0].innerHTML = msg.name;
  window[`p` + msg.nr + `Global`].children[0].style.backgroundColor = msg.color;
  window[`p` + msg.nr + `Global`].style.display = `block`;
};


const skillsListener = (msg) => {
  const pXTechBtns = window[`p` + msg.nr + `TechBtns`];
  msg.skills.forEach((el, index) => {
    if (el.purchased && pXTechBtns[index].style.backgroundColor !== msg.color) {
      pXTechBtns[index].style.backgroundColor = msg.color;
    }
  });
};


const turnListener = (msg) => {
  if (msg.turnActive === false) {
    player.turnActive = true;
    player.action = 3;
    startTurnInterval();
  }
};

const mapListener = (msg) => {
  hexesOnMap = msg;
  paintHex();
};

const townListener = (msg) => {
  townsOnMap = msg;
  paintTown();
};

const troopsListener = (msg) => {
  troopsOnMap = msg;
  paintTroops();
}

// const testListener = (msg) => {
//   console.log(`msg before`, msg);
//   player = msg;
//   console.log(`player = msg`, player);
// };



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
      // testListener(messageEvent.message.description);

      if (
        messageEvent.publisher !== UUID &&
        messageEvent.message.description.type === `player`
      ) {
        showMessage(messageEvent.message.description);
        checkUser(messageEvent.message.description);

        playerListener(messageEvent.message.description);
        resourceListener(messageEvent.message.description);
        skillsListener(messageEvent.message.description);

        console.log(messageEvent);
      }

      // TURN CONDITION FOR TURN LISTENER
      if (
        messageEvent.publisher !== UUID &&
        messageEvent.message.description.nr === player.nr - 1 &&
        messageEvent.message.description.actionDone
      )
        turnListener(messageEvent.message.description);
      else if (
        messageEvent.publisher !== UUID &&
        player.nr === 1 &&
        messageEvent.message.description.actionDone &&
        messageEvent.message.description.nr === playersNumber
      )
        turnListener(messageEvent.message.description);

      // MAP Listener condition
      if (
        messageEvent.publisher !== UUID &&
        messageEvent.message.description.type === `hex`
      ) {
        console.log(messageEvent.message.description);
        console.log(`this was hex`);
        mapListener(messageEvent.message.description);
      }

      if (
        messageEvent.publisher !== UUID &&
        messageEvent.message.description.type === `town`
      ) {
        console.log(messageEvent.message.description);
        console.log(`this was town`);
        townListener(messageEvent.message.description);
      }

      if (
        messageEvent.publisher !== UUID &&
        messageEvent.message.description.type === `troops`
      ) {
        console.log(messageEvent.message.description);
        console.log(`this was troops`);
        troopsListener(messageEvent.message.description);
      }

      // if (
      //   messageEvent.publisher !== UUID &&
      //   messageEvent.message.description.type === `merchant`
      // ) {
      //   console.log(`this was merchant`);
      //   merchantListener(messageEvent.message.description);
      // }
    },

    presence: (event) => {
      if (event.action === "join") {
        onlineUsers.add(event.uuid);
        console.log(`User ${event.uuid} has joined.`);
        console.log(`The online users are: ${Array.from(onlineUsers)}`);
        // console.log(event);
      } else if (event.action === "leave") {
        onlineUsers.delete(event.uuid);
        console.log(`User ${event.uuid} has left.`);
        console.log(`The online users are: ${Array.from(onlineUsers)}`);
        // console.log(event);
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

  // console.log(publishPayload);
  await pubnub.publish(publishPayload);
};

// Prevent relaod page //
// window.onbeforeunload = function() {
//     return `Dude`
// }
