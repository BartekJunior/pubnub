"use strict";

// Init start Hexes
const hexAll = Array.from(document.querySelectorAll(`.hex`));
let hexRow = Array.from(document.querySelectorAll(`.hex-row`));
hexRow = hexRow.map((m) => Array.from(m.children));

//Create all HEXES on the board
hexAll.forEach((el) => {
  const newHex = new Hex(el, undefined, false, undefined, false);
  el.hex = newHex;
});

let player;
let player1;
let player2;
let player3;

// Make start Hexes. It must be conected to set player functiion. Edit this
hexAll[0].hex = new Hex(hexAll[0], `grass`, true, `food`, true);
hexAll[1].hex = new Hex(hexAll[1], `forest`, true, `wood`, true);
hexAll[6].hex = new Hex(hexAll[6], `mountain`, true, `stone`, true);
hexAll[7].hex = new Hex(hexAll[7], `plain`, true, `food`, false);
hexAll[0].classList.add(`class-${hexAll[0].hex.land}`);
hexAll[1].classList.add(`class-${hexAll[1].hex.land}`);
hexAll[6].classList.add(`class-${hexAll[6].hex.land}`);
hexAll[7].classList.add(`class-${hexAll[7].hex.land}`);

// hexAll[2].troops = new Troops(hexAll[2], `green`);
// hexAll[2].troops.soldiers = [
//   new Cavalry(hexAll[2], `green`),
//   new Infantry(hexAll[2], `green`),
//   new Merchant(hexAll[2], `green`),
//   new Merchant(hexAll[2], `green`),
// ];
// hexAll[2].troops.calcSize();
// hexAll[2].troops.showSoldierHex();

// hexAll[4].troops = new Troops(hexAll[4], `green`);
// hexAll[4].troops.soldiers = [
//   new Elephant(hexAll[4], `green`),
//   new Elephant(hexAll[4], `green`),
//   new Cavalry(hexAll[4], `green`),
//   new Cavalry(hexAll[4], `green`),
// ];
// hexAll[4].troops.calcSize();
// hexAll[4].troops.showSoldierHex();

// Array of 4 land piece. One big array of 12 cafelkas. Each one has 4 Hexes of land//
const hexArea = [];
const hexInRow = hexAll.length / 6; //!!!!!!!Devine by 6 only when you have 6 HEX ROWS on the map!!!!!!!!!!!!

const gather4hex = function (x) {
  const arr4hex = [
    hexAll[x],
    hexAll[x + 1],
    hexAll[x + hexInRow],
    hexAll[x + hexInRow + 1],
  ];
  hexArea.push(arr4hex);
};

for (let i = 0; i < hexAll.length / 6; i = i + 2) {
  gather4hex(i);
}
for (let i = (hexAll.length / 6) * 2; i < (hexAll.length / 6) * 3; i = i + 2) {
  gather4hex(i);
}
for (let i = (hexAll.length / 6) * 4; i < (hexAll.length / 6) * 5; i = i + 2) {
  gather4hex(i);
}
// Array of 4 land piece. One big array of 12 cafelkas. Each one has 4 Hexes of land//

//SET PLAYER, CREATE FIRST MERCHANT for each user. playersNumber must be SET well!!!
setPlayer.addEventListener(`click`, function () {
  const num = Math.ceil(playersNumber / onlineUsers.size);
  let color;
  if (onlineUsers.size === 3) color = `blue`;
  else if (onlineUsers.size === 2) color = `red`;
  else if (onlineUsers.size === 1) color = `green`;
  else alert(`Liczba graczy musi wynosic 1-3`);

  //set individual player for each user
  player = new Player(UUID, num, color, false, 0);
  // player.setSkills();
  window.tree = new Tree();


  //set active turn to first player
  if (player.nr === 1) {
    player.action = 3;
    startGame.style.display = `block`;
  }
  checkActionFirst();

  //add individual merchant for each user (seen only for current user)
  if (player.nr == 1) {
    player1 = player;
    hexAll[0].troops = new Troops( hexAll[0], player.color);
    hexAll[0].troops.soldiers.push(new Merchant( hexAll[0], player.color));
    hexAll[0].troops.calcSize();
    hexAll[0].troops.showSoldierHex();
  } else if (player.nr == 2) {
    player2 = player;
    hexAll[35].troops = new Troops( hexAll[35], player.color);
    hexAll[35].troops.soldiers.push(
      new Merchant( hexAll[35], player.color)
    );
    hexAll[35].troops.calcSize();
    hexAll[35].troops.showSoldierHex();
  } else if (player.nr == 3) {
    player3 = player;
    hexAll[5].troops = new Troops( hexAll[5], player.color);
    hexAll[5].troops.soldiers.push(new Merchant( hexAll[5], player.color));
    hexAll[5].troops.calcSize();
    hexAll[5].troops.showSoldierHex();
  }

  // show start resource
  for (let i = 0; i < window.p1GlobalResourceDiv.length; i++) {
    window[`p` + player.nr + `GlobalResourceDiv`][i].innerHTML =
      player.resource[res[i]];
  }

  // Show player name and whole playerGlobalHud
  window[`p` + player.nr + `Global`].children[0].innerHTML = UUID;
  window[`p` + player.nr + `Global`].children[0].style.backgroundColor =
    player.color;
  window[`p` + player.nr + `ActionValue`].textContent = player.action;
  window[`p` + player.nr + `Global`].style.display = `block`;
});


// ------------------------------------------------------------------------ //




// Testing soldiers //
const hexes = document.querySelectorAll(`.hex`);
console.log(hexes);


// hexes[0].childNodes[0].classList.add(`soldierHex`, `elephantgreen`);
// hexes[0].childNodes[2].classList.add(`soldierHex`, `elephantgreen`);
// hexes[0].childNodes[6].classList.add(`soldierHex`, `elephantgreen`);
// hexes[0].childNodes[8].classList.add(`soldierHex`, `elephantgreen`);


const bb = () => {
  hexes[0].childNodes[4].classList.add(`towngreen`);
  hexes[0].childNodes[1].classList.add(`market`);
  hexes[0].childNodes[3].classList.add(`fortress`);
  hexes[0].childNodes[5].classList.add(`academy`);
  hexes[0].childNodes[7].classList.add(`obelisk`);

  hexes[1].childNodes[4].classList.add(`towngreen`);
  hexes[1].childNodes[3].classList.add(`market`);
  hexes[1].childNodes[1].classList.add(`fortress`);
  hexes[1].childNodes[7].classList.add(`academy`);
  hexes[1].childNodes[5].classList.add(`obelisk`);


  hexes[2].childNodes[4].classList.add(`towngreen`);
  hexes[2].childNodes[3].classList.add(`observatory`);
  hexes[2].childNodes[1].classList.add(`port`);
  hexes[2].childNodes[7].classList.add(`temple`);






}





