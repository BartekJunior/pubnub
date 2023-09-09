`use strict`;

// HUD Player

const p1Global = document.getElementById(`p1Global`);
const p2Global = document.getElementById(`p2Global`);
const p3Global = document.getElementById(`p3Global`);

const playerName = document.getElementById(`playerName`);

p1Global.style.display = `none`;
p2Global.style.display = `none`;
p3Global.style.display = `none`;

const setPlayer = document.getElementById(`setPlayer`);
const sendPlayer = document.getElementById(`sendPlayer`);
const endTurn = document.getElementById(`endTurn`);

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

// Edit this function. getType fires when new troops hex is creating in Hex!!! //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (!el.hex.vis && el.possibleMove) {
      el.hex.getLand(); //Get type and resource from each new discovered Hex
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
    } 
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
const checkActionFirst = function () {
  if (player.action === 3) {
    hexAll.forEach((el) => el.classList.remove(`delete-click`));
    player.turnActive = true;
  } else if (player.action <= 0) {
    hexAll.forEach((el) => el.classList.add(`delete-click`));
    player.turnActive = false;
  }
};


const checkAction = function () {
  if (player.action > 0) {
    hexAll.forEach((el) => el.classList.remove(`delete-click`));
    player.turnActive = true;
  } else if (player.action <= 0) {
    hexAll.forEach((el) => el.classList.add(`delete-click`));
    player.turnActive = false;

    alert(`Twoja tura sie zakonczyla, click end turn`)
    endTurn.style.display = `block`;
    clearInterval(turnInterval);
  }
};


let turnInterval;
function startTurnInterval() {
  turnInterval = setInterval(() => {
    console.log(`checkAction is running`);
    
    checkAction();
  }, 1000);
}






// --------------- READ MAP FUNCTION ---------------- //

let hexesOnMapArr = [];
let hexesOnMap;
let merchantOnMap;
let townOnMap;


const readMap = () => {
  hexAll.forEach((el, index) => {
    if (el.hex.type === 'hex' && el.hex.vis === true) {
      let hexOnMap = {
        type: el.hex.type,
        id: index,
        land: el.hex.land,
        vis: el.hex.vis,
        resource: el.hex.resource,
        collectible: el.hex.collectible,
      };
      hexesOnMapArr.push(hexOnMap);
    }
    hexesOnMap = {
      type: `hex`,
      value: hexesOnMapArr,
    }
  });
};





const paintHex = () => {
  hexAll.forEach((el, index) => {
    for (let i = 0; i < hexesOnMap.value.length; i++) {
      if (index === hexesOnMap.value[i].id) {
        el.hex = new Hex(el, hexesOnMap.value[i].land, hexesOnMap.value[i].vis, hexesOnMap.value[i].resource, hexesOnMap.value[i].collectible);
        el.classList.add(`class-${el.hex.land}`);
      }
    }

  })
}



endTurn.addEventListener(`click`, () => {
  readMap();
  publishMessage(hexesOnMap);
  publishMessage(window[`player` + UUID]);
  endTurn.style.display = `none`;
});