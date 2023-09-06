`use strict`;

// HUD Player

const p1Global = document.getElementById(`p1Global`);
const p2Global = document.getElementById(`p2Global`);
const p3Global = document.getElementById(`p3Global`);

const playerName = document.getElementById(`playerName`);

p1Global.style.display = `none`;
p2Global.style.display = `none`;
p3Global.style.display = `none`;






// HUD Town
const gameContainer = document.getElementById(`gameContainer`);

const hudMerchant = document.querySelector(`.hud-merchant`);
const settleBtn = document.getElementById(`settleBtn`);

const hudTown = document.querySelector(`.hud-town`);
const containerStructure = document.getElementById(`containerStructure`);

const buildStructure = document.getElementById(`buildStructure`);
const collectResourceBtn = document.getElementById(`collectResourceBtn`);
const confirmCollectBtn = document.getElementById(`confirmCollectBtn`);
const cancelCollectBtn = document.getElementById(`cancelCollectBtn`);

// building buttons
const academyBtn = document.getElementById(`academyBtn`);
const fortressBtn = document.getElementById(`fortressBtn`);
const portBtn = document.getElementById(`portBtn`);
const marketBtn = document.getElementById(`marketBtn`);
const obeliskBtn = document.getElementById(`obeliskBtn`);
const templeBtn = document.getElementById(`templeBtn`);
const observatoryBtn = document.getElementById(`observatoryBtn`);

const res = [`food`, `wood`, `stone`, `gold`, `idea`, `morale`];
let tempResource = {
  food: 0,
  wood: 0,
  stone: 0,
  gold: 0,
  idea: 0,
  morale: 0,
};


window.p1GlobalResourceDiv = Array.from(
  document.querySelectorAll(`.p1-resource-value`)
);
window.p2GlobalResourceDiv = Array.from(
  document.querySelectorAll(`.p2-resource-value`)
);
window.p3GlobalResourceDiv = Array.from(
  document.querySelectorAll(`.p3-resource-value`)
);

const collecting = Array.from(document.querySelectorAll(`.collecting`));

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
      el.merchant = new Merchant(UUID, el, window[`player` + UUID].color);
      merchantPosition.merchant.deleteMerchant();

      hexAll.forEach((el) => {
        if (el.possibleMove) {
          el.possibleMove.deletePossibleMove();
        }
      });
      el.merchant.hideHudMerchant();
      merchantPosition = undefined;
      window[`player` + UUID].action--;
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
    } else if (town && !el.possibleResource && clickedRes.length) {
      alert(`Dokończ zbieranie surowców`);
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

portBtn.addEventListener(`click`, function () {
  town.buildStructure(`port`);
});

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
/// Collect tempResource with global wariable arr. Middle collecting ///
let clickedRes = [];
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.possibleResource) el.possibleResource.collectTempResource();
  });
});
// Update GlobalResource. Last stage of collect
confirmCollectBtn.addEventListener(`click`, function () {
  town.updateGlobalResource();
  town.hideConfirmCollectBtn();
  window[`player` + UUID].action--;
});

// Cancel collect resources
cancelCollectBtn.addEventListener(`click`, function () {
  hexAll.forEach((el) => {
    if (el.possibleResource) {
      el.possibleResource.deleteTempResource();
      clickedRes = [];
      el.possibleResource.deletePossibleResource();
    }
  });
});






// --------------- DISABLE CLICKS ---------------- //

// Disable click when you click on enemy merchant
gameContainer.addEventListener("click", handler, true);
function handler(e) {
  if (e.target.merchant.player !== UUID) {
    // console.log(e.target);
    e.stopPropagation();
    e.preventDefault();
  }
}


// Disable click when its not your turn
let turnActive;
setInterval(() => {
  const player = window[`player` + UUID];


  if (!player.turnActive) {
    // publishMessage(player);

    // alert(`Twoja tura sie skonczyła`);
    gameContainer.addEventListener("click", handler, true);
    function handler(e) {
      e.stopPropagation();
      e.preventDefault();
    }
    // player.turnActive = false;
    // player.action = 3;

  }
}, 1000); // Check every second





