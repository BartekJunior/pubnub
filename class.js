`use strict`;

// CLASS PLAYER //
class Player {
  constructor(
    name,
    nr,
    color,
    turnActive,
    food,
    wood,
    stone,
    gold,
    idea,
    morale,
    action
  ) {
    this.type = `player`;
    this.actionDone = false;
    this.name = name;
    this.nr = nr;
    this.color = color;
    this.turnActive = turnActive;
    this.action = action;

    this.resource = {
      food: food,
      wood: wood,
      stone: stone,
      gold: gold,
      idea: idea,
      morale: morale,
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
          hexChild.push(hexSmall);
        }

        for (let i = 0; i < hexChild.length; i++) {
          this.id.appendChild(hexChild[i]);
        }
      }
    };

    // Draw the land
    this.chooseLand = function () {
      const x = Math.ceil(Math.random() * 5);
      if (x === 1) return `water`;
      else if (x === 2) return `grass`;
      else if (x === 3) return `forest`;
      else if (x === 4) return `mountain`;
      else if (x === 5) return `plain`;
    };

    this.getLand = () => {
      hexArea.forEach((el) => {
        if (el.includes(this.id)) {
          el.forEach((el) => {
            el.hex.land = this.chooseLand();
            el.hex.vis = true;
            el.classList.add(`class-${el.hex.land}`);
            el.hex.checkResource();
            el.hex.checkCollectible();
          });
        }
      });
    };

    this.createSmall(); //Fires after hex begin. Create 9 small divs inside big Hex.
  }
}

