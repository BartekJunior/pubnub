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
const startGame = document.getElementById(`startGame`);
startGame.style.display = `none`;

// HUD Town
const gameContainer = document.getElementById(`gameContainer`);

const hudMerchant = document.querySelector(`.hud-merchant`);
const settleBtn = document.getElementById(`settleBtn`);

const hudTown = document.querySelector(`.hud-town`);
const containerStructure = document.getElementById(`containerStructure`);
const containerRecruit = document.getElementById(`containerRecruit`);

const buildStructure = document.getElementById(`buildStructure`);
const collectResourceBtn = document.getElementById(`collectResourceBtn`);
const recruitBtn = document.getElementById(`recruitBtn`);

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

// troops buttons
const merchantBtn = document.getElementById(`merchantBtn`);
const infantryBtn = document.getElementById(`infantryBtn`);
const cavalryBtn = document.getElementById(`cavalryBtn`);
const elephantBtn = document.getElementById(`elephantBtn`);

const infantryRecruitNr = document.getElementById(`infantryRecruitNr`);
const cavalryRecruitNr = document.getElementById(`cavalryRecruitNr`);
const elephantRecruitNr = document.getElementById(`elephantRecruitNr`);
const merchantRecruitNr = document.getElementById(`merchantRecruitNr`);

const confirmRecruitBtn = document.getElementById(`confirmRecruitBtn`);
const cancelRecruitBtn = document.getElementById(`cancelRecruitBtn`);

const hudTroops = document.getElementById(`hudTroops`);
const merchantRecruited = document.getElementById(`merchantRecruited`);
const infantryRecruited = document.getElementById(`infantryRecruited`);
const cavalryRecruited = document.getElementById(`cavalryRecruited`);
const elephantRecruited = document.getElementById(`elephantRecruited`);

// move buttons
const containerMoveBtn = document.getElementById(`containerMoveBtn`);

const startMoveBtn = document.getElementById(`startMoveBtn`);
const confirmGroupBtn = document.getElementById(`confirmGroupBtn`);
const confirmMoveBtn = document.getElementById(`confirmMoveBtn`);
const cancelMoveBtn = document.getElementById(`cancelMoveBtn`);

confirmGroupBtn.disabled = true;
confirmMoveBtn.disabled = true;

// OOOOOOOOOOOOOOOMMMMMMMMMMMMMMMMMGGGGGGGGGGGGGGGGGGGGGG //

//resource variables
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
// Console deafult index of clicked Hex
hexAll.forEach((el, index) =>
  el.addEventListener(`click`, function (e) {
    console.log(index);
  })
);

// Show HudMerchant
hexAll.forEach((el) =>
  el.addEventListener(`click`, function (e) {
    if (el.troops && el.troops.soldiers.some((el) => el.type === `merchant`))
      Merchant.prototype.showHudMerchant();
    // else Merchant.prototype.hideHudMerchant();
  })
);

// MMMMMMOOOOOOOOOOOOVVVVVVVVVVVEEEEEEEEEEEEEEEEEE //
// MMMMMMOOOOOOOOOOOOVVVVVVVVVVVEEEEEEEEEEEEEEEEEE //
// MMMMMMOOOOOOOOOOOOVVVVVVVVVVVEEEEEEEEEEEEEEEEEE //
// MMMMMMOOOOOOOOOOOOVVVVVVVVVVVEEEEEEEEEEEEEEEEEE //

startMoveBtn.addEventListener(`click`, function () {
  Troops.prototype.startMoveBtn();
  Troops.prototype.soldiersHud();
});

confirmGroupBtn.addEventListener("click", () => {
  Troops.prototype.whereToGo();
});

confirmMoveBtn.addEventListener("click", function () {

});

cancelMoveBtn.addEventListener("click", function () {
  groupHud.map(el => el.classList.remove(`soldier-selected`));
  groupHud = [];
  selectedSoldiers = [];
  PossibleMove.prototype.deletePossibleMove();
  console.log("Move canceled");
});

// Click PossibleMove to move Troops
hexAll.forEach(el => {
  el.addEventListener(`click`, function() {
    if (el.possibleMove) {
      if (!el.troops) {
        el.troops = new Troops (UUID, el, window[`player` + UUID].color)
        console.log(`troops made`);
      }
      if ((selectedSoldiers.length + el.troops.size) > 4) {
        alert(`Na jednym polu mogą znajdować się tylko 4 jednostki wojskowe`);
        PossibleMove.prototype.deletePossibleMove();
        troopsPosition = undefined;
        selectedSoldiers = [];
        groupHud = [];

      } else {
        el.troops.soldiers.push(...selectedSoldiers);
        el.troops.soldiers.map(item => item.id = el);
        troopsPosition.troops.soldiers = troopsPosition.troops.soldiers.filter(soldier => !selectedSoldiers.includes(soldier));

        el.troops.showSoldierHex();
        el.troops.calcSize();
        troopsPosition.troops.showSoldierHex();
        troopsPosition.troops.calcSize();
        PossibleMove.prototype.deletePossibleMove();
        troopsPosition = undefined;
        selectedSoldiers = [];
        groupHud = [];
      }
    }
  })
})


