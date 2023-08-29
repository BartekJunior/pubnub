`use strict`;

// CLASS PLAYER //

class Player {
  constructor(name, nr, color, food, wood, stone, gold, idea, morale) {
    this.name = name;
    this.nr = nr;
    this.color = color;
    this.food = food;
    this.wood = wood;
    this.stone = stone;
    this.gold = gold;
    this.idea = idea;
    this.morale = morale;

    this.showResourceValue = (resource) => {
      window[`p1` + resource + `Value`].innerHTML = this[resource];
    };
  }
}

// CLASS HEX //
class Hex {
  constructor(id, type, vis, resource, collectible) {
    this.id = id;
    this.type = type;
    this.vis = vis;
    this.resource = resource;
    this.collectible = collectible;

    this.checkResource = () => {
      if (this.type === `grass`) return (this.resource = `food`);
      else if (this.type === `forest`) return (this.resource = `wood`);
      else if (this.type === `mountain`) return (this.resource = `stone`);
      else if (this.type === `plain`) return (this.resource = `food`);
      else if (this.type === `water`) return (this.resource = `gold`);
    };

    this.checkCollectible = () => {
      if (this.type === `water` || this.type === `plain`)
        return (this.collectible = false);
      else if (
        this.type === `grass` ||
        this.type === `forest` ||
        this.type === `mountain`
      )
        return (this.collectible = true);
    };

    this.createSmall = function () {
      let hexChild = [];
      for (let i = 0; i < 9; i++) {
        const hexSmall = document.createElement("div");
        // hexSmall.style.backgroundColor = colorArr[i];
        hexSmall.classList.add(`hex-small`);
        hexChild.push(hexSmall);
      }

      for (let i = 0; i < hexChild.length; i++) {
        this.id.appendChild(hexChild[i]);
      }
    };

    // Draw the type of the land
    this.chooseLand = function () {
      const x = Math.ceil(Math.random() * 5);
      if (x === 1) return `water`;
      else if (x === 2) return `grass`;
      else if (x === 3) return `forest`;
      else if (x === 4) return `mountain`;
      else if (x === 5) return `plain`;
    };

    this.getType = () => {
      hexArea.forEach((el) => {
        if (el.includes(this.id)) {
          el.forEach((el) => {
            el.object.type = this.chooseLand();
            el.object.vis = true;
            el.classList.add(`class-${el.object.type}`);
            el.object.checkResource();
            el.object.checkCollectible();
          });
        }
      });
    };

    this.createSmall(); //Fires after object begin. Create 9 small divs inside big Hex.
  }
}

class Town {
  constructor(
    player,
    id,
    size,
    port,
    academy,
    fortress,
    market,
    obelisk,
    temple,
    observatory
  ) {
    this.player = player;
    this.id = id;
    this.size = size;
    this.port = port;
    this.academy = academy;
    this.fortress = fortress;
    this.market = market;
    this.obelisk = obelisk;
    this.temple = temple;
    this.observatory = observatory;

    this.showHudTown = () => hudTown.style.display = `block`;
    this.hideHudTown = () => hudTown.style.display = `none`;

    this.hideConfirmCollectBtn = () => confirmCollectBtn.style.display = `none`;




    this.showContainerStructure = () =>
      (containerStructure.style.display = `block`);
    this.hideContainerStructure = () =>
      (containerStructure.style.display = `none`);

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
      this[building] = true;
      this.calcSize();
    };

    this.calcSize = () => {
      const buildings = [
        Number(this.port),
        Number(this.academy),
        Number(this.fortress),
        Number(this.market),
        Number(this.obelisk),
        Number(this.temple),
        Number(this.observatory)
      ]
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
          offsetAll[i][1] > this.id.offsetTop - 130 &&
          hexAll[i].object.collectible
        ) {
          const possibleResource = new PossibleResource(
            UUID,
            hexAll[i],
            hexAll[i].object.resource
          );
          hexAll[i].possibleResource = possibleResource;
        }
      }
    };
  }
}

///// CLASS MERCHANT /////
let merchantPosition;
class Merchant {
  constructor(player, id) {
    this.player = player;
    this.id = id;

    this.showMerchant = () => id.classList.add(`merchant`);
    this.hideMerchant = () => id.classList.remove(`merchant`);
    this.showHudMerchant = () => (hudMerchant.style.display = `block`);
    this.hideHudMerchant = () => (hudMerchant.style.display = `none`);

    this.deleteMerchant = () => {
      id.classList.remove(`merchant`);
      delete this.id.merchant;
    };

    this.settle = () => {
      this.id.town = new Town(
        UUID,
        this.id,
        1,
        false,
        false,
        false,
        false,
        false,
        false,
        false
      );
      this.id.childNodes[4].classList.add(`town`);
      this.id.object.collectible = false;
      hexAll.forEach((el) => {
        if (el.possibleMove) {
          el.possibleMove.deletePossibleMove();
        }
      });
      this.hideHudMerchant();
      this.deleteMerchant();
      merchantPosition = undefined;
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

    this.showMerchant(); //fires after create object
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

    this.showPossibleMove(); //fires after create object
  }
}

///// CLASS POSSIBLERESOURCE /////
class PossibleResource {
  constructor(player, id, resource) {
    this.player = player;
    this.id = id;
    this.resource = resource;

    this.showPossibleResource = () => this.id.classList.add(`possible-collect`);

    this.showConfirmCollectBtn = () => confirmCollectBtn.style.display = `block`;
    this.hideConfirmCollectBtn = () => confirmCollectBtn.style.display = `none`;


    this.deletePossibleResource = () => {
      id.classList.remove(`possible-collect`);
      delete this.id.possibleResource;
    };

    this.showPossibleResource(); //fires after create object
  }
}
