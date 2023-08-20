"use strict";

const UUID = prompt(`Jak masz na imie?`);

const firstDiv = document.getElementById(`firstDiv`);
const lastDiv = document.getElementById(`lastDiv`);

firstDiv.style.backgroundColor = `red`;

const alpha = document.getElementById(`alpha`);
const betha = document.getElementById(`betha`);
const gamma = document.getElementById(`gamma`);
const sigma = document.getElementById(`sigma`);


const input = document.getElementById("message-body");
const send = document.getElementById("send");
input.disabled = true;
send.disabled = true;
input.addEventListener("keydown", function(event) {
  if (event.keyCode === 13) {
      buttonClick();
  }
});


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




// ------------ TURN CHANGE BART is the first player. TURN FUNCTION MADE FOR 3 PLAYERS!!! ------------- //
let onlineUsers = new Set();
let turn = 3;

document.addEventListener(`click`, function(e) {
  if (pubnub._config.UUID === `bart`) {
    input.disabled = false;
    send.disabled = false;
  }
}, {once: true})

const checkUser = () => {
  turn = turn - 1;
  if(turn === 0) turn = 3;
  if (onlineUsers.size === turn)
   {
    input.disabled = false;
    send.disabled = false;
  } else {
    input.disabled = true;
    send.disabled = true;
  }
}
// ------------ TURN CHANGE ------------- //




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
      showMessage(messageEvent.message.description);
      checkUser(messageEvent.message.description);
      myListener3(messageEvent.message.description);


      console.log(messageEvent);

      // if(messageEvent.publisher !== UUID) {
      //   input.disabled = false;
      //   send.disabled = false;
      // }
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














// ------------------------ OLD SPAGHETTI CODE -----------------------------------


const hexAll = Array.from(document.querySelectorAll(`.hex`));
let hexRow = Array.from(document.querySelectorAll(`.hex-row`));
hexRow = hexRow.map((m) => Array.from(m.children));

hexAll[0].classList.add(`merchant`);
hexAll[0].classList.add(`class-brown`);
hexAll[1].classList.add(`class-green`);
hexAll[8].classList.add(`class-orange`);
hexAll[9].classList.add(`class-green`);

let randomArea0 = [hexAll[0], hexAll[1], hexAll[8], hexAll[9]];
let randomArea1 = [hexAll[2], hexAll[3], hexAll[10], hexAll[11]];
let randomArea2 = [hexAll[4], hexAll[5], hexAll[12], hexAll[13]];
let randomArea3 = [hexAll[6], hexAll[7], hexAll[14], hexAll[15]];
let randomArea4 = [hexAll[16], hexAll[17], hexAll[24], hexAll[25]];
let randomArea5 = [hexAll[18], hexAll[19], hexAll[26], hexAll[27]];
let randomArea6 = [hexAll[20], hexAll[21], hexAll[28], hexAll[29]];
let randomArea7 = [hexAll[22], hexAll[23], hexAll[30], hexAll[31]];
let randomArea8 = [hexAll[32], hexAll[33], hexAll[40], hexAll[41]];
let randomArea9 = [hexAll[34], hexAll[35], hexAll[42], hexAll[43]];
let randomArea10 = [hexAll[36], hexAll[37], hexAll[44], hexAll[45]];
let randomArea11 = [hexAll[38], hexAll[39], hexAll[46], hexAll[47]];

let allArea = [
  randomArea0,
  randomArea1,
  randomArea2,
  randomArea3,
  randomArea4,
  randomArea5,
  randomArea6,
  randomArea7,
  randomArea8,
  randomArea9,
  randomArea10,
  randomArea11,
];

// HUD Display
const hudMerchant = document.querySelector(`.hud-merchant`);
const hudTown = document.querySelector(`.hud-town`);

const buildTown = document.getElementById(`buildTown`);
const confirmBtn = document.getElementById(`confirmBtn`);

const collectFood = document.getElementById(`collectFood`);
const buildStructure = document.getElementById(`buildStructure`);
const burnTown = document.getElementById(`burnTown`);

const containerStructure = document.getElementById(`containerStructure`);
const academyBtn = document.getElementById(`academyBtn`);

const checkResource = function (f, w, s) {
  if (foodValue >= f && woodValue >= w && stoneValue >= s) return true;
  else return false;
};




const colorArr = [
`red`,
`green`,
`yellow`,
`brown`,
`pink`,
`purple`,
`black`,
`orange`,
`white`
]


const hex4 = document.getElementById(`hex4`);
let hexChild = [];

function createSmall() {
  for (let i = 0; i < 9; i++) {
    const hexSmall = document.createElement("div");
    hexSmall.style.backgroundColor = colorArr[i];
    hexSmall.classList.add(`hex-small`);
    hexChild.push(hexSmall);
    hex4.appendChild(hexChild[i]);
  }
};


// createSmall();


// hexChild[0].classList.add(`shit`);
// hexChild[1].classList.add(`shit`);
// hexChild[2].classList.add(`shit`);
// hexChild[3].classList.add(`shit`);



// let bgImg;

// academyBtn.addEventListener(`click`, function () {
//   if (!checkResource(1, 1, 1)) {
//     bgImg = window.getComputedStyle(townPosition);
//     townPosition.style.backgroundImage = `url("file:///C:/Users/Bartek/Desktop/Web%20Development/Settlers/img/tower.png")`;
//   }
// });




// const foodContainer = document.getElementById(`foodValue`);
// const woodContainer = document.getElementById(`woodValue`);
// const stoneContainer = document.getElementById(`stoneValue`);
// const goldContainer = document.getElementById(`goldValue`);
// const ideaContainer = document.getElementById(`ideaValue`);
// let foodValue = Number(foodContainer.innerHTML);
// let woodValue = Number(woodContainer.innerHTML);
// let stoneValue = Number(stoneContainer.innerHTML);
// let goldValue = Number(goldContainer.innerHTML);
// let ideaValue = Number(ideaContainer.innerHTML);
// buildStructure.addEventListener(`click`, function () {
//   containerStructure.style.display = `block`;
//   confirmBtn.style.display = `none`;
// });
