`use strict`;

// HUD Player
const hudGlobal = document.querySelector(`.hud-global`);
hudGlobal.hud = new Hud();

const p1Global = document.getElementById(`p1Global`);
const p2Global = document.getElementById(`p2Global`);
const p3Global = document.getElementById(`p3Global`);

p1Global.style.display = `none`;
p2Global.style.display = `none`;
p3Global.style.display = `none`;

const playerName = document.getElementById(`playerName`);

const p1ActionValue = document.getElementById(`p1ActionValue`);
const p2ActionValue = document.getElementById(`p2ActionValue`);
const p3ActionValue = document.getElementById(`p3ActionValue`);

const p1TreeBtn = document.getElementById(`p1TreeBtn`);
const p2TreeBtn = document.getElementById(`p2TreeBtn`);
const p3TreeBtn = document.getElementById(`p3TreeBtn`);


const setPlayer = document.getElementById(`setPlayer`);
const sendPlayer = document.getElementById(`sendPlayer`);
const endTurn = document.getElementById(`endTurn`);
const startGame = document.getElementById(`startGame`);
startGame.style.display = `none`;

const p1TechTree = document.getElementById(`p1TechTree`);
const p2TechTree = document.getElementById(`p2TechTree`);
const p3TechTree = document.getElementById(`p3TechTree`);

const p1TechTreeTitle = document.getElementById(`p1TechTreeTitle`);
const p2TechTreeTitle = document.getElementById(`p2TechTreeTitle`);
const p3TechTreeTitle = document.getElementById(`p3TechTreeTitle`);

const p1ExitTech = document.getElementById(`p1ExitTech`);
const p2ExitTech = document.getElementById(`p2ExitTech`);
const p3ExitTech = document.getElementById(`p3ExitTech`);


// HUD Town
const gameContainer = document.getElementById(`gameContainer`);

const hudMerchant = document.querySelector(`.hud-merchant`);
const settleBtn = document.getElementById(`settleBtn`);

const hudTown = document.querySelector(`.hud-town`);
const containerStructure = document.getElementById(`containerStructure`);
const containerRecruit = document.getElementById(`containerRecruit`);

const collectResourceBtn = document.getElementById(`collectResourceBtn`);
const buildStructureBtn = document.getElementById(`buildStructureBtn`);
const recruitBtn = document.getElementById(`recruitBtn`);
const burnTownBtn = document.getElementById(`burnTownBtn`);

const containerTempCollect = document.querySelector(`.container-temp-collect`);
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
const cancelBuild = document.getElementById(`cancelBuild`);

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
const moveBtnContainer = document.getElementById(`moveBtnContainer`);

const startMoveBtn = document.getElementById(`startMoveBtn`);
const confirmGroupBtn = document.getElementById(`confirmGroupBtn`);
const confirmMoveBtn = document.getElementById(`confirmMoveBtn`);
const cancelMoveBtn = document.getElementById(`cancelMoveBtn`);

// Hud Map
const rotateHud = document.getElementById(`hudRotateContainer`);
const rotateBtn = document.getElementById(`rotateBtn`);
const exploreBtn = document.getElementById(`exploreBtn`);

rotateHud.style.display = `none`;

// OOOOOOOOOOOOOOOMMMMMMMMMMMMMMMMMGGGGGGGGGGGGGGGGGGGGGG //