// CLASS TOWN //
let town;
class Town {
  constructor(
    player,
    id,
    color,
    size,
    port,
    academy,
    fortress,
    market,
    obelisk,
    temple,
    observatory
  ) {
    this.type = `town`;
    this.player = player;
    this.id = id;
    this.color = color;
    this.size = size;

    this.structure = {
      port: port,
      academy: academy,
      fortress: fortress,
      market: market,
      obelisk: obelisk,
      temple: temple,
      observatory: observatory,
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
        Troops.prototype.hideHudTroops();
        this.id.troops.showHudTroops();
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
let merchantPosition;
class Merchant {
  constructor(player, id, color) {
    this.type = `merchant`;
    this.player = player;
    this.id = id;
    this.color = color;

    const merchantClass = `merchant${color}`;
    const townClass = `town${this.color}`;

    Merchant.prototype.showMerchant = () => id.classList.add(merchantClass);
    Merchant.prototype.hideMerchant = () => id.classList.remove(merchantClass);

    Merchant.prototype.showHudMerchant = () =>
      (hudMerchant.style.display = `block`);
    Merchant.prototype.hideHudMerchant = () =>
      (hudMerchant.style.display = `none`);

    Merchant.prototype.deleteMerchant = () => {
      if (
        id.troops.soldiers &&
        id.troops.soldiers.map((el) => el.type === `merchant`)
      ) {
        id.classList.remove(merchantClass);
        const merchantToRemove = id.troops.soldiers.findIndex(
          (soldier) => soldier.type === "merchant"
        );
        id.troops.soldiers.splice(merchantToRemove, 1);
      }
    };

    Merchant.prototype.settle = () => {
      this.id.town = new Town(
        UUID,
        this.id,
        window[`player` + UUID].color,
        1,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      );
      this.id.childNodes[4].classList.add(townClass);
      // this.id.hex.collectible = false;
      hexAll.forEach((el) => {
        if (el.possibleMove) {
          el.possibleMove.deletePossibleMove();
        }
      });
      this.hideHudMerchant();
      this.deleteMerchant();
      Troops.prototype.hideHudTroops();

      merchantPosition = undefined;
      window[`player` + UUID].action--;
    };

    // this.whereToGo = () => {
    //   merchantPosition = this.id;
    //   let offsetAll = [];
    //   for (let i = 0; i < hexAll.length; i++) {
    //     offsetAll[i] = [hexAll[i].offsetLeft, hexAll[i].offsetTop];
    //   }

    //   this.showHudMerchant();

    //   for (let i = 0; i < hexAll.length; i++) {
    //     if (
    //       offsetAll[i][0] > this.id.offsetLeft - 130 &&
    //       offsetAll[i][0] < this.id.offsetLeft + 130 &&
    //       offsetAll[i][1] < this.id.offsetTop + 130 &&
    //       offsetAll[i][1] > this.id.offsetTop - 130 &&
    //       !hexAll[i].merchant
    //     ) {
    //       const possibleMove = new PossibleMove(UUID, hexAll[i]);
    //       hexAll[i].possibleMove = possibleMove;
    //     }
    //   }
    // };

    // this.showMerchant(); //fires after create merchant
  }
}

///// CLASS TROOPS /////
let troopsPosition;
class Troops {
  constructor(player, id, color, size) {
    this.type = `troops`;
    this.player = player;
    this.id = id;
    this.color = color;
    this.size = size;

    this.soldiers = [];

    // this.showHudTroops = () => (hudTroops.style.display = `block`);
    // Troops.prototype.hideHudTroops = () => (hudTroops.style.display = `none`);

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
          newCavalry.classList.add(`cavalry${this.color}Hud`);
          newCavalry.classList.add(`soldier`);
          cavalryRecruited.appendChild(newCavalry);
        }
        if (this.soldiers[i].type === `infantry`) {
          const newInfantry = document.createElement(`div`);
          newInfantry.classList.add(`infantry${this.color}Hud`);
          newInfantry.classList.add(`soldier`);
          infantryRecruited.appendChild(newInfantry);
        }
        if (this.soldiers[i].type === `elephant`) {
          const newElephant = document.createElement(`div`);
          newElephant.classList.add(`elephant${this.color}Hud`);
          newElephant.classList.add(`soldier`);
          elephantRecruited.appendChild(newElephant);
        }
        if (this.soldiers[i].type === `merchant`) {
          const newMerchant = document.createElement(`div`);
          newMerchant.classList.add(`merchant${this.color}Hud`);
          newMerchant.classList.add(`soldier`);
          merchantRecruited.appendChild(newMerchant);
        }
      }
    };

    this.deleteTroops = () => {
      // id.classList.remove(troopsClass);
      delete this.id.troops;
    };

    // Choose group, Assuming soldiers have the class "soldier"
    Troops.prototype.chooseTroopGroup = function () {
      let soldiers = document.querySelectorAll(".soldier");
      let group = [];

      soldiers.forEach((el) => {
        el.addEventListener("click", function () {
          if (!group.includes(el)) {
            group.push(el);
            el.classList.add("soldier-selected"); // You can add a "selected" class for styling
            console.log(group);
          } else {
            group = group.filter((soldier) => soldier !== el);
            el.classList.remove("soldier-selected");
            console.log(group);
          }
        });
      });

      confirmGroupBtn.addEventListener("click", () => {
        // Call your function here that handles the confirmed group
        this.whereToGo();

        // Optionally, clear the group or perform other actions after confirmation
        // group = [];
        // Disable the confirm button after confirmation
        //  confirmGroupBtn.disabled = true;
      });

      cancelMoveBtn.addEventListener("click", function () {
        // Unselect all soldiers and clear the group array
        group.forEach((el) => {
          el.classList.remove("soldier-selected");
        });
        group = [];

        hexAll.forEach(el => {
          if (el.possibleMove) el.possibleMove.deletePossibleMove();
        })

        // Reset the soldiers variable (if needed)
        soldiers = document.querySelectorAll(".soldier");
        console.log("Selection canceled");
      });
    };

    Troops.prototype.whereToGo = () => {
      let offsetAll = [];
      for (let i = 0; i < hexAll.length; i++) {
        offsetAll[i] = [hexAll[i].offsetLeft, hexAll[i].offsetTop];
      }

      // this.showHudMerchant();

      for (let i = 0; i < hexAll.length; i++) {
        if (
          offsetAll[i][0] > troopsPosition.offsetLeft - 130 &&
          offsetAll[i][0] < troopsPosition.offsetLeft + 130 &&
          offsetAll[i][1] < troopsPosition.offsetTop + 130 &&
          offsetAll[i][1] > troopsPosition.offsetTop - 130
          // !hexAll[i].merchant
        ) {
          hexAll[i].possibleMove = new PossibleMove(UUID, hexAll[i]);
        }
      }
    };
  }
}

///// CLASS CAVALRY /////
// let cavalryPosition;
class Cavalry {
  constructor(player, id, color) {
    this.type = `cavalry`;
    this.player = player;
    this.id = id;
    this.color = color;

    const soldierClass = `cavalry${this.color}Hud`;

    this.showCavalry = () => id.childNodes[7].classList.add(soldierClass);
    // this.hideCavalry = () => id.classList.remove(soldierClass);

    this.deleteCavalry = () => {
      id.classList.remove(soldierClass);
      delete this.id.cavalry;
    };

    this.showCavalry(); //fires after create merchant
  }
}

class Infantry {
  constructor(player, id, color) {
    this.type = `infantry`;
    this.player = player;
    this.id = id;
    this.color = color;

    this.deleteInfantry = () => {
      id.classList.remove(infantryClass);
      delete this.id.infantry;
    };
  }
}

class Elephant {
  constructor(player, id, color) {
    this.type = `elephant`;
    this.player = player;
    this.id = id;
    this.color = color;

    this.deleteElephant = () => {
      id.classList.remove(elephantClass);
      delete this.id.elephant;
    };
  }
}

///// CLASS POSSIBLEMOVE /////
class PossibleMove {
  constructor(player, id) {
    this.player = player;
    this.id = id;
    this.showPossibleMove = () => this.id.classList.add(`possible-move`);

    this.deletePossibleMove = () => {
      id.classList.remove(`possible-move`);
      delete this.id.possibleMove;
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
