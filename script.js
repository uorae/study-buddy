
/**
 * Handles changing between scenes
 * @param {String} scene 
 */
const goToScene = (scene) => {
  const scenes = ["menu", "study"];

  for (const current of scenes) {
    document.getElementById(`${current}-scene`).style.display = "none";
  }

  // display current scene
  document.getElementById(`${scene}-scene`).style.display = "flex";
}

// start on menu scene
goToScene("menu");

/***************************************************************
                       MENU SCENE
***************************************************************/
const timerMinutes = document.getElementById('timer-minutes');

/**
 * True if minutes is valid
 * @returns boolean
 */
const minutesValid = () => {
  const val = timerMinutes.value;
  return RegExp('^(5|[0-9][05]|[01][0-8][05])$').test(val);
}

/**
 * Opens timer popup and displays timer.
 */
const openTimer = () => {
  const popup = document.getElementById("timer-popup");
  popup.style.display = "flex";

  document.getElementById("start-timer-button").addEventListener('click', () => {
  const val = timerMinutes.value;           // always fresh
  const minutes = parseInt(val, 10);        // convert string -> number

  if (minutesValid() && !isNaN(minutes)) {  // double check
    popup.style.display = "none";
    goToScene("study");
    console.log("Starting timer for:", minutes, "minutes");
    displayTimer(minutes * 60 * 1000);
  } else {
    console.log("Invalid input:", val);
  }
  })
}

const focusButton = document.getElementById('focus-button');
focusButton.addEventListener('click', () => {
  openTimer()
});

/***************************************************************
                       TIMER SCENE
***************************************************************/
const addButton = document.getElementById('add-button');
addButton.addEventListener('click', () => {
  let val = parseInt(timerMinutes.value) || 0;

  if (val < 185 ) {
    timerMinutes.value = val + 5;
  }
})
const subtractButton = document.getElementById('subtract-button');
subtractButton.addEventListener('click', () => {
  let val = parseInt(timerMinutes.value) || 0;

  if (val > 5 ) {
    timerMinutes.value = val - 5;
  }
})

/***************************************************************
                       STUDY SCENE
***************************************************************/
let timerInterval;
let timeLeft = 0;

const displayTimer = (totalMs) => {
  timeLeft = totalMs; 
  const deadline = Date.now() + timeLeft;

  const count = () => {
    const now = Date.now();
    const t = deadline - now;

    if (t <= 0) {
      document.getElementById("timer").textContent = "time's up";
      clearInterval(timerInterval);
      goToScene("menu");
      return;
    }

    const hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((t % (1000 * 60)) / 1000);

    document.getElementById("timer").textContent =
      (hours > 0 ? hours + ":" : "") +
      String(minutes).padStart(2, "0") + ":" +
      String(seconds).padStart(2, "0");

    timeLeft = t;
    console.log(timeLeft);
  };

  clearInterval(timerInterval);
  timerInterval = setInterval(count, 1000);
  count();
};

document.getElementById("pause-timer-button").addEventListener("click", () => {
  clearInterval(timerInterval); // stop countdown
  document.getElementById("resume-timer-button").style.display = "block";
  document.getElementById("pause-timer-button").style.display = "none";
});

document.getElementById("resume-timer-button").addEventListener("click", () => {
  displayTimer(timeLeft);
  console.log(timeLeft);
  document.getElementById("pause-timer-button").style.display = "block";
  document.getElementById("resume-timer-button").style.display = "none";
});

document.getElementById("end-timer-button").addEventListener("click", () => {
  clearInterval(timerInterval); // stop countdown
  timeLeft = 0;
  goToScene("menu");
});
