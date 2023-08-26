"use strict";

const UUID = prompt(`Jak masz na imie?`);

const firstDiv = document.getElementById(`firstDiv`);
const lastDiv = document.getElementById(`lastDiv`);

firstDiv.style.backgroundColor = `red`;

const alpha = document.getElementById(`alpha`);
const betha = document.getElementById(`betha`);
const gamma = document.getElementById(`gamma`);
const sigma = document.getElementById(`sigma`);

class Player {
  constructor(name, nr, color) {
    this.name = name;
    this.nr = nr;
    this.color = color;
  }
}

const setPlayer = document.getElementById(`setPlayer`);
setPlayer.addEventListener(`click`, function () {
  const num = Math.ceil(playersNumber / onlineUsers.size);
  if (onlineUsers.size === 3) color = `red`;
  else if (onlineUsers.size === 2) color = `blue`;
  else if (onlineUsers.size === 1) color = `green`;
  else alert(`Liczba graczy musi wynosic 1-3`);
  window["player" + num] = new Player(UUID, num, color);
  console.log();
});

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

const input = document.getElementById("message-body");
const send = document.getElementById("send");
input.disabled = true;
send.disabled = true;
input.addEventListener("keydown", function (event) {
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
      // myListener3(messageEvent.message.description);

      console.log(messageEvent);

      // if(messageEvent.publisher !== UUID) {
      //   input.disabled = false;
      //   send.disabled = false;
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

hexAll.forEach((el, index) =>
  el.addEventListener(`click`, function (e) {
    console.log(index);
  })
);

// HUD Display
const hudMerchant = document.querySelector(`.hud-merchant`);
const hudTown = document.querySelector(`.hud-town`);

const settleBtn = document.getElementById(`settleBtn`);

const confirmBtn = document.getElementById(`confirmBtn`);

const collectFood = document.getElementById(`collectFood`);
const buildStructure = document.getElementById(`buildStructure`);
const burnTown = document.getElementById(`burnTown`);

const containerStructure = document.getElementById(`containerStructure`);
const academyBtn = document.getElementById(`academyBtn`);
// HUD Display

// Array of 4 land piece. One big array of 12 cafelkas. Each one has 4 Hexes of land//
const hexArea = [];
const hexInRow = hexAll.length / 6; //!!!!!!!Devine by 6 only when you have 6 HEX ROWS on the map!!!!!!!!!!!!

const gather4hex = function (x) {
  const arr4hex = [
    hexAll[x],
    hexAll[x + 1],
    hexAll[x + hexInRow],
    hexAll[x + hexInRow + 1],
  ];
  hexArea.push(arr4hex);
};

for (let i = 0; i < hexAll.length / 6; i = i + 2) {
  gather4hex(i);
}
for (let i = (hexAll.length / 6) * 2; i < (hexAll.length / 6) * 3; i = i + 2) {
  gather4hex(i);
}
for (let i = (hexAll.length / 6) * 4; i < (hexAll.length / 6) * 5; i = i + 2) {
  gather4hex(i);
}
// Array of 4 land piece. One big array of 12 cafelkas. Each one has 4 Hexes of land//



/////////////////////////// CLASS CLASS CLASS ////////////////////////////////////
// The most important class of each HEX //

const colorArr = [
  `red`,
  `green`,
  `yellow`,
  `brown`,
  `pink`,
  `purple`,
  `black`,
  `orange`,
  `white`,
];


class Hex {
  constructor(id, type, town, vis) {
    this.id = id;
    this.type = type;
    this.town = town;
    this.vis = vis;

    this.createSmall = function () {
      let hexChild = [];
      for (let i = 0; i < 9; i++) {
        const hexSmall = document.createElement("div");
        // hexSmall.style.backgroundColor = colorArr[i];
        hexSmall.classList.add(`hex-small`);
        hexChild.push(hexSmall);
      }

      for (let i = 0; i < hexChild.length; i++) {
        this.id.appendChild(hexChild[i]);
      }
    };

    // Draw the type of the land
    this.chooseLand = function () {
      const x = Math.ceil(Math.random() * 5);
      if (x === 1) return `water`;
      else if (x === 2) return `grass`;
      else if (x === 3) return `forest`;
      else if (x === 4) return `mountain`;
      else if (x === 5) return `plain`;
    };

    this.getType = () => {
      hexArea.forEach((el) => {
        if (el.includes(this.id)) {
          el.forEach((el) => {
            el.object.type = this.chooseLand();
            el.object.vis = true;
            el.classList.add(`class-${el.object.type}`);
          });
        }
      });
    };

    this.createSmall(); //Fires after object begin. Create 9 small divs inside big Hex.
  }
}

class Town {
  constructor(player, id, port, academy, fortress ) {
    this.player = player;
    this.id = id;

    this.showHudTown = () => (hudTown.style.display = `block`);
    this.hideHudTown = () => (hudTown.style.display = `none`);


    this.buildStructure = (param) => {
      this.id.classList.add(`param`);
      this.param = true;
    };

    this.id.object.town = true;
  }
}

settleBtn.addEventListener(`click`, function () {
  merchantPosition.merchant.settle();
});


///// CLASS MERCHANT /////
let merchantPosition;
class Merchant {
  constructor(player, id) {
    this.player = player;
    this.id = id;

    this.showMerchant = () => id.classList.add(`merchant`);
    this.hideMerchant = () => id.classList.remove(`merchant`);
    this.showHudMerchant = () => (hudMerchant.style.display = `block`);
    this.hideHudMerchant = () => (hudMerchant.style.display = `none`);

    this.deleteMerchant = () => {
      id.classList.remove(`merchant`);
      delete this.id.merchant;
    };

    this.settle = () => {
      this.id.town = new Town(UUID, this.id);
      this.id.childNodes[4].classList.add(`town`);
      hexAll.forEach((el) => {
        if (el.possibleMove) {
          el.possibleMove.deletePossibleMove();
        }
      });
      this.hideHudMerchant();
      this.deleteMerchant();
      merchantPosition = undefined;
    };

    this.whereToGo = () => {
      merchantPosition = this.id;
      let offsetAll = [];
      for (let i = 0; i < hexAll.length; i++) {
        offsetAll[i] = [hexAll[i].offsetLeft, hexAll[i].offsetTop];
      }

      this.showHudMerchant();

      for (let i = 0; i < hexAll.length; i++) {
        if (
          offsetAll[i][0] > this.id.offsetLeft - 130 &&
          offsetAll[i][0] < this.id.offsetLeft + 130 &&
          offsetAll[i][1] < this.id.offsetTop + 130 &&
          offsetAll[i][1] > this.id.offsetTop - 130 &&
          !hexAll[i].merchant
        ) {
          const possibleMove = new PossibleMove(UUID, hexAll[i]);
          hexAll[i].possibleMove = possibleMove;
          // hexAll[i].possibleMove.showPossibleMove();
        }
      }
    };

    this.showMerchant(); //fires after create object
  }
}


///// CLASS POSSIBLEMOVE /////
class PossibleMove {
  constructor(player, id) {
    this.player = player;
    this.id = id;
    this.showPossibleMove = () => this.id.classList.add(`possible-move`);

    this.deletePossibleMove = () => {
      id.classList.remove(`possible-move`);
      delete this.id.possibleMove;
    };

    this.showPossibleMove(); //fires after create object
  }
}

//Put Merchants on the board
hexAll[0].merchant = new Merchant(UUID, hexAll[0]);
hexAll[35].merchant = new Merchant(UUID, hexAll[35]);

hexAll.forEach((el) => {
  const newHex = new Hex(el, undefined, false, false);
  el.object = newHex;
});




// --------------- CLICK LISTENERS FIRES METHODS --------------------
// where to go, create PossibleMove //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.merchant) {
      el.merchant.whereToGo();
    }
  });
});

// Edit this function. getType fires when new troops object is creating in Hex!!! //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (!el.object.vis && el.possibleMove) {
      el.object.getType();
    }
  });
});

// ----- move merchant ----- //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.possibleMove) {
      el.merchant = new Merchant(UUID, el);
      merchantPosition.merchant.deleteMerchant();

      hexAll.forEach((el) => {
        if (el.possibleMove) {
          el.possibleMove.deletePossibleMove();
        }
      });
      el.merchant.hideHudMerchant();
      merchantPosition = undefined;
    }
  });
});


hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.town) {
      el.town.showHudTown();
    } else {hudTown.style.display = `none`}; // I need to make prototype of each object and call function hideHudTown from proto //
  });
});

// ---------------------------------------

// const div = document.createElement('div');
// div.classList.add(`hex`);
// firstDiv.appendChild(div);
// div.myobject = { hello: 'world' };
// div.addEventListener(`click`, function() {
//   console.log(div.myobject);
// })

// let i;
// for (i = 1; i < 4; i++) {
//   window["value" + i] = i;
// }

const checkResource = function (f, w, s) {
  if (foodValue >= f && woodValue >= w && stoneValue >= s) return true;
  else return false;
};

// createSmall();

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
