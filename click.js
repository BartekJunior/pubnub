`use strict`;

//Put Merchants on the board
hexAll[0].merchant = new Merchant(UUID, hexAll[0]);
hexAll[35].merchant = new Merchant(UUID, hexAll[35]);


//Create all HEXES on the board
hexAll.forEach((el) => {
  const newHex = new Hex(el, undefined, false);
  el.object = newHex;
});

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
const fortressBtn = document.getElementById(`fortressBtn`);
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
// settle Town //
settleBtn.addEventListener(`click`, function () {
    // town = new Town(UUID, undefined);
    merchantPosition.merchant.settle();
  });


// ----- show hudTown  ----- //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.town) {
        town = el.town;
      el.town.showHudTown();
    } else {
      hudTown.style.display = `none`;
    } // I need to make prototype of each object and call function hideHudTown from proto //
  });
});

buildStructure.addEventListener(`click`, function() {
    town.showContainerStructure();
})

fortressBtn.addEventListener(`click`, function() {
    town.buildStructure(`fortress`);
})

