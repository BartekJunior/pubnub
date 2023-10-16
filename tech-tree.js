"use strict";

let p1TechBtns = Array.from(document.querySelectorAll(`#p1TechTree .tech-btn`));
let p2TechBtns = Array.from(document.querySelectorAll(`#p2TechTree .tech-btn`));
let p3TechBtns = Array.from(document.querySelectorAll(`#p3TechTree .tech-btn`));

const skillConfirmContainer = document.getElementById(`skillConfirmContainer`);
const confirmAdvance = document.getElementById(`confirmAdvance`);
const cancelAdvance = document.getElementById(`cancelAdvance`);

const p1Skills = p1TechBtns.map((el) => ({
  id: el,
  unlocked: false,
  purchased: false,
  used: false,
}));
const p2Skills = p2TechBtns.map((el) => ({
  id: el,
  unlocked: false,
  purchased: false,
  used: false,
}));
const p3Skills = p3TechBtns.map((el) => ({
  id: el,
  unlocked: false,
  purchased: false,
  used: false,
}));

const skillsTop = [];



// let p1Skills = [];
// let p2Skills = [];
// let p3Skills = [];
// Create small groups of 4 skills in each group //
// for (let i = 0; i < p1SkillsObj.length; i += 4) {
//   p1Skills.push(p1SkillsObj.slice(i, i + 4));
// }
// for (let i = 0; i < p2SkillsObj.length; i += 4) {
//   p2Skills.push(p2SkillsObj.slice(i, i + 4));
// }
// for (let i = 0; i < p3SkillsObj.length; i += 4) {
//   p3Skills.push(p3SkillsObj.slice(i, i + 4));
// }






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

    this.skills[0].purchased = true;
    this.skills[4].purchased = true;
    this.skills[0].id.style.backgroundColor = this.color;
    this.skills[4].id.style.backgroundColor = this.color;
    this.skills[0].id.disabled = true;
    this.skills[4].id.disabled = true;


    

    for (let i = 8; i < this.skills.length; i = i + 4) {
      this.skills[i].unlocked = true;
      skillsTop.push(this.skills[i]);
    }

    for (let i = 0; i < 4; i = i++) {
      this.skills[i].unlocked = true;
    }

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
          if (el.unlocked) {
            clickedSkill = el;
            clickedSkillIndex = index;
            Tree.prototype.showConfirmAdvance();
            el.id.disabled = true;
          } else alert(`LOCKED`)
      });
    });

    // Unlock the Advance //
    this.player.skills.forEach((el, index) => {
      el.id.addEventListener(`click`, () => {
        if (skillsTop.includes(el)) {
          // Make sure to check if there's a next skill in the array.
          this.player.skills[index + 1].unlocked = true;
          this.player.skills[index + 2].unlocked = true;
          this.player.skills[index + 3].unlocked = true;
        }
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
