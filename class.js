`use strict`;

// CLASS PLAYER //
class Player {
  constructor(name, nr, color, turnActive, food, wood, stone, gold, idea, morale, action) {
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
    }

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
      if(this.id.childNodes.length === 0) {
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
    }

    this.showHudTown = () => (hudTown.style.display = `block`);
    this.hideHudTown = () => (hudTown.style.display = `none`);

    this.hideConfirmCollectBtn = () =>
      (confirmCollectBtn.style.display = `none`);

    this.showContainerStructure = () =>
      (containerStructure.style.display = `block`);
    this.hideContainerStructure = () =>
      (containerStructure.style.display = `none`);
    
    this.showContainerRecruit = () =>
      (containerRecruit.style.display = `block`);
    this.hideContainerRecruit = () =>
      (containerRecruit.style.display = `none`);

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
    };

    this.updateGlobalResource = () => {
      for (let i = 0; i < p1GlobalResourceDiv.length; i++) {
        const player = window[`player` + UUID];
        player.resource[res[i]] = player.resource[res[i]] + tempResource[res[i]];
        window[`p` + player.nr + `GlobalResourceDiv`][i].innerHTML = player.resource[res[i]];
        tempResource[res[i]] = 0;
        collecting[i].innerHTML = tempResource[res[i]];
      }
      hexAll.forEach(el => {
        if(el.possibleResource) el.possibleResource.deletePossibleResource();
      })
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

    this.showMerchant = () => id.classList.add(merchantClass);
    this.hideMerchant = () => id.classList.remove(merchantClass);
    this.showHudMerchant = () => (hudMerchant.style.display = `block`);
    this.hideHudMerchant = () => (hudMerchant.style.display = `none`);

    this.deleteMerchant = () => {
      id.classList.remove(merchantClass);
      delete this.id.merchant;
    };

    this.settle = () => {
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
      this.id.hex.collectible = false;
      hexAll.forEach((el) => {
        if (el.possibleMove) {
          el.possibleMove.deletePossibleMove();
        }
      });
      this.hideHudMerchant();
      this.deleteMerchant();
      merchantPosition = undefined;
      window[`player` + UUID].action--;
    };

    this.whereToGo = () => {
      merchantPosition = this.id;
      let offsetAll = [];
      for (let i = 0; i < hexAll.length; i++) {
        offsetAll[i] = [hexAll[i].offsetLeft, hexAll[i].offsetTop];
      }

      this.showHudMerchant();

      for (let i = 0; i < hexAll.length; i++) {
        if (
          offsetAll[i][0] > this.id.offsetLeft - 130 &&
          offsetAll[i][0] < this.id.offsetLeft + 130 &&
          offsetAll[i][1] < this.id.offsetTop + 130 &&
          offsetAll[i][1] > this.id.offsetTop - 130 &&
          !hexAll[i].merchant
        ) {
          const possibleMove = new PossibleMove(UUID, hexAll[i]);
          hexAll[i].possibleMove = possibleMove;
        }
      }
    };

    this.showMerchant(); //fires after create merchant
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


    this.showTempResource = () => {
      if (clickedRes[clickedRes.length - 1] === `food`) tempResource.food++;
      else if (clickedRes[clickedRes.length - 1] === `wood`) tempResource.wood++;
      else if (clickedRes[clickedRes.length - 1] === `stone`) tempResource.stone++;
      else if (clickedRes[clickedRes.length - 1] === `gold`) tempResource.gold++;
      else if (clickedRes[clickedRes.length - 1] === `idea`) tempResource.idea++;
      else if (clickedRes[clickedRes.length - 1] === `morale`) tempResource.morale++;

      for (let i = 0; i < collecting.length; i++) {
        collecting[i].innerHTML = tempResource[res[i]]
      }
    };


    this.collectTempResource = () => {
      if (this.id.possibleResource && clickedRes.length < town.size) {
        if (this.id.hex.collectible && !this.collected) {
          clickedRes.push(this.id.possibleResource.resource);
          this.id.possibleResource.showConfirmCollectBtn();
          this.id.possibleResource.showTempResource();
          console.log(clickedRes);
          this.collected = true;
        } else if (!this.id.hex.collectible)
          alert(
            `Nie możesz zbierac z tego pola. Brakuje Ci rozwinięcia / jałowa ziemia / wróg / inne miasto etc.`
          );
          else if (this.collected) alert(`Juz zebrałeś z tego pola`)
      }
    }

    this.deleteTempResource = () => {
      for (const res in tempResource) {
        tempResource[res] = 0;
      }
      for (let i = 0; i < collecting.length; i++) {
        collecting[i].innerHTML = tempResource[res[i]]
      }
    }

    this.showPossibleResource(); //fires after create hex
  }
}


