"use strict";

let p1TechBtns = Array.from(document.querySelectorAll(`#p1TechTree .tech-btn`));
let p2TechBtns = Array.from(document.querySelectorAll(`#p2TechTree .tech-btn`));
let p3TechBtns = Array.from(document.querySelectorAll(`#p3TechTree .tech-btn`));

const skillConfirmContainer = document.getElementById(`skillConfirmContainer`);
const confirmAdvance = document.getElementById(`confirmAdvance`);
const cancelAdvance = document.getElementById(`cancelAdvance`);

const p1Skills = p1TechBtns.map((el) => ({
  id: el,
  purchased: false,
  used: false,
}));
const p2Skills = p2TechBtns.map((el) => ({
  id: el,
  purchased: false,
  used: false,
}));
const p3Skills = p3TechBtns.map((el) => ({
  id: el,
  purchased: false,
  used: false,
}));


let clickedSkill;
let clickedSkillIndex;

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
      culture: 1,
      morale: 2,
    };

    // this.skills = undefined;

    this.setSkills = () => {
      if (this.nr === 1) return p1Skills;
      if (this.nr === 2) return p2Skills;
      if (this.nr === 3) return p3Skills;
    }

    this.checkStart = () => {
      if (this.nr == 1) return 0;
      else if (this.nr == 2) return 35;
      else if (this.nr == 3) return 5;
    };

    this.skills = this.setSkills();

    this.start = this.checkStart();
  }
}

// CLASS TREE //
class Tree {
  constructor() {
    this.player = player;
    this.name = player.name;
    this.nr = player.nr;
    this.color = player.color;

    this.player.setSkills();

    Tree.prototype.showTechTree = function (player) {
      window[`p` + player.nr + `TechTree`].classList.toggle(`block-important`);
      window[
        `p` + player.nr + `TechTreeTitle`
      ].textContent = `Technology Tree ${player.name}`;
    };

    // ----- show/hide TECH TREE  ----- //
    p1TreeBtn.addEventListener(`click`, () =>
      Tree.prototype.showTechTree(player1)
    );
    p2TreeBtn.addEventListener(`click`, () =>
      Tree.prototype.showTechTree(player2)
    );
    p3TreeBtn.addEventListener(`click`, () =>
      Tree.prototype.showTechTree(player3)
    );

    p1ExitTech.addEventListener(`click`, () =>
      p1TechTree.classList.toggle(`block-important`)
    );

    p2ExitTech.addEventListener(`click`, () =>
      p2TechTree.classList.toggle(`block-important`)
    );

    p3ExitTech.addEventListener(`click`, () =>
      p3TechTree.classList.toggle(`block-important`)
    );

    // Make an Advance //
    this.player.skills.forEach((el, index) => {
      el.id.addEventListener(`click`, () => {
        clickedSkill = el;
        clickedSkillIndex = index;
        Tree.prototype.showConfirmAdvance();
      });
    });
 
    Tree.prototype.showConfirmAdvance = (skill) =>
      (skillConfirmContainer.style.display = `block`);
    Tree.prototype.hideConfirmAdvance = () =>
      (skillConfirmContainer.style.display = `none`);

    confirmAdvance.addEventListener(`click`, () => {
      clickedSkill.purchased = true;
      clickedSkill.id.style.backgroundColor = player.color;
      Tree.prototype.hideConfirmAdvance();
      clickedSkill = undefined;
      clickedSkillIndex = undefined;
      player.action--;
      window[`p` + player.nr + `ActionValue`].textContent = player.action;
    });

    cancelAdvance.addEventListener(`click`, () => {
      Tree.prototype.hideConfirmAdvance();
      clickedSkill = undefined;
    });


  }
}
