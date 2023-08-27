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
    }
  }
}

// CLASS HEX //
class Hex {
  constructor(id, type, vis) {
    this.id = id;
    this.type = type;
    this.vis = vis;

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
          });
        }
      });
    };

    this.createSmall(); //Fires after object begin. Create 9 small divs inside big Hex.
  }
}

class Town {
  constructor(player, id, port, academy, fortress) {
    this.player = player;
    this.id = id;
    this.port = port;
    this.academy = academy;
    this.fortress = fortress;

    this.showHudTown = () => (hudTown.style.display = `block`);
    this.hideHudTown = () => (hudTown.style.display = `none`);

    this.showContainerStructure = () =>
      (containerStructure.style.display = `block`);
    this.hideContainerStructure = () =>
      (containerStructure.style.display = `none`);

    this.structurePlace = (building) => {
      if (building === `fortress`) return 1;
      else if (building === `market`) return 3;
      else if (building === `academy`) return 5;
      else if (building === `port`) return 7;
    };

    this.buildStructure = (building) => {
      this.id.childNodes[this.structurePlace(building)].classList.add(building);
      this[building] = true;
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
      this.id.town = new Town(UUID, this.id, false, false, false);
      this.id.childNodes[4].classList.add(`town`);
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
          // hexAll[i].possibleMove.showPossibleMove();
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
