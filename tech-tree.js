"use strict";

const res = [`food`, `wood`, `stone`, `gold`, `idea`, `culture`, `morale`];

window.p1TechBtns = Array.from(
  document.querySelectorAll(`#p1TechTree .tech-btn`)
);
window.p2TechBtns = Array.from(
  document.querySelectorAll(`#p2TechTree .tech-btn`)
);
window.p3TechBtns = Array.from(
  document.querySelectorAll(`#p3TechTree .tech-btn`)
);

window.p1TechRes = Array.from(
  document.querySelectorAll(`#p1TechTree > .tech-resource > .res`)
);
window.p2TechRes = Array.from(
  document.querySelectorAll(`#p2TechTree > .tech-resource > .res`)
);
window.p3TechRes = Array.from(
  document.querySelectorAll(`#p3TechTree > .tech-resource > .res`)
);

const resBg = Array.from(document.querySelectorAll(`.res-bg`));

let skillsType = Array.from(
  document.querySelectorAll(`#p1TechTree .tech-info > h6`)
);
skillsType = skillsType.map((el) => el.textContent);

const skillConfirmContainer = document.getElementById(`skillConfirmContainer`);
const confirmAdvance = document.getElementById(`confirmAdvance`);
const cancelAdvance = document.getElementById(`cancelAdvance`);

const p1Skills = p1TechBtns.map((el, index) => ({
  type: skillsType[index],
  id: el,
  unlocked: false,
  purchased: false,
  used: false,
}));
const p2Skills = p2TechBtns.map((el, index) => ({
  type: skillsType[index],
  id: el,
  unlocked: false,
  purchased: false,
  used: false,
}));
const p3Skills = p3TechBtns.map((el, index) => ({
  type: skillsType[index],
  id: el,
  unlocked: false,
  purchased: false,
  used: false,
}));

const skillsTop = [];
let clickedSkill;
let clickedSkillIndex;

// CLASS PLAYER //
// creates ONCE in SetPlayer //
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

    Player.prototype.canAfford = function (cost) {
      if (true)
      // Check if deducting costs will result in negative resources
      if (
        this.resource.food - (cost.food || 0) < 0 ||
        this.resource.wood - (cost.wood || 0) < 0 ||
        this.resource.stone - (cost.stone || 0) < 0 ||
        this.resource.gold - (cost.gold || 0) < 0 ||
        this.resource.idea - (cost.idea || 0) < 0 ||
        this.resource.culture - (cost.culture || 0) < 0 ||
        this.resource.morale - (cost.morale || 0) < 0
      ) {
        // Insufficient resources, halt the method
        alert(`Masz za mało surowców!`)
        return false;
      } else return true
    };

    Player.prototype.bearTheCost = function (cost) {
      if (!this.canAfford(cost)) return
      else 
      this.resource.food -= cost.food || 0;
      this.resource.wood -= cost.wood || 0;
      this.resource.stone -= cost.stone || 0;
      this.resource.gold -= cost.gold || 0;
      this.resource.idea -= cost.idea || 0;
      this.resource.culture -= cost.culture || 0;
      this.resource.morale -= cost.morale || 0;
      this.showPlayerResource();
      return true;
    };

    Player.prototype.showPlayerResource = function () {
      for (let i = 0; i < res.length; i++) {
        window[`p` + this.nr + `GlobalResourceDiv`][i].innerHTML =
          this.resource[res[i]];
      }
    };

    this.setSkills = () => {
      if (this.nr === 1) return p1Skills;
      if (this.nr === 2) return p2Skills;
      if (this.nr === 3) return p3Skills;
    };

    this.checkStart = () => {
      if (this.nr == 1) return 0;
      else if (this.nr == 2) return 35;
      else if (this.nr == 3) return 5;
    };

    this.skills = this.setSkills();

    // Set first 2 skills //
    this.skills[0].purchased = true;
    this.skills[4].purchased = true;
    this.skills[0].id.style.backgroundColor = this.color;
    this.skills[4].id.style.backgroundColor = this.color;
    this.skills[0].id.disabled = true;
    this.skills[4].id.disabled = true;

    // Set skillsTop to unclocked //
    for (let i = 8; i < this.skills.length; i = i + 4) {
      if (i < 36) {
        this.skills[i].unlocked = true;
      }
      skillsTop.push(this.skills[i]);
    }

    // Set first 8 skills to unclocked //
    for (let i = 0; i < 8; i++) {
      this.skills[i].unlocked = true;
    }

    this.start = this.checkStart();

    Player.prototype.makeAction = function () {
      this.action--;
      window[`p` + this.nr + `ActionValue`].textContent = this.action;
      console.log(`PLAYER MADE ACTION`);
    };
  }
}

// CLASS TREE //
// creates ONCE in SetPlayer //
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

      Tree.prototype.showResLine(player);
    };

    Tree.prototype.showResLine = (player) => {
      resBg.map((el) => (el.style.display = `none`));

      for (let i = 0; i < res.length - 2; i++) {
        const techRes = player.resource[res[i]];
        let childs;
        let foundRes;

        window[`p` + player.nr + `TechRes`].forEach((el, index) => {
          childs = Array.from(el.children);
          foundRes = childs.find((span) =>
            span.classList.contains(res[i] + `-icon`)
          );
          if (index === techRes) return (foundRes.style.display = `block`);
        });
      }
    };

    Tree.prototype.showConfirmAdvance = (clickedSkill) => {
      skillConfirmContainer.style.display = `block`;
      skillConfirmContainer.children[0].innerHTML = `Czy chcesz rozwinąć "${clickedSkill.type}"`;
    };

    Tree.prototype.hideConfirmAdvance = () =>
      (skillConfirmContainer.style.display = `none`);

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
          Tree.prototype.showConfirmAdvance(clickedSkill);
        } else alert(`LOCKED`);
      });
    });

    // Click OK and make Advance //
    confirmAdvance.addEventListener(`click`, () => {
      clickedSkill.purchased = true;
      clickedSkill.id.style.backgroundColor = player.color;
      clickedSkill.id.disabled = true;
      Tree.prototype.skillAffect(clickedSkillIndex);

      // Get morale or Culture instantly after Advance //
      if (clickedSkill.id.classList.contains(`border-morale`))
        this.player.resource.morale++;
      if (clickedSkill.id.classList.contains(`border-culture`))
        this.player.resource.culture++;
      Hud.prototype.refreshCultureMorale();

      // Unlock 3 more skills above //
      if (skillsTop.includes(clickedSkill)) {
        // Make sure to check if there's a next skill in the array.
        this.player.skills[clickedSkillIndex + 1].unlocked = true;
        this.player.skills[clickedSkillIndex + 2].unlocked = true;
        this.player.skills[clickedSkillIndex + 3].unlocked = true;
      }

      // Unlock each Democracy, Autocracy, Teocracy //
      if (
        clickedSkillIndex === 15 ||
        clickedSkillIndex === 19 ||
        clickedSkillIndex === 23
      )
        this.player.skills[clickedSkillIndex + 21].unlocked = true;

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

    // Advance affects game IMMIDETALLY //
    Tree.prototype.skillAffect = (clickedSkillIndex) => {
      // Irigation //
      if (clickedSkillIndex === 2) {
        hexAll.forEach((el) => {
          if (el.hex.vis) el.hex.checkCollectible();
        });
      }

      // Fishing //
      if (clickedSkillIndex === 8) {
        hexAll.forEach((el) => {
          if (el.hex.vis) el.hex.checkCollectible();
        });
      }
    };

    // end Tree constructor //
  }
}
