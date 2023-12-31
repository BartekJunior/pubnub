`use strict`;

// GLOBAL VARIABLES //
let setNum = 1; // ID of each soldier

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
      else if (this.land === `water`) return (this.resource = `food`);
    };

    this.checkCollectible = () => {
      if (this.land === `plain` && !player.skills[2].purchased)
        return (this.collectible = false);
      else if (this.land === `plain` && player.skills[2].purchased)
        return (this.collectible = true);

      if (this.land === `water` && !player.skills[8].purchased)
        return (this.collectible = false);
      else if (this.land === `water` && player.skills[8].purchased)
        return (this.collectible = true);

      if (
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
      const x = Math.ceil(Math.random() * 19);
      // console.log(x);
      if (x >= 1 && x <= 4) return `water`;
      else if (x >= 5 && x <= 8) return `grass`;
      else if (x >= 9 && x <= 12) return `forest`;
      else if (x >= 13 && x <= 16) return `mountain`;
      else if (x >= 17 && x <= 19) return `plain`;
    };

    Hex.prototype.chooseLandDry = function () {
      const x = Math.ceil(Math.random() * 4);
      // console.log(x);
      if (x === 1) return `grass`;
      else if (x === 2) return `forest`;
      else if (x === 3) return `mountain`;
      else if (x === 4) return `plain`;
    };

    Hex.prototype.finalExplore = function () {
      exploredArea.forEach((el, index) => {
        drawedLandArr[index] = Hex.prototype.chooseLand();
        if (moveDestination === el && drawedLandArr[index] === `water`) {
          console.log(`wszedles na wode!!!!`);
          let randomNumber;
          do {
            randomNumber = Math.floor(Math.random() * 4);
            console.log(`Random Number: ${randomNumber}`);
          } while (randomNumber === index);
          drawedLandArr[randomNumber] = `water`;
          console.log(`woda zamieniona na index`, randomNumber);
          drawedLandArr[index] = Hex.prototype.chooseLandDry();
        }

        hexRotate[index].classList.add(`class-` + drawedLandArr[index]);
      });
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
let happinessPlusArr = [];
let happyTowns = [];
let moraleCost = {
  culture: 0,
};

class Town {
  constructor(id, color) {
    this.type = `town`;
    this.player = player.nr;
    this.id = id;
    this.color = color;
    this.happiness = 2;
    this.size = 1;
    this.sad = false;
    this.neutral = false;
    this.frozen = false;
    this.activated = 0;

    this.structure = {
      port: false,
      academy: false,
      fortress: false,
      market: false,
      obelisk: false,
      temple: false,
      observatory: false,
    };

    // !!!WHEN YOU USE Town.prototype... YOU MUST USE REGULAR FUNCTION() BECASE ARROW FUNCTION DOESNT HAVE THIS KEYWORD!!! //
    Town.prototype.activateTown = function () {
      this.activated++;
      player.makeAction();
      console.log(`TOWN ACTIVATED`);

      this.lowerHappinessAfterAction();
      if (this.sad) this.frozen = true;
      this.checkSadNeutral();
      this.disableActivation();
    };

    Town.prototype.disableActivation = function () {
      if (this.frozen) {
        Hud.prototype.townBtnDisable();
        raiseHappinessBtn.disabled = false;
      } else Hud.prototype.townBtnEnable();
    };


    Town.prototype.resetActivateTown = function () {
      this.activated = 0;
      this.frozen = false;
    };

    Town.prototype.raiseHapiness = function () {
      if (this.happiness < 2) return this.happiness++;
    };

    Town.prototype.lowerHapiness = function () {
      if (this.happiness > 0) return this.happiness--;
    };

    Town.prototype.createHappiness = function () {
      const happinessDiv = document.createElement(`div`);
      const plusI = document.createElement(`i`);
      // plusI.id = `plusBtn`;

      happinessDiv.classList.add(`happiness-div`, `morale-high-icon`);
      this.id.childNodes[4].appendChild(happinessDiv);
      this.id.childNodes[8].appendChild(plusI);

      plusI.classList.add(
        `happiness-div`,
        `happines-plus`,
        `bi`,
        `bi-plus-circle`
      );

      plusI.addEventListener(`click`, () => {
        // console.log(plusI.parentNode.parentNode.town);
        if (this.happiness < 2) {
          moraleCost.culture++;

          if (player.bearTheCost(cost.happiness, `happiness`)) {
            this.raiseHapiness();
            this.showHappiness();
            cancelHappinessBtn.disabled = true;
            confirmHappinessBtn.disabled = false;
            console.log(this.happiness);
            if (!happyTowns.includes(plusI.parentNode.parentNode.town))
              happyTowns.push(plusI.parentNode.parentNode.town);

            console.log(`RAISED UP`);
            costHappiness.innerHTML = moraleCost.culture;
          }
        }
      });

      happinessPlusArr.push(plusI);
    };

    Town.prototype.confirmHappiness = function () {
      cancelHappinessBtn.disabled = false;
      happyTowns.map((el) => {
        el.resetActivateTown();
        el.checkSadNeutral();
      })
        
      happyTowns = [];
      moraleCost.culture = 0;
      costHappiness.innerHTML = moraleCost.culture;
      player.makeAction();
    };

    Town.prototype.cancelHappiness = function () {
      cancelHappinessBtn.disabled = false;
      happyTowns = [];
      moraleCost.culture = 0;
      costHappiness.innerHTML = moraleCost.culture;
    };

    Town.prototype.showHappiness = function () {
      const face = this.id.childNodes[4].childNodes[0];
      // console.log(`this is face`, face);

      while (face.classList.length > 1) {
        face.classList.remove(face.classList.item(1)); // Remove the class at index 1 (second class)
      }

      if (this.happiness === 2) face.classList.add(`morale-high-icon`);
      if (this.happiness === 1) face.classList.add(`morale-neutral-icon`);
      if (this.happiness === 0) face.classList.add(`morale-low-icon`);
    };

    Town.prototype.lowerHappinessAfterAction = function () {
      if (this.activated > 1) {
        this.lowerHapiness();
        this.showHappiness();
      }
    };

    Town.prototype.checkSadNeutral = function () {
      if (this.happiness === 0) {
        this.sad = true;
        this.neutral = false;
      } else if (this.happiness === 1) {
        this.sad = false;
        this.neutral = true;
      } else if (this.happiness === 2) {
        this.sad = false;
        this.neutral = false;
      }
    };

    this.checkBuildedStructure = () => {
      for (const key in this.structure) {
        if (this.structure[key] === true) {
          Hud.prototype.changeStructureBtn(key, `none`);
        } else if (this.structure[key] === false)
          Hud.prototype.changeStructureBtn(key, `inline-block`);
      }
    };

    this.structurePlace = (size) => {
      if (size === 1) return 1;
      else if (size === 2) return 3;
      else if (size === 3) return 5;
      else if (size === 4) return 7;
    };

    this.buildStructure = (building) => {
      if (player.bearTheCost(cost.building, `budowa`))
        if (this.size < 5) {
          this.id.childNodes[this.structurePlace(this.size)].classList.add(
            building + this.color
          );
          this.structure[building] = true;
          this.calcSize();
          Hud.prototype.changeStructureBtn(building, `none`);
          Hud.prototype.hideContainerStructure();
          Hud.prototype.townBtnEnable();
          this.activateTown();
        } else {
          alert(`W mieście możesz zbudować maksymalnie 4 budynki`);
        }
    };

    Town.prototype.paintStructureForFree = function (building) {
      if (!this.structure[building]) {
        this.id.childNodes[this.structurePlace(this.size)].classList.add(
          building + this.color
        );
        this.structure[building] = true;
        this.calcSize();
        // this.activateTown();
        // Hud.prototype.changeStructureBtn(building, `none`);
        // Hud.prototype.hideContainerStructure();
        // Hud.prototype.townBtnEnable();
      }
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

      let tempTownSize = town.size;
      if (town.happiness === 2) {
        tempTownSize++
      } else if (town.happiness === 0) {
        tempTownSize = 1;
      } else tempTownSize = town.size;

      if (soldier === `infantry` && tempSoldiers.length < tempTownSize)
        tempSoldiers.push(new Infantry(this.id, this.color));
      if (soldier === `cavalry` && tempSoldiers.length < tempTownSize)
        tempSoldiers.push(new Cavalry(this.id, this.color));
      if (soldier === `elephant` && tempSoldiers.length < tempTownSize)
        tempSoldiers.push(new Elephant(this.id, this.color));
      if (soldier === `merchant` && tempSoldiers.length < tempTownSize)
        tempSoldiers.push(new Merchant(this.id, this.color));
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
      if (tempSoldiers) confirmRecruitBtn.disabled = false;
    };

    this.confirmRecruit = () => {
      let costSum = {
        food: 0,
        wood: 0,
        stone: 0,
        gold: 0,
        idea: 0,
        culture: 0,
        morale: 0,
      };

      function updateCost(tempSoldiers, costSum) {
        tempSoldiers.forEach((soldier) => {
          // Sprawdzenie typu jednostki i dodanie kosztów do costSum zgodnie z definicją z klasy Cost
          if (soldier.type === "merchant") {
            costSum.food += cost.merchant.food;
          }
          if (soldier.type === "infantry") {
            costSum.food += cost.infantry.food;
            costSum.stone += cost.infantry.stone;
          }
          if (soldier.type === "cavalry") {
            costSum.food += cost.cavalry.food;
            costSum.wood += cost.cavalry.wood;
          }
          if (soldier.type === "elephant") {
            costSum.food += cost.elephant.food;
          }
          if (soldier.type === "leader") {
            costSum.food += cost.leader.food;
          }
        });
        console.log(`this is costSum`, costSum);
        return costSum;
      }

      if (player.bearTheCost(updateCost(tempSoldiers, costSum), `rekrutacja`)) {
        if (!this.id.troops) {
          this.id.troops = new Troops(this.id, this.color);
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

          this.id.troops.showSoldierHex();

          Troops.prototype.removeHudTroops();
          Hud.prototype.showMoveBtnContainer();
          this.id.troops.addHudTroops();
          this.updateRecruitNr();
          this.activateTown();
        } else
          alert(
            `Na jednym Hexie mogą znajdować sie maksymalnie 4 jednostki wojskowe`
          );

        confirmRecruitBtn.disabled = true;
      } else this.cancelRecruit();
    };

    this.cancelRecruit = () => {
      tempSoldiers = [];
      this.updateRecruitNr();
      confirmRecruitBtn.disabled = true;
    };

    //-------------- Collect Resource in Town --------------//
    this.possibleResource = () => {
      const rectTown = this.id.getBoundingClientRect();
      let rectHexArr = [];
      let distanceFromTown = [];

      if (!player.skills[7].purchased) roadsCollect = 1;
      else if (player.skills[7].purchased) roadsCollect = 2;

      for (let i = 0; i < hexAll.length; i++) {
        rectHexArr.push(hexAll[i].getBoundingClientRect());

        distanceFromTown[i] = Math.sqrt(
          Math.pow(rectHexArr[i].left - rectTown.left, 2) +
            Math.pow(rectHexArr[i].top - rectTown.top, 2)
        );

        // console.log(`distance:`, distanceFromTown[i], `index:`, i);
        if (distanceFromTown[i] < 150) closerHex.push(hexAll[i]);
        if (player.skills[3].purchased) {
          if (distanceFromTown[i] > 150 && distanceFromTown[i] < 245)
            furtherHex.push(hexAll[i]);
        }
      }

      console.log(`closer:`, closerHex);
      console.log(`further:`, furtherHex);

      for (let i = 0; i < closerHex.length; i++) {
        const possibleResource = new PossibleResource(
          closerHex[i],
          closerHex[i].hex.resource,
          false
        );
        closerHex[i].possibleResource = possibleResource;
      }

      if (player.skills[3].purchased) {
        for (let i = 0; i < furtherHex.length; i++) {
          const possibleResource = new PossibleResource(
            furtherHex[i],
            furtherHex[i].hex.resource,
            false
          );
          furtherHex[i].possibleResource = possibleResource;
          furtherHex[i].possibleResource.further = true;
        }
      }

      distanceFromTown = [];
    };

    Town.prototype.updateGlobalResource = function () {
      for (let i = 0; i < p1GlobalResourceDiv.length - 2; i++) {
        // food reached 2 without Storage //
        if (
          !player.skills[1].purchased &&
          player.resource[res[0]] + tempResource[res[0]] > 2
        ) {
          alert(
            `Przekroczyłeś limit 2 jedzenia. Musisz rozwinąć Magazynowanie. Zbiór anulowano. Nie straciłeś Akcji.`
          );
          // console.log(`wieksze od 2 jest`, res[0]);
          Town.prototype.cancelCollect();
          return;
        }

        // each resource reached 7 //
        if (player.resource[res[i]] + tempResource[res[i]] > 7) {
          alert(
            `Przekroczyłeś limit 7 surowców. Zbiór anulowano. Nie straciłeś Akcji.`
          );
          console.log(`wieksze od 7 jest`, res[i]);
          Town.prototype.cancelCollect();
          return;
        }

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

      this.activateTown();
      clickedRes = [];
      closerHex = [];
      furtherHex = [];
      // player.action--;
    };

    Town.prototype.cancelCollect = () => {
      hexAll.forEach((el) => {
        if (el.possibleResource) {
          el.possibleResource.deleteTempResource();
          el.possibleResource.deletePossibleResource();
        }
      });

      clickedRes = [];
      closerHex = [];
      furtherHex = [];
      Hud.prototype.townBtnEnable();
      Hud.prototype.hideContainerTempCollect();
      Hud.prototype.hideConfirmCollectBtn();
      Hud.prototype.hideCancelCollectBtn();
    };

    this.createHappiness();
  }
}

///// CLASS MERCHANT /////
// let merchantPosition;
class Merchant {
  constructor(id, color) {
    this.type = `merchant`;
    this.player = player;
    this.id = id;
    this.color = color;
    this.num = Troops.prototype.setNumber();

    this.deleteMerchant = () => {
      if (
        this.id.troops.soldiers &&
        this.id.troops.soldiers.map((el) => el.type === `merchant`)
      ) {
        this.id.childNodes[4].classList.remove(`merchant${this.color}`);
        const merchantToRemove = this.id.troops.soldiers.findIndex(
          (soldier) => soldier.type === "merchant"
        );
        this.id.troops.soldiers.splice(merchantToRemove, 1);
      }
    };

    this.settle = () => {
      if (!this.id.town) {
        this.id.town = new Town(this.id, player.color);
        console.log(`town created at hex nr`, this.id);
        this.deleteMerchant();

        // Clear all troopsHex from map when settle Town
        this.id.childNodes.forEach((el) => {
          while (el.classList.length > 1) {
            el.classList.remove(el.classList.item(1)); // Remove the class at index 1 (second class)
          }
          if (this.id.troops.soldiers && this.id.troops.soldiers.length > 0) {
            this.id.troops.showSoldierHex();
          }
        });
        console.log(`this.id.troops.soldiers`, this.id.troops.soldiers);

        this.id.childNodes[4].classList.add(`town${this.color}`);
        // this.id.hex.collectible = false;
        // this.id.town.createHappiness();

        Hud.prototype.hideHudMerchant();
        Hud.prototype.hideMoveBtnContainer();
        Troops.prototype.removeHudTroops();
        // player.action--;

        if (!this.id.troops.soldiers.length) this.id.troops.deleteTroops();
      } else alert(`Państwo w Państwie? Idź się lecz...`);
    };
  }
}

///// CLASS TROOPS /////
let troopsPosition; // Store troops position for displays HUD troops and making actions
let groupHud = []; // Store selected soldiers in HUD
let selectedSoldiers = []; // Store selected soldiers for moving

class Troops {
  constructor(id, color) {
    this.type = `troops`;
    this.player = player;
    this.id = id;
    this.color = color;
    this.soldiers = [];
    this.size = undefined;

    Troops.prototype.removeHudTroops = () => {
      const recruitedDiv = document.querySelectorAll(".recruited-div");
      // Loop through each "recruited-div" element
      recruitedDiv.forEach((div) => {
        const soldiers = div.querySelectorAll("div");
        soldiers.forEach((el) => {
          el.remove();
        });
      });
      Hud.prototype.hideHudTroops();
      Hud.prototype.hideMoveBtnContainer();
    };

    this.addHudTroops = () => {
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
      Hud.prototype.showHudTroops();
      Hud.prototype.showMoveBtnContainer();
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
      // let offsetAll = [];
      // for (let i = 0; i < hexAll.length; i++) {
      //   offsetAll[i] = [hexAll[i].offsetLeft, hexAll[i].offsetTop];
      // }
      // for (let i = 0; i < hexAll.length; i++) {
      //   if (
      //     offsetAll[i][0] > troopsPosition.offsetLeft - 130 &&
      //     offsetAll[i][0] < troopsPosition.offsetLeft + 130 &&
      //     offsetAll[i][1] < troopsPosition.offsetTop + 130 &&
      //     offsetAll[i][1] > troopsPosition.offsetTop - 130 &&
      //     hexAll[i] !== troopsPosition
      //   ) {
      //     hexAll[i].possibleMove = new PossibleMove(hexAll[i]);
      //   }
      // --------------------------------------- //

      const rectTown = troopsPosition.getBoundingClientRect();
      let rectHexArr = [];
      let distanceFromTown = [];

      for (let i = 0; i < hexAll.length; i++) {
        rectHexArr.push(hexAll[i].getBoundingClientRect());
        distanceFromTown[i] = Math.sqrt(
          Math.pow(rectHexArr[i].left - rectTown.left, 2) +
            Math.pow(rectHexArr[i].top - rectTown.top, 2)
        );

        if (distanceFromTown[i] < 150 && hexAll[i] !== troopsPosition)
          closerHex.push(hexAll[i]);
        if (player.skills[7].purchased) {
          if (
            distanceFromTown[i] > 150 &&
            distanceFromTown[i] < 245 &&
            hexAll[i] !== troopsPosition
          )
            roadsHex.push(hexAll[i]);
        }
      }

      roadsHex.map((el) => {
        if (troopsPosition.town) furtherHex.push(el);
        if (el.town) furtherHex.push(el);
      });

      console.log(`closer:`, closerHex);
      console.log(`further:`, furtherHex);
      console.log(`roads:`, roadsHex);

      for (let i = 0; i < closerHex.length; i++) {
        const possibleMove = new PossibleMove(closerHex[i]);
        closerHex[i].possibleMove = possibleMove;
      }

      if (player.skills[7].purchased) {
        for (let i = 0; i < furtherHex.length; i++) {
          const possibleMove = new PossibleMove(furtherHex[i]);
          furtherHex[i].possibleMove = possibleMove;
          furtherHex[i].possibleMove.further = true;
        }
      }

      distanceFromTown = [];
    };

    this.showSoldierHex = () => {
      const smallHexSoldier = [0, 2, 6, 8];

      if (!this.id.town) {
        // console.log(this.id);
        this.id.childNodes.forEach((el) => {
          while (el.classList.length > 1) {
            el.classList.remove(el.classList.item(1)); // Remove the class at index 1 (second class)
          }
        });
      }
      if (this.id.town) {
        this.id.childNodes.forEach((el, index) => {
          if (index === 0 || index === 2 || index === 6 || index === 8) {
            while (el.classList.length > 1) {
              el.classList.remove(el.classList.item(1)); // Remove the class at index 1 (second class)
            }
          }
        });
      }

      for (let i = 0, j = 0; i < this.soldiers.length; i++, j++) {
        if (this.soldiers[i].type === `merchant`) {
          j--;
          if (!this.id.town) {
            // console.log(`itaretate in merchant at index`, i, `this is J:`, j);
            this.id.childNodes[4].classList.add(
              `merchant` + this.color,
              `soldierHex`
            );
          }
        } else if (this.soldiers[i].type !== `merchant`) {
          // console.log(`itaretate in soldier at index`, i, `this is J:`, j);
          this.id.childNodes[smallHexSoldier[j]].classList.add(
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
  constructor(id, color) {
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
  }
}

class Infantry {
  constructor(id, color) {
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
  }
}

class Elephant {
  constructor(id, color) {
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
  }
}

///// CLASS POSSIBLEMOVE /////
class PossibleMove {
  constructor(id) {
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
  constructor(id, resource, collected) {
    this.player = player;
    this.id = id;
    this.resource = resource;
    this.collected = collected;
    this.further = false;

    this.showPossibleResource = () => this.id.classList.add(`possible-collect`);
    this.deletePossibleResource = () => {
      id.classList.remove(`possible-collect`);
      delete this.id.possibleResource;
    };

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
      let tempTownSize = town.size;
      if (town.happiness === 2) {
        tempTownSize++
      } else if (town.happiness === 0) {
        tempTownSize = 1;
      } else tempTownSize = town.size;

      if (this.id.possibleResource && clickedRes.length < tempTownSize) {
        if (this.id.hex.collectible && !this.collected) {
          clickedRes.push(this.id.possibleResource.resource);
          Hud.prototype.showConfirmCollectBtn();
          Hud.prototype.showCancelCollectBtn();
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

///// CLASS COST /////
class Cost {
  constructor() {
    Cost.prototype.advance = {
      food: 2,
    };
    Cost.prototype.merchant = {
      food: 2,
    };
    Cost.prototype.infantry = {
      food: 1,
      stone: 1,
    };
    Cost.prototype.cavalry = {
      food: 1,
      wood: 1,
    };
    Cost.prototype.elephant = {
      food: 2,
    };
    Cost.prototype.leader = {
      culture: 1,
      morale: 1,
    };
    Cost.prototype.building = {
      food: 1,
      wood: 1,
      stone: 1,
    };
    Cost.prototype.happiness = {
      morale: 1,
    };
    Cost.prototype.roads = {
      food: 1,
      stone: 1,
    };
  }
}

///// CLASS HUD /////
// Hud variables when specific Hud is active => true //
let collectHud;
let buildHud;
let recruitHud;
let exploreHud;

class Hud {
  constructor() {
    // Town fundamental Btns
    Hud.prototype.showHudTown = () => {
      hudTown.style.display = `block`;
      if (town) town.id.classList.add(`town-selected`);
    };
    Hud.prototype.hideHudTown = () => {
      hudTown.style.display = `none`;
      if (town) town.id.classList.remove(`town-selected`);
    };

    Hud.prototype.townBtnDisable = () => {
      collectResourceBtn.disabled = true;
      buildStructureBtn.disabled = true;
      recruitBtn.disabled = true;
      raiseHappinessBtn.disabled = true;
      burnTownBtn.disabled = true;
    };
    Hud.prototype.townBtnEnable = () => {
      collectResourceBtn.disabled = false;
      buildStructureBtn.disabled = false;
      recruitBtn.disabled = false;
      raiseHappinessBtn.disabled = false;
      burnTownBtn.disabled = false;
    };

    // COLLECT //
    // ContainerTempCollect
    Hud.prototype.showContainerTempCollect = () => {
      containerTempCollect.style.display = `flex`;
      collectHud = true;
    };

    Hud.prototype.hideContainerTempCollect = () => {
      containerTempCollect.style.display = `none`;
      collectHud = false;
    };

    // Confirm and Cancel Collect
    Hud.prototype.showConfirmCollectBtn = () =>
      (confirmCollectBtn.style.display = `block`);
    Hud.prototype.hideConfirmCollectBtn = () =>
      (confirmCollectBtn.style.display = `none`);
    Hud.prototype.showCancelCollectBtn = () =>
      (cancelCollectBtn.style.display = `block`);
    Hud.prototype.hideCancelCollectBtn = () =>
      (cancelCollectBtn.style.display = `none`);

    // Happiness //
    Hud.prototype.showContainerHappiness = () => {
      containerHappiness.style.display = `block`;
      happinessPlusArr.map((el) => (el.style.display = `block`));
    };
    Hud.prototype.hideContainerHappiness = () => {
      containerHappiness.style.display = `none`;
      happinessPlusArr.map((el) => (el.style.display = `none`));
    };

    // Build
    Hud.prototype.showContainerStructure = () => {
      containerStructure.style.display = `flex`;
      buildHud = true;
    };

    Hud.prototype.hideContainerStructure = () => {
      containerStructure.style.display = `none`;
      buildHud = false;
    };

    Hud.prototype.changeStructureBtn = (structure, display) =>
      (window[structure + `Btn`].style.display = display);

    // Recruit and Troops
    Hud.prototype.showContainerRecruit = () => {
      containerRecruit.style.display = `flex`;
      recruitHud = true;
    };

    Hud.prototype.hideContainerRecruit = () => {
      containerRecruit.style.display = `none`;
      recruitHud = false;
    };

    Hud.prototype.showMoveBtnContainer = () =>
      (moveBtnContainer.style.display = `inline-flex`);
    Hud.prototype.hideMoveBtnContainer = () =>
      (moveBtnContainer.style.display = `none`);

    // Merchant
    Hud.prototype.showHudMerchant = () => (hudMerchant.style.display = `block`);
    Hud.prototype.hideHudMerchant = () => (hudMerchant.style.display = `none`);

    //Troops
    Hud.prototype.showHudTroops = () => (hudTroops.style.display = `block`);
    Hud.prototype.hideHudTroops = () => (hudTroops.style.display = `none`);

    // Rotate Area
    Hud.prototype.showRotateHud = () => {
      rotateHud.style.display = `block`;
      exploreHud = true;
    };

    Hud.prototype.hideRotateHud = () => {
      rotateHud.style.display = `none`;
      exploreHud = false;
    };

    Hud.prototype.refreshCultureMorale = () => {
      window[`p` + player.nr + `GlobalResourceDiv`][5].innerHTML =
        player.resource.culture;
      window[`p` + player.nr + `GlobalResourceDiv`][6].innerHTML =
        player.resource.morale;
    };

    Hud.prototype.hideHudAll = function () {
      Hud.prototype.hideHudTown();
      Hud.prototype.hideHudTroops();
      Hud.prototype.hideContainerTempCollect();
      Hud.prototype.hideContainerHappiness();
      Hud.prototype.hideContainerStructure();
      Hud.prototype.hideContainerRecruit();
      Hud.prototype.hideMoveBtnContainer();
      Hud.prototype.hideHudMerchant();
      Hud.prototype.hideRotateHud();
    };


  }
}
