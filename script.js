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
    "Ef þú segir nei þá verð ég mjög leið...",
    "Mjög leið...",
    "Mjög mjög mjög leiðd...",
    "ok :( ég skal hætta að spyrja...",
    "Djk segðu já plís! ❤️"
];

let messageIndex = 0;
let noClickCount = 0;
const totalMessages = messages.length;
let showedAllMessages = false;


// cat status gifs
const gifStages = [
    // default
    { min: 0,  src: "https://tenor.com/view/kitty-kitten-kittens-cat-cats-gif-23725952.gif" },
    
    // side eye
    { min: 2,  src: "https://tenor.com/view/amma-cat-ts-js-pmo-icl-pmo-cat-gif-9038313483801766180.gif" },
    
    // glare
    { min: 4,  src: "https://tenor.com/view/tức-giận-gif-7420873232229821020.gif" },

    // brick throw
    { min: 6,  src: "https://tenor.com/view/brick-cat-cat-throwing-brick-gif-16807810806930405877.gif" },
    
    { min: 8, src: "https://tenor.com/view/cat-gun-cat-with-gun-wizard-cat-wizard-cat-with-gun-gif-16159015422731305199.gif" },
];



function handleNoClick() {
    const noButton = document.querySelector('.no-button');
    const yesButton = document.querySelector('.yes-button');
    const gifContainer = document.querySelector('.gif_container');

    if (showedAllMessages) {
        // remove NO button
        noButton.remove();

        // remove GIF image
        if (gifContainer) {
            gifContainer.remove();
        }

        // Update counter with final message
        updateNoCounter(true);
        return; // exit early
    }

    // NORMAL flow

    noClickCount++;
    updateNoCounter();
    updateStatusGif();

    // Update NO button text
    noButton.textContent = messages[messageIndex];

    // increase YES button size
    const currentSize = parseFloat(window.getComputedStyle(yesButton).fontSize);
    yesButton.style.fontSize = `${currentSize * 1.5}px`;

    // Check if we just showed the last message
    if (messageIndex === totalMessages - 1) {
        showedAllMessages = true;
    }
    // Move to next message
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

function updateStatusGif() {
    const img = document.querySelector("img.status-gif");

    img.onerror = () => {
        console.warn("GIF failed to load:", img.src);
    };

    console.log(img)
    if (!img) return;

    let chosen = gifStages[0].src; // default

    for (const stage of gifStages) {
        if (noClickCount >= stage.min) chosen = stage.src;
        else break;
    }

    // prevent unnecessary reloads
    if (img.dataset.currentSrc === chosen) return;

    img.src = chosen;
    img.dataset.currentSrc = chosen;
}
