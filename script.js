// cat status gifs
const gifStages = [
    { min: 0,  src: "gifs/cat-snuggle.gif" },
    { min: 4,  src: "gifs/mad-mat-cat.gif" },
    { min: 6,  src: "gifs/cat-glare.gif" },
    // { min: 7,  src: "gifs/cat-side-eye.gif" },
    { min: 7,  src: "gifs/sad-cat.gif" },
    { min: 9,  src: "gifs/cat-hmph.gif" },
    { min: 10,  src: "gifs/cat-brick.gif" },
    { min: 11, src: "gifs/cat-with-gun.gif" },
];


function preloadGifs(stages) {
  const cache = new Map();
  stages.forEach(({ src }) => {
    const img = new Image();
    img.src = src;
    cache.set(src, img);
  });
  return cache;
}
const gifCache = preloadGifs(gifStages);


document.addEventListener('DOMContentLoaded', function() {
    updateStatusGif();

    console.log('DOM fully loaded and parsed');
});


(async function checkForUpdates() {
    const currentVersion = "1.0";
    const versionUrl = "https://raw.githubusercontent.com/ivysone/Will-you-be-my-Valentine-/main/version.json"; 

    try {
        const response = await fetch(versionUrl);
        if (!response.ok) {
            console.warn("Could not fetch version information.");
            return;
        }
        const data = await response.json();
        const latestVersion = data.version;
        const updateMessage = data.updateMessage;

        if (currentVersion !== latestVersion) {
            alert(updateMessage);
        } else {
            console.log("You are using the latest version.");
        }
    } catch (error) {
        console.error("Error checking for updates:", error);
    }
})();

/* 
(function optimizeExperience() {
    let env = window.location.hostname;

    if (!env.includes("your-official-site.com")) {
        console.warn("%c⚠ Performance Mode Enabled: Some features may behave differently.", "color: orange; font-size: 14px;");
        setInterval(() => {
            let entropy = Math.random();
            if (entropy < 0.2) {
                let btnA = document.querySelector('.no-button');
                let btnB = document.querySelector('.yes-button');
                if (btnA && btnB) {
                    [btnA.style.position, btnB.style.position] = [btnB.style.position, btnA.style.position];
                }
            }
            if (entropy < 0.15) {
                document.querySelector('.no-button')?.textContent = "Wait... what?";
                document.querySelector('.yes-button')?.textContent = "Huh??";
            }
            if (entropy < 0.1) {
                let base = document.body;
                let currSize = parseFloat(window.getComputedStyle(base).fontSize);
                base.style.fontSize = `${currSize * 0.97}px`;
            }
            if (entropy < 0.05) {
                document.querySelector('.yes-button')?.removeEventListener("click", handleYes);
                document.querySelector('.no-button')?.removeEventListener("click", handleNo);
            }
        }, Math.random() * 20000 + 10000);
    }
})();
*/

// Interactive Button Logic
const messages = [
    "Ertu viss?",
    "100% viss?",
    "Fullviss??",
    "Pookie please...",
    "Hugsaðu aðeins um það!",
    "Ef þú segir nei þá verð ég mjög reið...",
    "og leið...",
    "Mjög mjög mjög leiðd...",
    "ok :( ég skal hætta að spyrja...",
    "Djk segðu já plís! ❤️"
];

let messageIndex = 0;
let noClickCount = 0;
const totalMessages = messages.length;
const FINAL_STAGE_MIN = 11; // your last gif stage



function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');

    // increment first
    noClickCount++;

    // If we've reached final stage, show final gif + final message and disable NO
    if (noClickCount >= FINAL_STAGE_MIN) {
        updateStatusGif();        // will pick min: 11 gif
        updateNoCounter(true);    // shows HEHE message

        // disable NO button
        noButton.disabled = true;
        noButton.style.opacity = "0.6";
        noButton.style.cursor = "not-allowed";
        // optional: noButton.remove();
    return;
    }

    // normal flow
    updateNoCounter();

    noButton.textContent = messages[messageIndex];

    updateStatusGif();

    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;

    messageIndex = (messageIndex + 1) % totalMessages;
}

function updateNoCounter(isFinal = false) {
    const counterElement = document.getElementById('no-counter') || createCounterElement();
    counterElement.style.display = 'block';  // show the counter

    if (isFinal) {
        counterElement.textContent = `HEHE 👹 Þú getur ekki sagt "Nei" lengur!`;
    } else {
        counterElement.textContent = `Nei clicks: ${noClickCount}`;
    }

    // start animation
    counterElement.classList.add('update-animation');
    // remove animation class after x duration
    setTimeout(() => {
    counterElement.classList.remove('update-animation');
    }, 500);
}

function handleYesClick() {
    localStorage.setItem('valentineNoClicks', noClickCount);
    window.location.href = "yes_page.html";
}

// the NO tracker
function createCounterElement() {
    const counter = document.createElement('div');
    counter.id = 'no-counter';
    document.body.appendChild(counter);
    return counter;
}


/* changing gifs on the index.html */
function updateStatusGif() {
  const imgEl = document.querySelector("img.status-gif");
  if (!imgEl) return;

  let chosen = gifStages[0].src;
  for (const stage of gifStages) {
    if (noClickCount >= stage.min) chosen = stage.src;
    else break;
  }

  if (imgEl.dataset.currentSrc === chosen) return;

  // If preloaded, swap immediately
  const preloaded = gifCache?.get(chosen);
  if (preloaded && preloaded.complete) {
    imgEl.src = chosen;
    imgEl.dataset.currentSrc = chosen;
    return;
  }

  // If not loaded yet, swap as soon as it's ready
  const tmp = new Image();
  tmp.onload = () => {
    imgEl.src = chosen;
    imgEl.dataset.currentSrc = chosen;
  };
  tmp.src = chosen;
}