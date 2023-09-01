"use strict";

// Init start Hexes
const hexAll = Array.from(document.querySelectorAll(`.hex`));
let hexRow = Array.from(document.querySelectorAll(`.hex-row`));
hexRow = hexRow.map((m) => Array.from(m.children));

//Create all HEXES on the board
hexAll.forEach((el) => {
  const newHex = new Hex(el, undefined, false, undefined, false);
  el.object = newHex;
});

//Put Merchants on the board
hexAll[0].merchant = new Merchant(UUID, hexAll[0]);
hexAll[35].merchant = new Merchant(UUID, hexAll[35]);

// Make start Hexes
hexAll[0].object = new Hex(hexAll[0], `grass`, true, `food`, true);
hexAll[1].object = new Hex(hexAll[1], `forest`, true, `wood`, true);
hexAll[6].object = new Hex(hexAll[6], `mountain`, true, `stone`, true);
hexAll[7].object = new Hex(hexAll[7], `plain`, true, `food`, false);
hexAll[0].classList.add(`class-${hexAll[0].object.type}`);
hexAll[1].classList.add(`class-${hexAll[1].object.type}`);
hexAll[6].classList.add(`class-${hexAll[6].object.type}`);
hexAll[7].classList.add(`class-${hexAll[7].object.type}`);

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

const setPlayer = document.getElementById(`setPlayer`);
setPlayer.addEventListener(`click`, function () {
  const num = Math.ceil(playersNumber / onlineUsers.size);
  if (onlineUsers.size === 3) color = `red`;
  else if (onlineUsers.size === 2) color = `blue`;
  else if (onlineUsers.size === 1) color = `green`;
  else alert(`Liczba graczy musi wynosic 1-3`);
  window["player" + UUID] = new Player(UUID, num, color, 2, 1, 0, 0, 0, 2, 3);

  // show start resource
  for (let i = 0; i < p1GlobalResourceDiv.length; i++) {
    // const p1GlobalResourceArr2 = Object.entries(p1GlobalResource);
    p1GlobalResourceDiv[i].innerHTML = window[`player` + UUID].resource[res[i]];
  }
});

hexAll.forEach((el, index) =>
  el.addEventListener(`click`, function (e) {
    console.log(index);
  })
);
