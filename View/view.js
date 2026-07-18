const modal = document.getElementById("gif-modal");
const modalGif = document.getElementById("modal-gif");
const closeButton = document.getElementById("modal-close");
const artworkButtons = document.querySelectorAll(".artwork-trigger");

let lastFocusedElement = null;

function openGif(button) {
    const gifPath = button.dataset.gif;
    const stillImage = button.querySelector("img");

    lastFocusedElement = button;

    modalGif.src = gifPath;
    modalGif.alt = `${stillImage.alt} Animated version.`;

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    closeButton.focus();
}

function closeGif() {
    modal.hidden = true;

    // Clears the GIF so it restarts from the beginning next time.
    modalGif.src = "";
    modalGif.alt = "";

    document.body.style.overflow = "";

    if (lastFocusedElement) {
        lastFocusedElement.focus();
    }
}

artworkButtons.forEach((button) => {
    button.addEventListener("click", () => openGif(button));
});

closeButton.addEventListener("click", closeGif);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        closeGif();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !modal.hidden) {
        closeGif();
    }
});

document.querySelectorAll(".artwork-trigger img, #modal-gif").forEach((image) => {
    image.addEventListener("contextmenu", (event) => {
        event.preventDefault();
    });
});

document.querySelectorAll(".artwork-trigger img").forEach((image) => {
    image.draggable = false;
});