// Edit this function. getType fires when new troops hex is creating in Hex!!! //
// hexAll.forEach((el) => {
//   el.addEventListener(`click`, function () {
//     if (!el.hex.vis && el.possibleMove) {
//       el.hex.getLand();
//     }
//   });
// });



// ----- show/hide hudTown  ----- //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.town && el.town.player === UUID) {
      // if (town) town.id.hex.collectible = false;
      town = el.town;
      town.showHudTown();
      town.checkBuildedStructure();
    } else if (town && !el.possibleResource && clickedRes.length) {
      alert(`Dokończ zbieranie surowców`);
    } else if (town && !el.possibleResource && !clickedRes.length) {
      hexAll.forEach((el) => {
        if (el.possibleResource) el.possibleResource.deletePossibleResource();
        town.id.hex.collectible = false;
      });
      town.hideHudTown();
      town.hideContainerStructure();
      town.hideContainerRecruit();
      town.hideConfirmCollectBtn();
      town.hideCancelCollectBtn();
      town = undefined;
    }
  });
});

// ----- show Troops  ----- //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.troops) {
      Troops.prototype.hideHudTroops();
      el.troops.showHudTroops();
      troopsPosition = el;

    } else if (selectedSoldiers.length > 0 && !el.possibleMove) {
      alert(`Dokończ ruch jednostek albo Anuluj ruch`);
    } else Troops.prototype.hideHudTroops();
  });
});



// settle Town and build structures //
settleBtn.addEventListener(`click`, function () {
  const merchantObj =  troopsPosition.troops.soldiers.find(el => el.type === `merchant`);
  console.log(merchantObj);
  merchantObj.settle();

  // Merchant.prototype.settle();
});

buildStructure.addEventListener(`click`, function () {
  town.showContainerStructure();
});

fortressBtn.addEventListener(`click`, function () {
  town.buildStructure(`fortress`);
  town.changeStructureBtn(`fortress`, `none`);
});

academyBtn.addEventListener(`click`, function () {
  town.buildStructure(`academy`);
  town.changeStructureBtn(`academy`, `none`);
});

portBtn.addEventListener(`click`, function () {
  town.buildStructure(`port`);
  town.changeStructureBtn(`port`, `none`);
});

marketBtn.addEventListener(`click`, function () {
  town.buildStructure(`market`);
  town.changeStructureBtn(`market`, `none`);
});

obeliskBtn.addEventListener(`click`, function () {
  town.buildStructure(`obelisk`);
  town.changeStructureBtn(`obelisk`, `none`);
});

templeBtn.addEventListener(`click`, function () {
  town.buildStructure(`temple`);
  town.changeStructureBtn(`temple`, `none`);
});

observatoryBtn.addEventListener(`click`, function () {
  town.buildStructure(`observatory`);
  town.changeStructureBtn(`observatory`, `none`);
});

//----------- RECRUITING TROOPS -----------//
// troops variables
let tempSoldiers = [];
// HUD buttons Recruit //
recruitBtn.addEventListener(`click`, function () {
  town.showContainerRecruit();
});

confirmRecruitBtn.addEventListener(`click`, function () {
  town.confirmRecruit();
});

cancelRecruitBtn.addEventListener(`click`, function () {
  town.cancelRecruit();
});

// Recruiting //
merchantBtn.addEventListener(`click`, function () {
  town.recruitTempSoldier(`merchant`);
});

infantryBtn.addEventListener(`click`, function () {
  town.recruitTempSoldier(`infantry`);
});

cavalryBtn.addEventListener(`click`, function () {
  town.recruitTempSoldier(`cavalry`);
});

elephantBtn.addEventListener(`click`, function () {
  town.recruitTempSoldier(`elephant`);
});

//----------- COLLECTING RESOURCE -----------//
//click Collect resource. Start collecting //
collectResourceBtn.addEventListener(`click`, function () {
  town.hideContainerStructure();
  town.possibleResource();
});

let clickedRes = [];
/// Collect tempResource with global variable arr. Middle collecting ///
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
  town.hideConfirmCollectBtn();
  town.hideCancelCollectBtn();
});

// --------------- DISABLE CLICKS ---------------- //
// Disable click when you click on enemy merchant
gameContainer.addEventListener("click", handler, true);
function handler(e) {
  if (e.target.merchant && e.target.merchant.player !== UUID) {
    e.stopPropagation();
    e.preventDefault();
  }
}

// ---------------  TURN MECHANICS ---------------- //
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

// Turn mechanics.. Dont ask me.. But it works.. Please God let it work..
const checkAction = function () {
  if (player.action > 0) {
    hexAll.forEach((el) => el.classList.remove(`delete-click`));
    player.turnActive = true;
  } else if (player.action <= 0) {
    hexAll.forEach((el) => el.classList.add(`delete-click`));
    player.turnActive = false;
    player.actionDone = true;

    alert(`Twoja tura sie zakonczyla, click end turn`);
    endTurn.style.display = `block`;
    clearInterval(turnInterval);
    town.hideHudTown();
  }
};

