`use strict`;

// CLASS HEX //
  
  class Hex {
    constructor(id, type, town, vis) {
      this.id = id;
      this.type = type;
      this.town = town;
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
    constructor(player, id, port, academy, fortress ) {
      this.player = player;
      this.id = id;
  
      this.showHudTown = () => (hudTown.style.display = `block`);
      this.hideHudTown = () => (hudTown.style.display = `none`);
  
  
      this.buildStructure = (param) => {
        this.id.classList.add(`param`);
        this.param = true;
      };
  
      this.id.object.town = true;
    }
  }
  
  settleBtn.addEventListener(`click`, function () {
    merchantPosition.merchant.settle();
  });
  
  
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
        this.id.town = new Town(UUID, this.id);
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
  
  //Put Merchants on the board
  hexAll[0].merchant = new Merchant(UUID, hexAll[0]);
  hexAll[35].merchant = new Merchant(UUID, hexAll[35]);
  
  hexAll.forEach((el) => {
    const newHex = new Hex(el, undefined, false, false);
    el.object = newHex;
  });
  
  
  