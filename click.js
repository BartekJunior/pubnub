`use strict`;

//Put Merchants on the board
hexAll[0].merchant = new Merchant(UUID, hexAll[0]);
hexAll[35].merchant = new Merchant(UUID, hexAll[35]);

//Create all HEXES on the board
hexAll.forEach((el) => {
  const newHex = new Hex(el, undefined, false);
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

const confirmBtn = document.getElementById(`confirmBtn`);

const collectResourceBtn = document.getElementById(`collectResourceBtn`);
const buildStructure = document.getElementById(`buildStructure`);
const burnTown = document.getElementById(`burnTown`);


const containerStructure = document.getElementById(`containerStructure`);
const academyBtn = document.getElementById(`academyBtn`);
const fortressBtn = document.getElementById(`fortressBtn`);
const portBtn = document.getElementById(`portBtn`);
const marketBtn = document.getElementById(`marketBtn`);

const p1FoodValue = document.getElementById(`p1FoodValue`);
const p1WoodValue = document.getElementById(`p1WoodValue`);
const p1StoneValue = document.getElementById(`p1StoneValue`);
const p1GoldValue = document.getElementById(`p1GoldValue`);
const p1IdeaValue = document.getElementById(`p1IdeaValue`);
const p1MoraleValue = document.getElementById(`p1MoraleValue`);




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

let town;
// ----- show hudTown  ----- //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.town) {
      town = el.town;
      town.showHudTown();
    } else if (town) {
      town.hideHudTown();
      town.hideContainerStructure();
      town = undefined;
    } // I need to make prototype of each object and call function hideHudTown from proto //
  });
});

// settle Town //
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

portBtn.addEventListener(`click`, function () {
  town.buildStructure(`port`);
});

marketBtn.addEventListener(`click`, function () {
  town.buildStructure(`market`);
});

collectResourceBtn.addEventListener(`click`, function (event) {
  town.possibleResource();
});





const resourceValue = document.querySelectorAll(`.resource-value`);
resourceValue.forEach((el) => {
  el.innerHTML = `value`;
})