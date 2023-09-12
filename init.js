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


// Make start Hexes. It must be conected to set player functiion. Edit this
hexAll[0].hex = new Hex(hexAll[0], `grass`, true, `food`, true);
hexAll[1].hex = new Hex(hexAll[1], `forest`, true, `wood`, true);
hexAll[6].hex = new Hex(hexAll[6], `mountain`, true, `stone`, true);
hexAll[7].hex = new Hex(hexAll[7], `plain`, true, `food`, false);
hexAll[0].classList.add(`class-${hexAll[0].hex.land}`);
hexAll[1].classList.add(`class-${hexAll[1].hex.land}`);
hexAll[6].classList.add(`class-${hexAll[6].hex.land}`);
hexAll[7].classList.add(`class-${hexAll[7].hex.land}`);

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
  window["player" + UUID] = new Player(UUID, num, color, false, 2, 1, 0, 0, 0, 2, 0);
  player = window[`player` + UUID];


  //set active turn to first player
  if (player.nr === 1) {
    player.action = 3;
    startGame.style.display = `block`;
  }
  checkActionFirst();

  //add individual merchant for each user (seen only for current user)
  if (player.nr == 1) hexAll[0].merchant = new Merchant(UUID, hexAll[0], player.color);
  else if (player.nr == 2) hexAll[35].merchant = new Merchant(UUID, hexAll[35], player.color);
  else if (player.nr == 3) hexAll[5].merchant = new Merchant(UUID, hexAll[5], player.color);
  
  // show start resource
  for (let i = 0; i < window.p1GlobalResourceDiv.length; i++) {
    window[`p` + player.nr + `GlobalResourceDiv`][i].innerHTML = player.resource[res[i]];
  }

  // Show player name and whole playerGlobalHud
  window[`p` + player.nr + `Global`].children[0].innerHTML = UUID;
  window[`p` + player.nr + `Global`].children[0].style.backgroundColor = player.color;
  window[`p` + player.nr + `Global`].style.display = `block`;
});