//resource variables
const res = [`food`, `wood`, `stone`, `gold`, `idea`, `culture`, `morale`];
let tempResource = {
  food: 0,
  wood: 0,
  stone: 0,
  gold: 0,
  idea: 0,
  culture: 0,
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


// ----- show/hide HUDTOWN  ----- //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (
      el.town &&
      el.town.player === player &&
      hudTown.style.display === `none` &&
      rotateHud.style.display === `none`
    ) {
      town = el.town;
      town.checkBuildedStructure();
      Hud.prototype.showHudTown();
    } else if (
      !el.possibleResource &&
      containerTempCollect.style.display === `flex`
    ) {
      alert(`Dokończ zbieranie surowców, albo Anuluj Zbiór`);
    } else if (town && containerStructure.style.display === `block`) {
      alert(`Dokończ budowę w mieście lub Anuluj Budowę`);
    } else if (town && containerRecruit.style.display === `flex`) {
      alert(`Dokończ rekrutację lub Anuluj Rekrutację`);
    } else if (rotateHud.style.display === `block`) {
      alert(`Odkryj Mapę!`);
    } else if (!el.town && !el.possibleResource) {
      Hud.prototype.hideHudTown();
      Hud.prototype.hideContainerStructure();
      Hud.prototype.hideContainerRecruit();
      town = undefined;
    }

    // else if (town && !el.possibleResource && !clickedRes.length) {
    //   hexAll.forEach((el) => {
    //     if (el.possibleResource) el.possibleResource.deletePossibleResource();
    //     town.id.hex.collectible = false;
    //   });
    //   Hud.prototype.hideHudTown();
    //   Hud.prototype.hideContainerStructure();
    //   Hud.prototype.hideContainerRecruit();
    //   Hud.prototype.hideContainerTempCollect();
    //   Hud.prototype.hideConfirmCollectBtn();
    //   Hud.prototype.hideCancelCollectBtn();
    //   town = undefined;
    // }
  });
});

// ----- show TROOPS and MERCHANT HUD  ----- //
hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.troops && !el.possibleMove) {
      Troops.prototype.hideHudTroops();
      el.troops.showHudTroops();
      troopsPosition = el;
    } else if (selectedSoldiers.length > 0 && !el.possibleMove) {
      alert(`Dokończ ruch jednostek albo Anuluj ruch`);
    } else {
      Troops.prototype.hideHudTroops();
    }

    if (el.troops && el.troops.soldiers.some((el) => el.type === `merchant`)) {
      Hud.prototype.showHudMerchant();
    } else {
      Hud.prototype.hideHudMerchant();
    }
  });
});

// MMMMMMOOOOOOOOOOOOVVVVVVVVVVVEEEEEEEEEEEEEEEEEE //
// MMMMMMOOOOOOOOOOOOVVVVVVVVVVVEEEEEEEEEEEEEEEEEE //
startMoveBtn.addEventListener(`click`, function () {
  Troops.prototype.startMoveBtn();
  Troops.prototype.soldiersHud();
  settleBtn.disabled = true;
  Hud.prototype.townBtnDisable();
});

confirmGroupBtn.addEventListener("click", () => {
  Troops.prototype.whereToGo();
});

confirmMoveBtn.addEventListener("click", function () {
  startMoveBtn.disabled = false;
  confirmGroupBtn.disabled = true;
  confirmMoveBtn.disabled = true;
  cancelMoveBtn.disabled = false;
  settleBtn.disabled = false;
  startMoveBtn.textContent = `Rozpocznij Akcję Ruchu`;
  Troops.prototype.hideHudTroops();
  Hud.prototype.hideHudMerchant();
  Hud.prototype.townBtnEnable();
  moveCounter = 0;
  player.action--;
  window[`p` + player.nr + `ActionValue`].textContent = player.action;
});

cancelMoveBtn.addEventListener("click", function () {
  groupHud.map((el) => el.classList.remove(`soldier-selected`));
  groupHud = [];
  selectedSoldiers = [];
  PossibleMove.prototype.deletePossibleMove();
  console.log("Move canceled");
});

const hexRotate = Array.from(document.querySelectorAll(`.hex-rotate`));
let exploredArea;
let drawedLandArr = [];

rotateBtn.addEventListener(`click`, Hex.prototype.rotateArea);

exploreBtn.addEventListener(`click`, () => {
  for (let i = 0; i < hexRotate.length; i++) {
    if (
      hexRotate[i].classList.contains("class-water") &&
      moveDestination === exploredArea[i]
    ) {
      alert(`Nie mozesz poruszać jednostek lądowych po wodzie`);
      return;
    }
  }
  Hex.prototype.getLand();
});

