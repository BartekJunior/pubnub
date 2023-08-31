`use strict`;



// HUD Display
const hudMerchant = document.querySelector(`.hud-merchant`);
const settleBtn = document.getElementById(`settleBtn`);

const hudTown = document.querySelector(`.hud-town`);
const containerStructure = document.getElementById(`containerStructure`);

const buildStructure = document.getElementById(`buildStructure`);
const collectResourceBtn = document.getElementById(`collectResourceBtn`);
const confirmCollectBtn = document.getElementById(`confirmCollectBtn`);

// building buttons
const academyBtn = document.getElementById(`academyBtn`);
const fortressBtn = document.getElementById(`fortressBtn`);
const portBtn = document.getElementById(`portBtn`);
const marketBtn = document.getElementById(`marketBtn`);
const obeliskBtn = document.getElementById(`obeliskBtn`);
const templeBtn = document.getElementById(`templeBtn`);
const observatoryBtn = document.getElementById(`observatoryBtn`);


const res = [`food`, `wood`, `stone`, `gold`, `idea`, `morale`];
const p1TempResource = {
  food: 0,
  wood: 0,
  stone: 0,
  gold: 0,
  idea: 0,
  morale: 0,
};

const p1GlobalResourceDiv = Array.from(
  document.querySelectorAll(`.resource-value`)
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

/// Collect Temporary resource with global wariable arr. Middle collecting ///
let clickedRes = [];
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.possibleResource && clickedRes.length < town.size) {
      clickedRes.push(el.possibleResource.resource);
      el.possibleResource.showConfirmCollectBtn();
      el.possibleResource.showTempResource();
      console.log(clickedRes);
      el.removeEventListener("click", arguments.callee);
    }
  });
});

// Update p1GlobalResource. Last stage odfcollect
confirmCollectBtn.addEventListener(`click`, function () {
  window.updateGlobalResource();
  town.hideConfirmCollectBtn();
});


