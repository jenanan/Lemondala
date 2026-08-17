// ==========================
// SUNFLOWER STEPS
// ==========================

let currentStep = 1;
const minStep = 1;

// Number of sunflower state images.
const maxStep = 23;

let transformComplete = false;
let rollCount = 0;


// ==========================
// DIE MOVEMENT
// ==========================

const dieMovement = {
  1: [-1, 1, 2],
  2: [-3, 1, 2],
  3: [-1, 1, 2],
  4: [-2, -1, 1],
  5: [-1, 1, 2],
  6: [-2, -1, 1, 2]
};


// ==========================
// PAGE ELEMENTS
// ==========================

const sunflowerElement =
  document.querySelector(".sunflower");

const dieButton =
  document.querySelector("#dieButton");

const dieCube =
  document.querySelector("#dieCube");

const endModal =
  document.querySelector("#endModal");

const resetTransform =
  document.querySelector("#resetTransform");

let rollInProgress = false;


// ==========================
// SUNFLOWER DISPLAY
// ==========================

function updateSunflower() {
  if (!sunflowerElement) {
    return;
  }

  const stepImage = document.createElement("img");

  stepImage.src =
    `steps/s${currentStep}.png`;

  stepImage.alt =
    `Lemon sunflower step ${currentStep}`;

  stepImage.classList.add("sunflower-step");

  stepImage.addEventListener("load", function () {
    sunflowerElement.replaceChildren(stepImage);
  });
}


// ==========================
// DIE ROLL
// ==========================

function rollDie() {
  return Math.floor(Math.random() * 6) + 1;
}


function animateDie(finalRoll) {

  // Random dramatic full rotations.
  // Multiples of 360 let the die tumble
  // while still landing squarely on a face.
  const xTurns =
    (3 + Math.floor(Math.random() * 4)) * 360;

  const yTurns =
    (4 + Math.floor(Math.random() * 5)) * 360;

  let rotationX = xTurns;
  let rotationY = yTurns;

  switch (finalRoll) {

    case 1:
      break;

    case 2:
      rotationY += -90;
      break;

    case 3:
      rotationY += -180;
      break;

    case 4:
      rotationY += 90;
      break;

    case 5:
      rotationX += -90;
      break;

    case 6:
      rotationX += 90;
      break;
  }

  dieCube.style.transform =
    `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`;

  window.setTimeout(function () {
    applyRoll(finalRoll);
  }, 1200);
}


// ==========================
// MOVEMENT
// ==========================

function applyRoll(roll) {
  const possibleMoves = dieMovement[roll];

  let availableMoves = possibleMoves;

  // The first two rolls always move forward.
  if (rollCount < 2) {
    availableMoves = possibleMoves.filter(function (move) {
      return move > 0;
    });
  }

  const randomIndex =
    Math.floor(Math.random() * availableMoves.length);

  const movement =
    availableMoves[randomIndex];

  rollCount += 1;

  moveSunflower(movement);
}


function moveSunflower(amount) {
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

  updateSunflower();

  if (transformComplete) {
    endTransform();
    return;
  }

  window.setTimeout(function () {
    rollInProgress = false;
    dieButton.disabled = false;
  }, 500);
}


// ==========================
// END TRANSFORM
// ==========================

function endTransform() {
  dieButton.disabled = true;

  sunflowerElement.innerHTML = "";

  const completeVideo =
    document.createElement("video");

  completeVideo.src =
    "lemon_sunflower_complete.mp4";

  completeVideo.autoplay = true;
  completeVideo.muted = true;
  completeVideo.playsInline = true;

  completeVideo.classList.add(
    "sunflower-complete-video"
  );

  // Set up the completion message
  // before starting playback.
  completeVideo.addEventListener(
    "ended",
    function () {
      endModal.classList.add("show");
    }
  );

  sunflowerElement.appendChild(
    completeVideo
  );

  // Explicitly start playback.
  completeVideo.play().catch(
    function (error) {
      console.error(
        "Completion video could not play:",
        error
      );
    }
  );
}


// ==========================
// DIE SELECTION
// ==========================

dieButton.addEventListener(
  "click",
  function () {

    if (
      rollInProgress ||
      transformComplete
    ) {
      return;
    }

    rollInProgress = true;
    dieButton.disabled = true;

    const finalRoll =
      rollDie();

    animateDie(finalRoll);
  }
);


// ==========================
// RESET
// ==========================

resetTransform.addEventListener(
  "click",
  function () {

    currentStep = 1;
    transformComplete = false;
    rollInProgress = false;
    rollCount = 0;

    endModal.classList.remove("show");

    dieCube.style.transform =
      "rotateX(0deg) rotateY(0deg)";

    dieButton.disabled = false;

    updateSunflower();
  }
);

function preloadSunflowerSteps() {
  for (
    let step = 1;
    step <= maxStep;
    step += 1
  ) {
    const image = new Image();
    image.src = `steps/s${step}.png`;
  }
}

preloadSunflowerSteps();

// ==========================
// START TRANSFORM
// ==========================

updateSunflower();