// Click PossibleMove to move Troops, includes Groups, explore the map
let moveCounter = 0;
let moveDestination;
let shit = [];



hexAll.forEach((el) => {
  el.addEventListener(`click`, function () {
    if (el.possibleMove && !(el.hex.land === `water`)) {
      moveDestination = el;

      if (!el.hex.vis) {
        Hud.prototype.showRotateHud();
        Troops.prototype.hideHudTroops();

        hexArea.forEach((area, index) => {
          if (area.includes(el)) {
            exploredArea = hexArea[index];
            console.log(exploredArea);
          }
        });

        Hex.prototype.finalExplore();
      }

      if (!el.troops) {
        el.troops = new Troops(el, player.color);
        console.log(`troops made`);
      }

      if (
        selectedSoldiers.filter((el) => el.type !== `merchant`).length +
          el.troops.size > 4) {
        // when you reached limit 4 soldiers
        alert(`Na jednym polu mogą znajdować się tylko 4 jednostki wojskowe`);
        PossibleMove.prototype.deletePossibleMove();
        troopsPosition = undefined;
        selectedSoldiers = [];
        groupHud = [];
      } else {
        el.troops.soldiers.push(...selectedSoldiers); // move each soldier      
        el.troops.soldiers.map((item) => (item.id = el)); //update id of moved Soldiers
        // delete soldiers from moved position //
        troopsPosition.troops.soldiers = troopsPosition.troops.soldiers.filter(
          (soldier) => !selectedSoldiers.includes(soldier));

        // Draw soldiers on Map //
        if (!el.town) {
          //when go into not Town
          el.troops.showSoldierHex();
        } else if (el.town) {
          //when go into Town
          el.childNodes[8].classList.add(`bg-black`);
        }

        if (!troopsPosition.town) {
          //when go not from Town
          troopsPosition.troops.showSoldierHex();
        }

        el.troops.calcSize();
        troopsPosition.troops.calcSize();
        PossibleMove.prototype.deletePossibleMove();

        // Hud.prototype.hideHudTown();

        if (troopsPosition.troops.soldiers.length === 0) {
          //move whole group, delete troops
          troopsPosition.troops.deleteTroops();
        }
        if (troopsPosition.town && !troopsPosition.troops) {
          //move whole group from Town, remove soldier on Map Town
          troopsPosition.childNodes[8].classList.remove(`bg-black`);
        }

        troopsPosition = undefined;
        selectedSoldiers = [];
        groupHud = [];

        moveCounter++;
        if (moveCounter === 1)
          alert(
            `Poruszyłeś pierwszą grupę, w tej Akcji Ruchu możesz poruszyć jeszcze dwie. Jeśli chcesz zakończyć Akcję Ruchu, kliknij "Zakończ Akcję Ruchu"`
          );

        if (moveCounter === 2)
          alert(
            `Poruszyłeś drugą grupę, w tej Akcji Ruchu możesz poruszyć jeszcze jedną. Jeśli chcesz zakończyć Akcję Ruchu, kliknij "Zakończ Akcję Ruchu"`
          );

        if (moveCounter === 1 || moveCounter === 2) {
          confirmGroupBtn.disabled = true;
          startMoveBtn.textContent = `Kontynuuj akcje ruchu`;
        }

        if (moveCounter === 3) {
          alert(
            `Poruszyłeś trzecia grupę, w tej Akcji Ruchu nie możesz już poruszyć wojsk. Kliknij "Zakończ Akcję Ruchu"`
          );
          startMoveBtn.disabled = true;
          confirmGroupBtn.disabled = true;
          cancelMoveBtn.disabled = true;
        }
      }
    } else if (el.possibleMove && el.hex.land === `water`) {
      alert(`Nie możesz poruszać jednostek lądowych po wodzie`);
      Hud.prototype.showMoveBtnContainer();
    }
  });
});
// MMMMMMOOOOOOOOOOOOVVVVVVVVVVVEEEEEEEEEEEEEEEEEE //
// EEEEEEEEEEEEEEEENNNNNNNNNNNNNDDDDDDDDDDDDDDDDDD //

