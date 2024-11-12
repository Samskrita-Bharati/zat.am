//Vertical Scrolling ONLY  ✅
//Three buttons  + or - (to increase/decrease the speed) & then restart  ✅
//Funcionality to pause when hovered over the div and resumes when taken out. ✅
// Decreased the scrolling speed by adjusting frames i setTimeout [1200 => 2400] and scrollInterval[16=>32] and intial scrollSpeed[1=>0.5]

let scrollSpeed = 1;
let scrollInterval;

function startScrolling() {
  try {
    scrollInterval = setInterval(() => {
      document.getElementById("vScroll").scrollTop += scrollSpeed;
    }, 64);
  }catch (error) {
    console.error("Error Scrolling");
  }
}

function pauseScrolling() {
  clearInterval(scrollInterval);
}

function resumeScrolling() {
  startScrolling();
}


setTimeout(startScrolling, 2400);
// setTimeout(scrollVertically, 1200);

let verseData = [];

async function fetchVerse() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/gita/gita/refs/heads/main/data/verse.json"
    );
    verseData = await response.json();
    // console.log(verseData);
    showVerse();
  } catch (error) {
    console.error("Error Fetching the data");
  }
}

function showVerse() {
  let content = "";
  verseData.forEach(verse => {
    content += verse.text + "<br>";
  });
  document.querySelector(".container .scroll-section #verse").innerHTML = content;
}

fetchVerse();

//FIX : when negative, the auto-scroll get reversed
function changeSpeed(n) {
  scrollSpeed += n;
  // console.log(scrollSpeed) development pursope
}

function verseRestart() {
  document.querySelector(".container .scroll-section #verse").innerHTML = ""
  fetchVerse().then(() => {
    showVerse();
    // console.log("Restarted");
  });
}