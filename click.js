`use strict`;

//Put Merchants on the board
hexAll[0].merchant = new Merchant(UUID, hexAll[0]);
hexAll[35].merchant = new Merchant(UUID, hexAll[35]);

//Create all HEXES on the board
hexAll.forEach((el) => {
  const newHex = new Hex(el, undefined, false, undefined, false);
  el.object = newHex;
});

const setPlayer = document.getElementById(`setPlayer`);
setPlayer.addEventListener(`click`, function () {
  const num = Math.ceil(playersNumber / onlineUsers.size);
  if (onlineUsers.size === 3) color = `red`;
  else if (onlineUsers.size === 2) color = `blue`;
  else if (onlineUsers.size === 1) color = `green`;
  else alert(`Liczba graczy musi wynosic 1-3`);
  window["player" + num] = new Player(UUID, num, color, 2, 1, 0, 0, 0, 2);
});

// HUD Display
const hudMerchant = document.querySelector(`.hud-merchant`);
const hudTown = document.querySelector(`.hud-town`);

const settleBtn = document.getElementById(`settleBtn`);

const collectResourceBtn = document.getElementById(`collectResourceBtn`);
const confirmCollectBtn = document.getElementById(`confirmCollectBtn`);

const buildStructure = document.getElementById(`buildStructure`);
const burnTown = document.getElementById(`burnTown`);

const containerStructure = document.getElementById(`containerStructure`);

const academyBtn = document.getElementById(`academyBtn`);
const fortressBtn = document.getElementById(`fortressBtn`);
const portBtn = document.getElementById(`portBtn`);
const marketBtn = document.getElementById(`marketBtn`);
const obeliskBtn = document.getElementById(`obeliskBtn`);
const templeBtn = document.getElementById(`templeBtn`);
const observatoryBtn = document.getElementById(`observatoryBtn`);

const p1FoodValue = document.getElementById(`p1FoodValue`);
const p1WoodValue = document.getElementById(`p1WoodValue`);
const p1StoneValue = document.getElementById(`p1StoneValue`);
const p1GoldValue = document.getElementById(`p1GoldValue`);
const p1IdeaValue = document.getElementById(`p1IdeaValue`);
const p1MoraleValue = document.getElementById(`p1MoraleValue`);

const foodCollect = document.getElementById(`foodCollect`);
const woodCollect = document.getElementById(`woodCollect`);
const stoneCollect = document.getElementById(`stoneCollect`);
const goldCollect = document.getElementById(`goldCollect`);
const ideaCollect = document.getElementById(`ideaCollect`);
const moraleCollect = document.getElementById(`moraleCollect`);


const p1GlobalResource = {
  food: 2,
  wood: 1,
  stone: 0,
  gold: 0,
  idea: 2,
  morale: 2,
};

const p1TempResource = {
  food: 0,
  wood: 0,
  stone: 0,
  gold: 0,
  idea: 0,
  morale: 0,
};

p1FoodValue.innerHTML = p1GlobalResource.food;
p1WoodValue.innerHTML = p1GlobalResource.wood;
p1StoneValue.innerHTML = p1GlobalResource.stone;
p1GoldValue.innerHTML = p1GlobalResource.gold;
p1IdeaValue.innerHTML = p1GlobalResource.idea;
p1MoraleValue.innerHTML = p1GlobalResource.morale;

// HUD Display

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
      el.object.getType(); //Get type and resource from each new discovered Hex
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
//delete possiblemove when clicked somewhere else and not move merchant
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (!el.possibleMove && !el.merchant) {
      hexAll.forEach((el) => {
        if (el.possibleMove) el.possibleMove.deletePossibleMove();
      });
    }
  });
});

//delete possibleResource when clicked somewhere else and not collect
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (!el.possibleResource) {
      hexAll.forEach((el) => {
        if (el.possibleResource) el.possibleResource.deletePossibleResource();
      });
    }
  });
});

let town;
// ----- show/hide hudTown  ----- //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.town) {
      town = el.town;
      town.showHudTown();
    } else if (town && !el.possibleResource) {
      town.hideHudTown();
      town.hideContainerStructure();
      town.hideConfirmCollectBtn();

      town = undefined;
    } // I need to make prototype of each object and call function hideHudTown from proto //
  });
});

// settle Town and build structures //
settleBtn.addEventListener(`click`, function () {
  merchantPosition.merchant.settle();
});

buildStructure.addEventListener(`click`, function () {
  town.showContainerStructure();
});

fortressBtn.addEventListener(`click`, function () {
  town.buildStructure(`fortress`);
});

academyBtn.addEventListener(`click`, function () {
  town.buildStructure(`academy`);
});

portBtn.addEventListener(
  `click`,
  function () {
    town.buildStructure(`port`);
  },
  { once: true }
);

marketBtn.addEventListener(`click`, function () {
  town.buildStructure(`market`);
});

obeliskBtn.addEventListener(`click`, function () {
  town.buildStructure(`obelisk`);
});

templeBtn.addEventListener(`click`, function () {
  town.buildStructure(`temple`);
});

observatoryBtn.addEventListener(`click`, function () {
  town.buildStructure(`observatory`);
});

//click Collect resource. Start collecting //
collectResourceBtn.addEventListener(`click`, function () {
  town.hideContainerStructure();
  town.possibleResource();
});

/// Collect Temporary resource with global wariable arr. Middle collecting ///
let arr = [];
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.possibleResource && arr.length < town.size) {
      arr.push(el.possibleResource.resource);
      el.possibleResource.showConfirmCollectBtn();
      el.possibleResource.showTempResource();
      console.log(arr);
      el.removeEventListener("click", arguments.callee);
    }
  });
});

confirmCollectBtn.addEventListener(`click`, function() {
  window.possibleResource.updateGlobalResource();
  window.possibleResource.showGlobalResource();


})



// const resourceValue = document.querySelectorAll(`.resource-value`);
// resourceValue.forEach((el) => {
//   el.innerHTML = `value`;
// });
