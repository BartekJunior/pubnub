`use strict`;

// GLOBAL VARIABLES //
let setNum = 1; // ID of each soldier
let test;

// CLASS PLAYER //
class Player {
  constructor(name, nr, color, turnActive, action) {
    this.type = `player`;
    this.actionDone = false;
    this.name = name;
    this.nr = nr;
    this.color = color;
    this.turnActive = turnActive;
    this.action = action;

    this.resource = {
      food: 2,
      wood: 1,
      stone: 0,
      gold: 0,
      idea: 2,
      morale: 2,
    };

    this.checkStart = () => {
      if (this.nr == 1) return 0;
      else if (this.nr == 2) return 35;
      else if (this.nr == 3) return 5;
    };

    this.start = this.checkStart();
  }
}

// CLASS HEX //
class Hex {
  constructor(id, land, vis, resource, collectible) {
    this.type = `hex`;
    this.id = id;
    this.land = land;
    this.vis = vis;
    this.resource = resource;
    this.collectible = collectible;

    this.checkResource = () => {
      if (this.land === `grass`) return (this.resource = `food`);
      else if (this.land === `forest`) return (this.resource = `wood`);
      else if (this.land === `mountain`) return (this.resource = `stone`);
      else if (this.land === `plain`) return (this.resource = `food`);
      else if (this.land === `water`) return (this.resource = `gold`);
    };

    this.checkCollectible = () => {
      if (this.land === `water` || this.land === `plain`)
        return (this.collectible = false);
      else if (
        this.land === `grass` ||
        this.land === `forest` ||
        this.land === `mountain`
      )
        return (this.collectible = true);
    };

    this.createSmall = function () {
      let hexChild = [];
      if (this.id.childNodes.length === 0) {
        for (let i = 0; i < 9; i++) {
          const hexSmall = document.createElement("div");
          hexSmall.classList.add(`hex-small`);
          // hexSmall.classList.add(`soldierHud`);
          hexChild.push(hexSmall);
        }

        for (let i = 0; i < hexChild.length; i++) {
          this.id.appendChild(hexChild[i]);
        }
      }
    };

    // Draw the land
    Hex.prototype.chooseLand = function () {
      const x = Math.ceil(Math.random() * 5);
      if (x === 1) return `water`;
      else if (x === 2) return `grass`;
      else if (x === 3) return `forest`;
      else if (x === 4) return `mountain`;
      else if (x === 5) return `plain`;
    };

    Hex.prototype.rotateArea = () => {
      drawedLandArr = [
        drawedLandArr[3],
        drawedLandArr[2],
        drawedLandArr[1],
        drawedLandArr[0],
      ];
      Hex.prototype.deleteFirstClass();
      for (let i = 0; i < hexRotate.length; i++) {
        hexRotate[i].classList.add(`class-` + drawedLandArr[i]);
      }
    };

    Hex.prototype.getLand = () => {
      for (let i = 0; i < exploredArea.length; i++) {
        exploredArea[i].hex.land = drawedLandArr[i];
        exploredArea[i].hex.vis = true;
        exploredArea[i].classList.add(`class-${exploredArea[i].hex.land}`);
        exploredArea[i].hex.checkResource();
        exploredArea[i].hex.checkCollectible();
      }
      Hex.prototype.deleteFirstClass();
      Hud.prototype.hideRotateHud();
    };

    Hex.prototype.deleteFirstClass = () => {
      hexRotate.forEach((el) => {
        while (el.classList.length > 1) {
          el.classList.remove(el.classList.item(1)); // Remove the class at index 1 (second class)
        }
      });
    };

    this.createSmall(); //Fires after hex begin. Create 9 small divs inside big Hex.
  }
}

