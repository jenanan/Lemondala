// The tree's current condition
let tree = {
  roots: 1,
  trunk: "straight",
  leaves: 1,
  fruit: 0
};

// Effects the game can choose from for now
const effects = [
  {
    name: "Roots deepen",
    apply: function () {
      tree.roots += 1;
    }
  },
  {
    name: "Leaves fall",
    apply: function () {
      tree.leaves -= 1;
    }
  },
  {
    name: "Tree bends",
    apply: function () {
      tree.trunk = "crooked";
    }
  },
  {
    name: "Fruit appears",
    apply: function () {
      tree.fruit += 1;
    }
  }
];

// Find the tree and cards on the page
const treeElement = document.querySelector(".tree");
const cards = document.querySelectorAll(".card");

// Pick a random effect
function getRandomEffect() {
  const randomIndex = Math.floor(Math.random() * effects.length);
  return effects[randomIndex];
}

// Redraw the tree based on its current condition
function updateTree() {
  let trunkLine = tree.trunk === "crooked" ? " /" : " |";
  let leaves = "*".repeat(Math.max(0, tree.leaves));
  let fruit = "o".repeat(Math.max(0, tree.fruit));

  treeElement.textContent = `
     ${leaves}
     ${fruit}
     ${trunkLine}
    \\|/
     |
    _|_
   /___\\
  `;
}

// When a card is clicked, apply one random effect
cards.forEach(function (card) {
  card.addEventListener("click", function () {
    const effect = getRandomEffect();

    effect.apply();

    card.textContent = effect.name;

    updateTree();
  });
});

// Draw the first tree
updateTree();