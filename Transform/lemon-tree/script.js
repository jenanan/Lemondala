// ==========================
// TREE STEPS
// ==========================

let currentStep = 1;
const minStep = 1;
const maxStep = 38;
let gameOver = false;


// ==========================
// CARD DECK
// Three copies of every regular card
// ==========================


const regularCards = [
  "Sun",
  "Moon",
  "Rain",
  "Wind",
  "Storm",
  "Wasp",
  "Soil",
  "Human",
  "Fungus",
  "Frost"
];

const wildcardCards = [
  "PurpleHorns",
  "GreenHorns",
  "AquaHorns",
  "WizardLemon",
  "SwordLemon",
  "DynamiteLemon"
];

const copiesPerRegularCard = 3;

let drawPile = [];


// ==========================
// CARD MOVEMENT
// Temporary values for testing
// ==========================

// For now, every non-Fire card can move the tree
// backward or forward by 1 or 2 steps.
//
// Later, each card can have its own probabilities.
// Example:
// Sun: [-2, 2]
// Rain: [-1, 1, 1, 2]

const cardMovement = {
  Sun: [-1, 1, 1, 2],
  Moon: [-1, 1, 2],
  Rain: [-1, 1, 2],
  Wind: [-1, 1],
  Storm: [-2, 1],
  Wasp: [1, 1, 2, 2],
  Soil: [-1, 1, 1, 2],
  Human: [-2, -1, 1, 1],
  Fungus: [-2, -1, 1],
  Frost: [-1, 1],

  PurpleHorns: [1],
  GreenHorns: [1],
  AquaHorns: [1],
  WizardLemon: [1],
  SwordLemon: [-4]
};

const cardImages = {
  Sun: "card_images/sun.png",
  Moon: "card_images/moon.png",
  Rain: "card_images/rain.png",
  Wind: "card_images/wind.png",
  Storm: "card_images/storm.png",
  Soil: "card_images/soil.png",
  Fungus: "card_images/fungus.png",
  Human: "card_images/human.png",
  Frost: "card_images/frost.png",
  Wasp: "card_images/wasp.png",
  GreenHorns: "card_images/green-horns.png",
  PurpleHorns: "card_images/purple-horns.png",
  AquaHorns: "card_images/aqua-horns.png",
  DynamiteLemon: "card_images/dynamite-lemon.png",
  SwordLemon: "card_images/sword-lemon.png",
  WizardLemon: "card_images/wizard-lemon.png"
};


// ==========================
// PAGE ELEMENTS
// ==========================

const treeElement = document.querySelector(".tree");

const allCardElements =
  Array.from(document.querySelectorAll(".card"));

// Use only two cards.
const cardElements = allCardElements.slice(0, 2);

// If old HTML still contains a third card, hide it.
allCardElements.slice(2).forEach(function (card) {
  card.hidden = true;
});

let turnInProgress = false;


// ==========================
// DECK FUNCTIONS
// ==========================

function buildDeck() {
  const newDeck = [];

  // Three copies of every regular card
  regularCards.forEach(function (cardName) {
    for (let copy = 0; copy < copiesPerRegularCard; copy += 1) {
      newDeck.push(cardName);
    }
  });

  // One copy of every wildcard
  wildcardCards.forEach(function (cardName) {
    newDeck.push(cardName);
  });

  return shuffleArray(newDeck);
}


function shuffleArray(array) {
  const shuffled = [...array];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex =
      Math.floor(Math.random() * (index + 1));

    const temporaryValue = shuffled[index];

    shuffled[index] = shuffled[randomIndex];
    shuffled[randomIndex] = temporaryValue;
  }

  return shuffled;
}


function refillDeckIfNeeded() {
  if (drawPile.length < 2) {
    drawPile = buildDeck();
  }
}


function drawTwoCards() {
  refillDeckIfNeeded();

  return [
    drawPile.pop(),
    drawPile.pop()
  ];
}


function displayCards() {
  const drawnCards = drawTwoCards();

  cardElements.forEach(function (card, index) {
    const cardName = drawnCards[index];

    card.dataset.card = cardName;

    // Clear whatever was previously inside the card
    card.innerHTML = "";

    // If artwork exists, show it
    if (cardImages[cardName]) {
      const image = document.createElement("img");

      image.src = cardImages[cardName];
      image.alt = cardName;

      card.appendChild(image);
    }

    // Otherwise keep showing the name for unfinished cards
    else {
      card.textContent = cardName;
    }

    card.classList.remove("dealt", "leaving");
    card.classList.add("dealing");

    card.style.pointerEvents = "none";

    window.setTimeout(function () {
      card.classList.remove("dealing");
      card.classList.add("dealt");

      card.style.pointerEvents = "auto";
      card.removeAttribute("aria-disabled");
    }, 150 + index * 150);
  });

  turnInProgress = false;
}


// ==========================
// TREE DISPLAY
// ==========================

function updateTree() {
  if (!treeElement) {
    return;
  }

  treeElement.innerHTML = "";

  const stepImage = document.createElement("img");

  stepImage.src =
    `steps/s${currentStep}.png`;

  stepImage.alt = `Lemon tree step ${currentStep}`;
  stepImage.classList.add("tree-step");

  treeElement.appendChild(stepImage);
}


// ==========================
// MOVEMENT
// ==========================

function getRandomMovement(cardName) {
  const possibleMoves = cardMovement[cardName];

  const randomIndex =
    Math.floor(Math.random() * possibleMoves.length);

  return possibleMoves[randomIndex];
}


function moveTree(amount) {
  if (gameOver) {
    return;
  }

  currentStep += amount;

  if (currentStep < minStep) {
    currentStep = minStep;
  }

  if (currentStep >= maxStep) {
    currentStep = maxStep;
    gameOver = true;
  }

  updateTree();

  if (gameOver) {
    endGame();
  }
}

function endGame() {
  disableCards();

  cardElements.forEach(function (card) {
    card.classList.add("leaving");
  });

  window.setTimeout(function () {
    document
      .querySelector("#endModal")
      .classList.add("show");
  }, 500);
}

document
  .querySelector("#resetGame")
  .addEventListener("click", function () {

    currentStep = 1;
    gameOver = false;

    drawPile = buildDeck();

    document
      .querySelector("#endModal")
      .classList.remove("show");

    cardElements.forEach(function (card) {
      card.style.display = "";
      card.classList.remove("leaving");
    });

    updateTree();
    displayCards();
  });


// ==========================
// CARD SELECTION
// ==========================

function disableCards() {
  cardElements.forEach(function (card) {
    card.style.pointerEvents = "none";
    card.setAttribute("aria-disabled", "true");
  });
}

cardElements.forEach(function (card) {
  card.addEventListener("click", function () {

    if (turnInProgress) {
      return;
    }

    turnInProgress = true;
    disableCards();

    const selectedCard = card.dataset.card;

    // Dynamite Lemon will get special reset behavior next.
    if (selectedCard === "DynamiteLemon") {
      currentStep = 1;
      updateTree();

      card.textContent = selectedCard;
    } else {
      const movement = getRandomMovement(selectedCard);

      moveTree(movement);

      card.textContent = selectedCard;
    }

    // Let the result sit briefly.
    window.setTimeout(function () {

      cardElements.forEach(function (card) {
        card.classList.add("leaving");
      });

      window.setTimeout(function () {
        displayCards();
      }, 400);

    }, 900);

  });
});


// ==========================
// START GAME
// ==========================

drawPile = buildDeck();

displayCards();

updateTree();