// CLASS TOWN //
let town;
class Town {
  constructor(player, id, color) {
    this.type = `town`;
    this.player = player;
    this.id = id;
    this.color = color;
    this.size = 1;

    this.structure = {
      port: false,
      academy: false,
      fortress: false,
      market: false,
      obelisk: false,
      temple: false,
      observatory: false,
    };

    this.showHudTown = () => (hudTown.style.display = `block`);
    this.hideHudTown = () => (hudTown.style.display = `none`);

    this.hideConfirmCollectBtn = () =>
      (confirmCollectBtn.style.display = `none`);
    this.hideCancelCollectBtn = () => (cancelCollectBtn.style.display = `none`);

    this.showContainerStructure = () =>
      (containerStructure.style.display = `block`);
    this.hideContainerStructure = () =>
      (containerStructure.style.display = `none`);

    this.showContainerRecruit = () => (containerRecruit.style.display = `flex`);
    this.hideContainerRecruit = () => (containerRecruit.style.display = `none`);

    this.changeStructureBtn = (structure, display) =>
      (window[structure + `Btn`].style.display = display);

    this.checkBuildedStructure = () => {
      for (const key in this.structure) {
        if (this.structure[key] === true) {
          this.changeStructureBtn(key, `none`);
        } else if (this.structure[key] === false)
          this.changeStructureBtn(key, `inline-block`);
      }
    };

    this.structurePlace = (building) => {
      if (building === `fortress`) return 1;
      else if (building === `obelisk`) return 0;
      else if (building === `temple`) return 2;
      else if (building === `observatory`) return 6;
      else if (building === `market`) return 3;
      else if (building === `academy`) return 5;
      else if (building === `port`) return 7;
    };

    this.buildStructure = (building) => {
      this.id.childNodes[this.structurePlace(building)].classList.add(building);
      this.structure[building] = true;
      this.calcSize();
    };

    this.calcSize = () => {
      const buildings = [
        Number(this.structure.port),
        Number(this.structure.academy),
        Number(this.structure.fortress),
        Number(this.structure.market),
        Number(this.structure.obelisk),
        Number(this.structure.temple),
        Number(this.structure.observatory),
      ];
      this.size = buildings.reduce((partialSum, a) => partialSum + a, 0) + 1;
    };

    //-------------- Recruit soldiers in Town --------------//
    this.recruitTempSoldier = (soldier) => {
      const merchantLength = tempSoldiers.filter(
        (item) => item.type === `merchant`
      ).length;
      if (soldier === `infantry` && tempSoldiers.length - merchantLength < 4)
        tempSoldiers.push(new Infantry(this.player, this.id, this.color));
      if (soldier === `cavalry` && tempSoldiers.length - merchantLength < 4)
        tempSoldiers.push(new Cavalry(this.player, this.id, this.color));
      if (soldier === `elephant` && tempSoldiers.length - merchantLength < 4)
        tempSoldiers.push(new Elephant(this.player, this.id, this.color));
      if (soldier === `merchant`)
        tempSoldiers.push(new Merchant(this.player, this.id, this.color));
      this.updateRecruitNr();
    };

    this.updateRecruitNr = () => {
      infantryRecruitNr.textContent = tempSoldiers.filter(
        (item) => item.type === `infantry`
      ).length;
      cavalryRecruitNr.textContent = tempSoldiers.filter(
        (item) => item.type === `cavalry`
      ).length;
      elephantRecruitNr.textContent = tempSoldiers.filter(
        (item) => item.type === `elephant`
      ).length;
      merchantRecruitNr.textContent = tempSoldiers.filter(
        (item) => item.type === `merchant`
      ).length;
    };

    this.confirmRecruit = () => {
      if (!this.id.troops) {
        this.id.troops = new Troops(this.player, this.id, this.color);
      }
      if (
        this.id.troops &&
        this.id.troops.soldiers.filter((item) => item.type !== `merchant`)
          .length +
          tempSoldiers.filter((item) => item.type !== `merchant`).length <=
          4
      ) {
        this.id.troops.soldiers.push(...tempSoldiers);
        tempSoldiers = [];
        this.id.troops.calcSize();
        this.id.childNodes[8].classList.add(`bg-black`);
        // this.id.troops.showSoldierHex();
        Troops.prototype.hideHudTroops();
        this.id.troops.showHudTroops();
        Hud.prototype.showMoveBtnContainer();
        this.updateRecruitNr();
      } else
        alert(
          `Na jednym Hexie mogą znajdować sie maksymalnie 4 jednostki wojskowe`
        );

      // Now you have to paint the soldiers on the Town map. Some like this under...
      // this.id.childNodes[8].classList.add(soldier + this.color);
    };

    this.cancelRecruit = () => {
      tempSoldiers = [];
      this.updateRecruitNr();
    };

    //-------------- Collect Resource in Town --------------//
    this.possibleResource = () => {
      let offsetAll = [];
      for (let i = 0; i < hexAll.length; i++) {
        offsetAll[i] = [hexAll[i].offsetLeft, hexAll[i].offsetTop];
      }

      for (let i = 0; i < hexAll.length; i++) {
        if (
          offsetAll[i][0] > this.id.offsetLeft - 130 &&
          offsetAll[i][0] < this.id.offsetLeft + 130 &&
          offsetAll[i][1] < this.id.offsetTop + 130 &&
          offsetAll[i][1] > this.id.offsetTop - 130
          // hexAll[i].hex.collectible
        ) {
          const possibleResource = new PossibleResource(
            UUID,
            hexAll[i],
            hexAll[i].hex.resource,
            false
          );
          hexAll[i].possibleResource = possibleResource;
        }
      }
      town.id.hex.collectible = true;
    };

    this.updateGlobalResource = () => {
      for (let i = 0; i < p1GlobalResourceDiv.length; i++) {
        const player = window[`player` + UUID];
        player.resource[res[i]] =
          player.resource[res[i]] + tempResource[res[i]];
        window[`p` + player.nr + `GlobalResourceDiv`][i].innerHTML =
          player.resource[res[i]];
        tempResource[res[i]] = 0;
        collecting[i].innerHTML = tempResource[res[i]];
      }
      hexAll.forEach((el) => {
        if (el.possibleResource) el.possibleResource.deletePossibleResource();
      });
      clickedRes = [];
    };
  }
}

