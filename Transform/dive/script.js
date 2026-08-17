// ==========================
// DIVE STEPS
// ==========================

let currentStep = 1;
const minStep = 1;
const maxStep = 79;

let transformComplete = false;
let turnInProgress = false;


// ==========================
// TILE POOL
// ==========================

const totalTiles = 18;
const tilesPerTurn = 6;

const tilePool = [];

for (let index = 1; index <= totalTiles; index += 1) {
  tilePool.push(`t${index}`);
}


// ==========================
// TILE MOVEMENT
// ==========================

// Each tile can move Dive forward or backward.
// Repeated positive numbers make forward movement
// somewhat more likely overall.
//
// These can be adjusted later without changing
// the rest of the architecture.

const tileMovement = {
  t1:  [-3, -1, 1],
  t2:  [-2, -1, 1],
  t3:  [-4, -1, 1],
  t4:  [1, 2, 4],
  t5:  [-1, 1, 2],
  t6:  [-4, -2],

  t7:  [1, 2, 3],
  t8:  [-1, 1],
  t9:  [1, 3, 5],
  t10: [1, 2, 4],
  t11: [-2, -1, 1],
  t12: [1, 2, 5],

  t13: [1, 2, 3],
  t14: [-1, 1],
  t15: [-2, 2],
  t16: [-3, -2],
  t17: [-1, 1],
  t18: [-2, 2]
};


// ==========================
// PAGE ELEMENTS
// ==========================

const diveElement =
  document.querySelector(".dive");

const choiceArea =
  document.querySelector("#choiceArea");

const endModal =
  document.querySelector("#endModal");

const resetDive =
  document.querySelector("#resetDive");


// ==========================
// DIVE DISPLAY
// ==========================

function updateDive() {
  if (!diveElement) {
    return;
  }

  const stepImage =
    document.createElement("img");

  stepImage.src =
    `steps/s${currentStep}.png`;

  stepImage.alt =
    `Dive step ${currentStep}`;

  stepImage.classList.add("dive-step");

  stepImage.addEventListener(
    "load",
    function () {
      diveElement.replaceChildren(stepImage);
    }
  );
}


// ==========================
// TILE RANDOMIZATION
// ==========================

function shuffleArray(array) {
  const shuffled = [...array];

  for (
    let index = shuffled.length - 1;
    index > 0;
    index -= 1
  ) {
    const randomIndex =
      Math.floor(Math.random() * (index + 1));

    const temporaryValue =
      shuffled[index];

    shuffled[index] =
      shuffled[randomIndex];

    shuffled[randomIndex] =
      temporaryValue;
  }

  return shuffled;
}


function chooseTiles() {
  const shuffledTiles =
    shuffleArray(tilePool);

  return shuffledTiles.slice(
    0,
    tilesPerTurn
  );
}


// ==========================
// TILE DISPLAY
// ==========================

function displayTiles() {
  const selectedTiles =
    chooseTiles();

  choiceArea.innerHTML = "";

  selectedTiles.forEach(
    function (tileName, index) {

      const tileButton =
        document.createElement("button");

      tileButton.type = "button";
      tileButton.classList.add(
        "dive-tile",
        "entering"
      );

      tileButton.dataset.tile =
        tileName;

      const tileImage =
        document.createElement("img");

      tileImage.src =
        `tiles/${tileName}.png`;

      tileImage.alt = "";

      tileButton.appendChild(
        tileImage
      );

      tileButton.addEventListener(
        "click",
        function () {
          selectTile(tileButton);
        }
      );

      choiceArea.appendChild(
        tileButton
      );

      window.setTimeout(
        function () {
          tileButton.classList.remove(
            "entering"
          );

          tileButton.classList.add(
            "visible"
          );
        },
        80 + index * 80
      );
    }
  );

  turnInProgress = false;
}


// ==========================
// MOVEMENT
// ==========================

function getRandomMovement(tileName) {
  const possibleMoves =
    tileMovement[tileName];

  const randomIndex =
    Math.floor(
      Math.random() *
      possibleMoves.length
    );

  return possibleMoves[randomIndex];
}


function moveDive(amount) {
  if (transformComplete) {
    return;
  }

  currentStep += amount;

  if (currentStep < minStep) {
    currentStep = minStep;
  }

  if (currentStep >= maxStep) {
    currentStep = maxStep;
    transformComplete = true;
  }

  updateDive();

  if (transformComplete) {
    endTransform();
  }
}


// ==========================
// TILE SELECTION
// ==========================

function selectTile(selectedTile) {
  if (
    turnInProgress ||
    transformComplete
  ) {
    return;
  }

  turnInProgress = true;

  const tileName =
    selectedTile.dataset.tile;

  const movement =
    getRandomMovement(tileName);

  moveDive(movement);

  const visibleTiles =
    Array.from(
      choiceArea.querySelectorAll(
        ".dive-tile"
      )
    );

  visibleTiles.forEach(
    function (tile) {
      tile.disabled = true;
      tile.classList.remove("visible");
      tile.classList.add("leaving");
    }
  );

  if (transformComplete) {
    return;
  }

  window.setTimeout(
    function () {
      displayTiles();
    },
    500
  );
}


// ==========================
// END TRANSFORM
// ==========================

function endTransform() {
  const visibleTiles =
    Array.from(
      choiceArea.querySelectorAll(
        ".dive-tile"
      )
    );

  visibleTiles.forEach(
    function (tile) {
      tile.disabled = true;
      tile.classList.remove("visible");
      tile.classList.add("leaving");
    }
  );

  window.setTimeout(
    function () {
      endModal.classList.add("show");
    },
    2500
  );
}


// ==========================
// RESET
// ==========================

resetDive.addEventListener(
  "click",
  function () {

    currentStep = 1;
    transformComplete = false;
    turnInProgress = false;

    endModal.classList.remove("show");

    updateDive();
    displayTiles();
  }
);

function preloadDiveSteps() {
  for (
    let step = 1;
    step <= maxStep;
    step += 1
  ) {
    const image = new Image();
    image.src = `steps/s${step}.png`;
  }
}

preloadDiveSteps();

// ==========================
// START TRANSFORM
// ==========================

updateDive();
displayTiles();