// settle Town and build structures //
settleBtn.addEventListener(`click`, function () {
  const merchantObj = troopsPosition.troops.soldiers.find(
    (el) => el.type === `merchant`
  );
  console.log(merchantObj);
  merchantObj.settle();
  window[`p` + player.nr + `ActionValue`].textContent = player.action;
});

buildStructureBtn.addEventListener(`click`, function () {
  Hud.prototype.showContainerStructure();
  Hud.prototype.townBtnDisable();
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

cancelBuild.addEventListener(`click`, function () {
  Hud.prototype.hideContainerStructure();
  Hud.prototype.townBtnEnable();
});

//----------- RECRUITING TROOPS -----------//
// troops variables
let tempSoldiers = [];
recruitBtn.addEventListener(`click`, function () {
  Hud.prototype.showContainerRecruit();
  Hud.prototype.townBtnDisable();
});

confirmRecruitBtn.addEventListener(`click`, function () {
  town.confirmRecruit();
  Hud.prototype.hideContainerRecruit();
  Hud.prototype.townBtnEnable();
});

cancelRecruitBtn.addEventListener(`click`, function () {
  town.cancelRecruit();
  Hud.prototype.hideContainerRecruit();
  Hud.prototype.townBtnEnable();
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
  // Hud.prototype.hideContainerStructure();
  town.possibleResource();
  Hud.prototype.townBtnDisable();
  Hud.prototype.showContainerTempCollect();
  Hud.prototype.showCancelCollectBtn();
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
  Hud.prototype.hideContainerTempCollect();
  Hud.prototype.hideConfirmCollectBtn();
  Hud.prototype.hideCancelCollectBtn();
  Hud.prototype.townBtnEnable();
  window[`p` + player.nr + `ActionValue`].textContent = player.action;
});

// Cancel collect resources
// cancelCollectBtn.addEventListener(`click`, function () {
//   hexAll.forEach((el) => {
//     if (el.possibleResource) {
//       el.possibleResource.deleteTempResource();
//       clickedRes = [];
//       el.possibleResource.deletePossibleResource();
//     }
//   });

//   Hud.prototype.townBtnEnable();
//   Hud.prototype.hideContainerTempCollect();
//   Hud.prototype.hideConfirmCollectBtn();
//   Hud.prototype.hideCancelCollectBtn();
// });

cancelCollectBtn.addEventListener(`click`, () => {
  Town.prototype.cancelCollect();
});




// --------------- DISABLE CLICKS ---------------- //
// Disable click when you click on enemy
// gameContainer.addEventListener("click", handler, true);
// function handler(e) {
//   if (e.target.merchant && e.target.merchant.player !== UUID) {
//     e.stopPropagation();
//     e.preventDefault();
//   }
// }

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

    clearInterval(turnInterval);
    alert(`Twoja tura sie zakonczyla, click end turn`);
    if (town) {
      Hud.prototype.hideHudTown();
    }
    endTurn.style.display = `block`;
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
    if (el.town && el.town.player === player) {
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
          // townsOnMap.value[i].type,
          // townsOnMap.value[i].player,
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
  // readMerchant();
  publishMessage(hexesOnMap);
  publishMessage(townsOnMap);
  // publishMessage(merchantsOnMap);

  hexesOnMapArr = [];
  townsOnMapArr = [];
  merchantsOnMapArr = [];

  hexesOnMap = undefined;
  townsOnMap = undefined;
  merchantsOnMap = undefined;

  publishMessage(player);
  console.log(`player sent`, player);

  endTurn.style.display = `none`;
});



const p1TechBtns = Array.from(document.querySelectorAll(`#p1TechTree .tech-btn`));
const p2TechBtns = Array.from(document.querySelectorAll(`#p2TechTree .tech-btn`));
const p3TechBtns = Array.from(document.querySelectorAll(`#p3TechTree .tech-btn`));

console.log(p1TechBtns);
console.log(p2TechBtns);
console.log(p3TechBtns);


 