///// CLASS MERCHANT /////
// let merchantPosition;
class Merchant {
  constructor(player, id, color) {
    this.type = `merchant`;
    this.player = player;
    this.id = id;
    this.color = color;
    this.num = Troops.prototype.setNumber();

    const merchantClass = `merchant${this.color}`;

    this.deleteMerchant = () => {
      if (
        this.id.troops.soldiers &&
        this.id.troops.soldiers.map((el) => el.type === `merchant`)
      ) {
        this.id.childNodes[4].classList.remove(merchantClass);
        const merchantToRemove = this.id.troops.soldiers.findIndex(
          (soldier) => soldier.type === "merchant"
        );
        this.id.troops.soldiers.splice(merchantToRemove, 1);
      }
    };

    this.settle = () => {
      this.id.town = new Town(UUID, this.id, window[`player` + UUID].color);
      console.log(`town created at hex nr`, this.id);
      this.deleteMerchant();

      // Clear all troopsHex from map when settle Town
      this.id.childNodes.forEach((el) => {
        while (el.classList.length > 1) {
          el.classList.remove(el.classList.item(1)); // Remove the class at index 1 (second class)
        }
        if (this.id.troops.soldiers && this.id.troops.soldiers.length > 0) {
          this.id.childNodes[8].classList.add(`bg-black`);
        }
      });
      console.log(`this.id.troops.soldiers`, this.id.troops.soldiers);

      this.id.childNodes[4].classList.add(`town${this.color}`);
      // this.id.hex.collectible = false;

      Hud.prototype.hideHudMerchant();
      Hud.prototype.hideMoveBtnContainer();
      Troops.prototype.hideHudTroops();
      window[`player` + UUID].action--;

      if (!this.id.troops.soldiers.length) this.id.troops.deleteTroops();
    };
  }
}

///// CLASS TROOPS /////
let troopsPosition; // Store troops position for displays HUD troops and making actions
let groupHud = []; // Store selected soldiers in HUD
let selectedSoldiers = []; // Store selected soldiers for moving