let turnInterval;
function startTurnInterval() {
  turnInterval = setInterval(() => {
    console.log(`checkAction is running`);
    checkAction();
  }, 1000);
}

// --------------- READ MAP FUNCTIONS ---------------- //
let hexesOnMapArr = [];
let townsOnMapArr = [];
let merchantsOnMapArr = [];

let hexesOnMap;
let townsOnMap;
let merchantsOnMap;

const readMerchant = () => {
  hexAll.forEach((el, index) => {
    if (el.merchant) {
      let merchantOnMap = {
        type: el.merchant.type,
        player: el.merchant.player,
        id: index,
        color: el.merchant.color,
      };
      merchantsOnMapArr.push(merchantOnMap);
    }
    merchantsOnMap = {
      type: `merchant`,
      sender: UUID,
      value: merchantsOnMapArr,
    };
  });
};

const paintMerchant = () => {
  hexAll.forEach((el, index) => {
    if (el.merchant) {
      el.merchant.deleteMerchant();
      console.log(`deleting merchant from ${index}`);
    }

    if (!el.merchant) {
      for (let i = 0; i < merchantsOnMap.value.length; i++) {
        if (index === merchantsOnMap.value[i].id) {
          console.log(`creating merchant on ${index}`);
          el.merchant = new Merchant(
            merchantsOnMap.value[i].player,
            el,
            merchantsOnMap.value[i].color
          );

          // el.classList.add(`merchant${el.merchant.color}`);
        }
      }
    }
  });
};

const readHex = () => {
  hexAll.forEach((el, index) => {
    if (el.hex.type === `hex` && el.hex.vis === true) {
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
    };
  });
};

const paintHex = () => {
  hexAll.forEach((el, index) => {
    for (let i = 0; i < hexesOnMap.value.length; i++) {
      if (index === hexesOnMap.value[i].id) {
        el.hex = new Hex(
          el,
          hexesOnMap.value[i].land,
          hexesOnMap.value[i].vis,
          hexesOnMap.value[i].resource,
          hexesOnMap.value[i].collectible
        );
        el.classList.add(`class-${el.hex.land}`);
      }
    }
  });
};

const readTown = () => {
  hexAll.forEach((el, index) => {
    if (el.town && el.town.player === UUID) {
      let townOnMap = {
        type: el.town.type,
        player: el.town.player,
        id: index,
        color: el.town.color,
        size: el.town.size,
        port: el.town.structure.port,
        academy: el.town.structure.academy,
        fortress: el.town.structure.fortress,
        market: el.town.structure.market,
        obelisk: el.town.structure.obelisk,
        temple: el.town.structure.temple,
        observatory: el.town.structure.observatory,
      };
      townsOnMapArr.push(townOnMap);
    }
    townsOnMap = {
      type: `town`,
      value: townsOnMapArr,
    };
  });
};

const paintTown = () => {
  hexAll.forEach((el, index) => {
    for (let i = 0; i < townsOnMap.value.length; i++) {
      if (index === townsOnMap.value[i].id) {
        el.town = new Town(
          townsOnMap.value[i].player,
          el,
          townsOnMap.value[i].color,
          townsOnMap.value[i].size,
          townsOnMap.value[i].port,
          townsOnMap.value[i].academy,
          townsOnMap.value[i].fortress,
          townsOnMap.value[i].market,
          townsOnMap.value[i].obelisk,
          townsOnMap.value[i].temple,
          townsOnMap.value[i].observatory
        );
        el.childNodes[4].classList.add(`town${el.town.color}`);

        if (el.town.structure.port) el.town.buildStructure(`port`);
        if (el.town.structure.academy) el.town.buildStructure(`academy`);
        if (el.town.structure.fortress) el.town.buildStructure(`fortress`);
        if (el.town.structure.market) el.town.buildStructure(`market`);
        if (el.town.structure.obelisk) el.town.buildStructure(`obelisk`);
        if (el.town.structure.temple) el.town.buildStructure(`temple`);
        if (el.town.structure.observatory)
          el.town.buildStructure(`observatory`);
      }
    }
  });
};

startGame.addEventListener(`click`, () => {
  startGame.style.display = `none`;
  startTurnInterval();
});

endTurn.addEventListener(`click`, () => {
  readHex();
  readTown();
  readMerchant();
  publishMessage(hexesOnMap);
  publishMessage(townsOnMap);
  publishMessage(merchantsOnMap);

  hexesOnMapArr = [];
  townsOnMapArr = [];
  merchantsOnMapArr = [];

  hexesOnMap = undefined;
  townsOnMap = undefined;
  merchantsOnMap = undefined;

  publishMessage(window[`player` + UUID]);
  endTurn.style.display = `none`;
});

const ha = {
  name: `chuj`,
  age: 15,
};

const he = {
  name: `chaj`,
  age: 67,
};
const arr = [[1, 2, 3], ha, he];

arr.forEach((el) => {
  console.log(`iterararaarra`);

  el.age = el.age + 30;
});

console.log(arr);