class Troops {
  constructor(player, id, color) {
    this.type = `troops`;
    this.player = player;
    this.id = id;
    this.color = color;
    this.soldiers = [];
    this.size = undefined;

    Troops.prototype.hideHudTroops = () => {
      const recruitedDiv = document.querySelectorAll(".recruited-div");
      // Loop through each "recruited-div" element
      recruitedDiv.forEach((div) => {
        const soldiers = div.querySelectorAll("div");
        soldiers.forEach((el) => {
          el.remove();
        });
      });
    };

    this.showHudTroops = () => {
      for (let i = 0; i < this.soldiers.length; i++) {
        if (this.soldiers[i].type === `cavalry`) {
          const newCavalry = document.createElement(`div`);
          newCavalry.classList.add(`cavalry${this.color}`);
          newCavalry.classList.add(`soldierHud`);
          newCavalry.dataset.num = this.soldiers[i].num;
          cavalryRecruited.appendChild(newCavalry);
        }
        if (this.soldiers[i].type === `infantry`) {
          const newInfantry = document.createElement(`div`);
          newInfantry.classList.add(`infantry${this.color}`);
          newInfantry.classList.add(`soldierHud`);
          newInfantry.dataset.num = this.soldiers[i].num;
          infantryRecruited.appendChild(newInfantry);
        }
        if (this.soldiers[i].type === `elephant`) {
          const newElephant = document.createElement(`div`);
          newElephant.classList.add(`elephant${this.color}`);
          newElephant.classList.add(`soldierHud`);
          newElephant.dataset.num = this.soldiers[i].num;
          elephantRecruited.appendChild(newElephant);
        }
        if (this.soldiers[i].type === `merchant`) {
          const newMerchant = document.createElement(`div`);
          newMerchant.classList.add(`merchant${this.color}`);
          newMerchant.classList.add(`soldierHud`);
          newMerchant.dataset.num = this.soldiers[i].num;
          merchantRecruited.appendChild(newMerchant);
        }
      }
    };

    this.deleteTroops = () => {
      delete this.id.troops;
    };

    // StartMoveBtn unables move buttons
    Troops.prototype.startMoveBtn = function () {
      confirmGroupBtn.disabled = false;
      confirmMoveBtn.disabled = false;
    };

    Troops.prototype.soldiersHud = () => {
      let soldiersHud = document.querySelectorAll(".soldierHud");
      soldiersHud.forEach((el) => {
        el.addEventListener("click", function () {
          if (!groupHud.includes(el)) {
            groupHud.push(el);
            el.classList.add("soldier-selected"); // You can add a "selected" class for styling
            console.log(`groupHud is`, groupHud);

            // Compare and find selected troopsHud with troops.soldiers
            let soldierObject = troopsPosition.troops.soldiers.find(
              (soldier) => soldier.num == el.dataset.num
            );
            if (!selectedSoldiers.includes(soldierObject)) {
              selectedSoldiers.push(soldierObject);
            }
            console.log(`selectedSoldiers`, selectedSoldiers);
          } else if (groupHud.includes(el)) {
            groupHud = groupHud.filter((soldier) => soldier !== el);
            el.classList.remove("soldier-selected");
            console.log(`groupHud is`, groupHud);

            let soldierObject = troopsPosition.troops.soldiers.find(
              (soldier) => soldier.num == el.dataset.num
            );
            if (selectedSoldiers.includes(soldierObject)) {
              selectedSoldiers = selectedSoldiers.filter(
                (soldier) => soldier !== soldierObject
              );
            }
            console.log(`selectedSoldiers`, selectedSoldiers);
          }
        });
      });
    };

    Troops.prototype.whereToGo = () => {
      let offsetAll = [];
      for (let i = 0; i < hexAll.length; i++) {
        offsetAll[i] = [hexAll[i].offsetLeft, hexAll[i].offsetTop];
      }
      for (let i = 0; i < hexAll.length; i++) {
        if (
          offsetAll[i][0] > troopsPosition.offsetLeft - 130 &&
          offsetAll[i][0] < troopsPosition.offsetLeft + 130 &&
          offsetAll[i][1] < troopsPosition.offsetTop + 130 &&
          offsetAll[i][1] > troopsPosition.offsetTop - 130 &&
          hexAll[i] !== troopsPosition
        ) {
          hexAll[i].possibleMove = new PossibleMove(UUID, hexAll[i]);
        }
      }
    };

    this.showSoldierHex = () => {
      this.id.childNodes.forEach((el) => {
        while (el.classList.length > 1 && !this.id.town) {
          el.classList.remove(el.classList.item(1)); // Remove the class at index 1 (second class)
        }
      });

      for (let i = 0, j = 1; i < this.soldiers.length; i++, j = j + 2) {
        // console.log(this.id.childNodes[j]);
        if (this.soldiers[i].type === `merchant`) {
          this.id.childNodes[4].classList.add(
            `merchant` + this.color,
            `soldierHex`
          );
          j = j - 2;
        } else if (this.soldiers[i].type !== `merchant`) {
          this.id.childNodes[j].classList.add(
            this.soldiers[i].type + this.soldiers[i].color,
            `soldierHex`
          );
        }
      }
    };

    this.calcSize = function () {
      const fightSoldier = this.soldiers.filter((el) => el.type !== `merchant`);
      this.size = fightSoldier.length;
      console.log(`troops size updated`);
      return this.size;
    };

    Troops.prototype.setNumber = () => {
      return setNum++;
    };
  }
}

///// CLASS SOLDIERS /////
class Cavalry {
  constructor(player, id, color) {
    this.type = `cavalry`;
    this.player = player;
    this.id = id;
    this.color = color;
    this.num = Troops.prototype.setNumber();

    this.showCavalry = () => {
      id.childNodes[7].classList.add(this.type + this.color, `soldierHex`);
    };

    this.deleteCavalry = () => {
      id.classList.remove(soldierClass);
      delete this.id.cavalry;
    };

    // this.id.troops.calcSize();
  }
}

class Infantry {
  constructor(player, id, color) {
    this.type = `infantry`;
    this.player = player;
    this.id = id;
    this.color = color;
    this.num = Troops.prototype.setNumber();

    this.showInfantry = () => {
      id.childNodes[5].classList.add(this.type + this.color, `soldierHex`);
    };

    this.deleteInfantry = () => {
      id.classList.remove(infantryClass);
      delete this.id.infantry;
    };

    // this.id.troops.calcSize();
  }
}

class Elephant {
  constructor(player, id, color) {
    this.type = `elephant`;
    this.player = player;
    this.id = id;
    this.color = color;
    this.num = Troops.prototype.setNumber();

    this.showElephant = () => {
      id.childNodes[3].classList.add(this.type + this.color, `soldierHex`);
    };

    this.deleteElephant = () => {
      id.classList.remove(elephantClass);
      delete this.id.elephant;
    };

    // this.id.troops.calcSize();
  }
}

///// CLASS POSSIBLEMOVE /////
class PossibleMove {
  constructor(player, id) {
    this.player = player;
    this.id = id;
    this.showPossibleMove = () => this.id.classList.add(`possible-move`);

    PossibleMove.prototype.deletePossibleMove = () => {
      hexAll.forEach((el) => {
        if (el.possibleMove) {
          el.classList.remove(`possible-move`);
          delete el.possibleMove;
        }
      });
    };

    this.showPossibleMove(); //fires after create hex
  }
}

///// CLASS POSSIBLERESOURCE /////
class PossibleResource {
  constructor(player, id, resource, collected) {
    this.player = player;
    this.id = id;
    this.resource = resource;
    this.collected = collected;

    this.showPossibleResource = () => this.id.classList.add(`possible-collect`);
    this.deletePossibleResource = () => {
      id.classList.remove(`possible-collect`);
      delete this.id.possibleResource;
    };

    this.showConfirmCollectBtn = () =>
      (confirmCollectBtn.style.display = `block`);
    this.hideConfirmCollectBtn = () =>
      (confirmCollectBtn.style.display = `none`);

    this.showCancelCollectBtn = () =>
      (cancelCollectBtn.style.display = `block`);
    this.hideCancelCollectBtn = () => (cancelCollectBtn.style.display = `none`);

    this.showTempResource = () => {
      if (clickedRes[clickedRes.length - 1] === `food`) tempResource.food++;
      else if (clickedRes[clickedRes.length - 1] === `wood`)
        tempResource.wood++;
      else if (clickedRes[clickedRes.length - 1] === `stone`)
        tempResource.stone++;
      else if (clickedRes[clickedRes.length - 1] === `gold`)
        tempResource.gold++;
      else if (clickedRes[clickedRes.length - 1] === `idea`)
        tempResource.idea++;
      else if (clickedRes[clickedRes.length - 1] === `morale`)
        tempResource.morale++;

      for (let i = 0; i < collecting.length; i++) {
        collecting[i].innerHTML = tempResource[res[i]];
      }
    };

    this.collectTempResource = () => {
      if (this.id.possibleResource && clickedRes.length < town.size) {
        if (this.id.hex.collectible && !this.collected) {
          clickedRes.push(this.id.possibleResource.resource);
          this.id.possibleResource.showConfirmCollectBtn();
          this.id.possibleResource.showCancelCollectBtn();
          this.id.possibleResource.showTempResource();
          console.log(clickedRes);
          this.collected = true;
        } else if (!this.id.hex.collectible)
          alert(
            `Nie możesz zbierac z tego pola. Brakuje Ci rozwinięcia / jałowa ziemia / wróg / inne miasto etc.`
          );
        else if (this.collected) alert(`Juz zebrałeś z tego pola`);
      }
    };

    this.deleteTempResource = () => {
      for (const res in tempResource) {
        tempResource[res] = 0;
      }
      for (let i = 0; i < collecting.length; i++) {
        collecting[i].innerHTML = tempResource[res[i]];
      }
    };

    this.showPossibleResource(); //fires after create hex
  }
}

///// CLASS POSSIBLERESOURCE /////
class Hud {
  constructor() {
    Hud.prototype.showHudMerchant = () => (hudMerchant.style.display = `block`);
    Hud.prototype.hideHudMerchant = () => (hudMerchant.style.display = `none`);

    Hud.prototype.showRotateHud = () => (rotateHud.style.display = `block`);
    Hud.prototype.hideRotateHud = () => (rotateHud.style.display = `none`);

    Hud.prototype.showMoveBtnContainer = () =>
      (moveBtnContainer.style.display = `inline-flex`);
    Hud.prototype.hideMoveBtnContainer = () =>
      (moveBtnContainer.style.display = `none`);
  }
}
