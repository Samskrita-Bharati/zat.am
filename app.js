const menu = [
  {
    id: 1,
    title: "श्रीमद् भगवद्गीता",
    category: "TA",
    dir: "001-sbg",
    desc: `-तः करोतु अन्वेषणम्  । <br> Find words jumbled up from any verse (shlokaH) of <pre>shriimad bhagavadgiitaa </pre>`,
  },
  {
    id: 2,
    title: "शिलाखण्डः , पत्रम् , कर्तरी",
    category: "RG",
    dir: "002-zpk",
    desc: `क्रीडतु । <br> Play Rock,Paper,Scissors - <pre>shilaakhaNDaH , patram , kartarii</pre> `,
  },
  {
    id: 3,
    title: "सोपानसर्पाः च",
    category: "ET",
    dir: "003-ssc",
    desc: `क्रीडतु ।<br> Play Ladders & Snakes game and learn with fun - <pre>sopaanasarpaaH cha</pre>`,
  },
  {
    id: 4,
    title: "सुडोकू ",
    category: "RG",
    dir: "004-sis",
    desc: `क्रीडतु । <br> Challenge yourself to a Sudoku in <pre>saMskRRitam</pre>`,
  },
  {
    id: 5,
    title: "द्वन्द्वयुद्धम् ",
    category: "RG",
    dir: "005-dy",
    desc: `क्रीडतु । <br> Shall we call Tic-Tac-Toe in Sanskrit as <pre>dvandvayuddham ? :)</pre>`,
  },
  {
    id: 6,
    title: "नाम किम्? ",
    category: "TA",
    dir: "006-nk",
    desc: `!? <br> Generate randomly (funny?) English-Sanskrit nick-<pre>naama</pre>`,
  },
  {
    id: 7,
    title: "श्रीकृष्णस्य वा अर्जुनस्य",
    category: "TA",
    dir: "007-ask",
    desc: ` नामपदान्वेषणम्  । <br> Find words jumbled up from names of Shri Krishna or Arjuna from <pre>shriimad bhagavadgiitaa </pre>`,
  },
  {
    id: 8,
    title: "संस्कृतम्  Minesweeper",
    category: "RG",
    dir: "008-mss",
    desc: ` क्रीडतु । <br> Play the classic game of Minesweeper - with numerals in <pre>saMskRRitam </pre>`,
  },
  {
    id: 9,
    title: "Memory क्रीडा ",
    category: "RG",
    dir: "009-mmk",
    desc: ` क्रीडतु । <br> Play the classic game of Matching/Memory - with so more options coming soon`,
  },
  {
    id: 10,
    title: "राशयः  ",
    category: "RG",
    dir: "010-sw",
    desc: ` Fun with राशिः । <br> Learning will happen too !`,
  },
  {
    id: 11,
    title: "मासाः ",
    category: "RG",
    dir: "011-m",
    desc: ` Fun with मासाः । <br> Indian months !`,
  },
  {
    id: 12,
    title: "सूर्यनमस्कारः  ",
    category: "RG",
    dir: "012-sn",
    desc: ` Salute the Sun ! <br> सूर्यः <pre>suuryaH</pre>`,
  },
  {
    id: 13,
    title: "सङ्ख्या matching",
    category: "RG",
    dir: "013-mts",
    desc: ` Match the सङ्ख्या ! (numbers in संस्कृतम् ) <br> <pre>sa~Nkhyaa</pre>`,
  },
  {
    id: 14,
    title: "सङ्ख्या typer",
    category: "RG",
    dir: "014-st",
    desc: ` Type the सङ्ख्या  (number) <br> before it hits the center and you lose a 'life' !`,
  },
  {
    id: 15,
    title: "२०४८",
    category: "RG",
    dir: "015-2048",
    desc: ` २०४८ क्रीडतु <br> 2048`,
  },
  {
    id: 16,
    title: "समस्या ",
    category: "RG",
    dir: "016-ss",
    desc: ` [samasyaa = puzzle]`,
  },
  {
    id: 17,
    title: "रचयतु ",
    category: "RG",
    dir: "017-byo",
    desc: ` Create by mixing/matching :)`,
  },
  {
    id: 18,
    title: "Arrange सुभाषितम्  ",
    category: "RG",
    dir: "018-as",
    desc: ` Order the words of a सुभाषितम्  in correct sequence! <pre>subhaaShitam</pre>`,
  },
  {
    id: 19,
    title: "चित्र-समस्या ",
    category: "RG",
    dir: "019-cs",
    desc: ` Jigsaw puzzle for a <pre>chitram</pre>`,
  },
  // {
  //   id: 20,
  //   title: "कथा game",
  //   category: "RG",
  //   dir: "020-kk",
  //   desc: ` Put a कथा (story) in place!<pre>kathaa</pre>`,
  // },
  {
    id: 21,
    title: "अन्वेषणम् ",
    category: "RG",
    dir: "021-a",
    desc: ` 'Finding Waldo'-style fun!?<pre>anveShaNam </pre>`,
  },
  {
    id: 22,
    title: "पाशः",
    category: "RG",
    dir: "022-p",
    desc: ` <pre>paashaH/jaalam </pre> means net/trap/maze`,
  },
  {
    id: 24,
    title: "सङ्क्षेपरामायणम्  ",
    category: "RG",
    dir: "024-sr",
    desc: `-तः करोतु अन्वेषणम् । <br> Find words jumbled up from any verse (shlokaH) of <pre>sa~NkSheparaamaayaNam </pre>`,
  },
  {
    id: 25,
    title: "Arrange श्लोकः",
    category: "RG",
    dir: "025-sr",
    desc: `from <pre>सङ्क्षेपरामायणम्  sa~NkSheparaamaayaNam</pre>`,
  },
  {
    id: 26,
    title: "स्वराः-painting",
    category: "RG",
    dir: "026-sp",
    desc: `learn to write <pre>स्वराः  svaraaH</pre>`,
  },
  {
    id: 27,
    title: "१५ समस्या",
    category: "RG",
    dir: "027-15s",
    desc: `play the classic 15-puzzle <pre>समस्या samasyaa</pre>`,
  },
  {
    id: 31,
    title: "Flash",
    category: "ET",
    dir: "031-flash",
    desc: `Flash cards for learning Sanskrit: alphabet, common phrases, sentences, and more...`,
  },
  {
    id: 32,
    title: "पदरञ्जिनी - padara~njinii",
    category: "सम्भाषणसन्देशः",
    dir: "pr",
    desc: `Crosswords (in संस्कृतम् )  from monthly magazine सम्भाषणसन्देशः`,
  },
  {
    id: 33,
    title: "अन्विष्यन्तां पदानि anviShyantaaM padaani",
    category: "सम्भाषणसन्देशः",
    dir: "033-ap",
    desc: `Word Search (in संस्कृतम् )  from monthly magazine सम्भाषणसन्देशः`,
  },
  {
    id: 34,
    title: "श्री-विष्णुसहस्रनाम",
    category: "Telegram",
    dir: "https://t.me/visnu1k",
    desc: `search names of shrii Vishnu (in संस्कृतम् )  from 1000 in Telegram channel`,
  },
  {
    id: 35,
    title: "निकषोपलः ",
    category: "Telegram",
    dir: "https://t.me/nikaSopalaH",
    desc: `nikaSopalaH (quiz) from monthly magazine सम्भाषणसन्देशः on Telegram channel`,
  },
  {
    id: 36,
    title: "कथाः - प्रश्नावली ",
    category: "Telegram",
    dir: "https://t.me/kathaaH",
    desc: `Q and A quiz based on kathaaH from monthly magazine सम्भाषणसन्देशः on Telegram channel`,
  },
  {
    id: 37,
    title: "Simple संस्कृतम्  transliterator",
    category: "TA",
    dir: "037-sst",
    desc: `SST for quick and easy back and forth transliteration`,
  },
  {
    id: 38,
    title: "संस्कृतम्  Bingo",
    category: "TA",
    dir: "038-bingo",
    desc: `helper`,
  },

  {
    id: 40,
    title: "संस्कृतम्  analog clock",
    category: "TA",
    dir: "040-ks",
    desc: `कः समयः ? kaH samayaH`,
  },
  {
    id: 41,
    title: "श्रीमद्भगवद्गीता  in a year!",
    category: "TA",
    dir: "041-giy",
    desc: `श्रीमद्भगवद्गीता  <pre>shriimad-bhagavad-giitaa</pre> in 2024!`,
  },
  {
    id: 42,
    title: "संस्कृतम् Rocks!",
    category: "TA",
    dir: "042-sr",
    desc: `<pre>संस्कृतम्  (saMskRRitam)</pre> Rocks! <br>Simple sentences you can use for self-introduction`,
  },
  {
    id: 43,
    title: " T-rex in संस्कृतम् ",
    category: "RG",
    dir: "043-trs",
    desc: `Chrome Easter Egg - T-rex runner with संस्कृतम्  scores :) `,
  },
  {
    id: 44,
    title: " गणितपरीक्षा ",
    category: "RG",
    dir: "044-gp",
    desc: `MathBattle in संस्कृतम्  :) `,
  },
  {
    id: 45,
    title: " A game ",
    category: "RG",
    dir: "045-nss",
    desc: `in संस्कृतम्  :) `,
  },
  {
    id: 46,
    title: "गगननौका game ",
    category: "RG",
    dir: "046-ds",
    desc: `in संस्कृतम्  :) `,
  },
  {
    id: 47,
    title: "सर्पलीला game ",
    category: "RG",
    dir: "047-sl",
    desc: `Classic Snake Game in संस्कृतम्  :) `,
  },
  {
    id: 48,
    title: "Free Smash game ",
    category: "RG",
    dir: "048-fs",
    desc: `Free Smash game in संस्कृतम्: <pre>Prince Chauhan</pre> `,
  },
  {
    id: 49,
    title: "श्लोकार्थ संग्रह",
    category: "TA",
    dir: "049-sas",
    desc: `श्रीमद्-भगवद्गीता-श्लोकसंग्रह: Collection of Shlokas from श्रीमद् भगवद्गीता `,
  },
  {
    id: 50,
    title: "Auto श्लोकपाठक:",
    category: "TA",
    dir: "050-asp",
    desc: `Auto Reader for Shloka from श्रीमद् भगवद्गीता `,
  },
  {
    id: 51,
    title: "Wordle with numbers",
    category: "ET",
    dir: "051-numerale",
    desc: `Wordle game with devanagari numerals `,
  },
  {
    id: 52,
    title: "Verb Conjugations",
    category: "ET",
    dir: "052-lakaara",
    desc: `Sorting puzzle on sanskrit verb conjugations `,
  },
  {
    id: 53,
    title: "Noun declensions",
    category: "ET",
    dir: "053-shabd",
    desc: `Sorting puzzle on sanskrit noun declensions `,
  },
  {
    id: 54,
    title: "Maheshwarani sutrani",
    category: "ET",
    dir: "054-shiva-sutra",
    desc: `Sliding puzzle on Shiva sutras or Maheshwarani sutrani `,
  },
  {
    id: 55,
    title: "Namavali",
    category: "RG",
    dir: "055-namavali",
    desc: `Connections style game on hindu deities names`,
  },
  {
    id: 56,
    title: "Panchang",
    category: "RG",
    dir: "056-panchang",
    desc: `Jigsaw puzzle based on daily Panchang`,
  },
  {
    id: 57,
    title: "Gita Typing Game",
    category: "RG",
    dir: "057-gita-typing",
    desc: `Practice typing on English (Harvard-Kyoto) transliteration of the shlokas from Bhagavad Gita`,
  },
  {
    id: 28,
    title: "शीघ्रम् आगमिष्यति ...",
    category: "TA",
    dir: "999-cs",
    desc: `Many more fun stuff coming soon - <pre>shiighram aagamiShyati... </pre> `,
  },
  {
    id: 29,
    title: "Connect the Dots",
    category: "RG",
    dir: "999-cs",
    desc: `coming soon - <pre>shiighram aagamiShyati... </pre>`,
  },
  {
    id: 30,
    title: "Paint by सङ्ख्या ",
    category: "ET",
    dir: "999-cs",
    desc: `Paint by sa~Nkhyaa coming soon - <pre>shiighram aagamiShyati... </pre>`,
  },
  {
    id: 31,
    title: "vishwa संस्कृतम्  ",
    category: "ET",
    dir: "bp26",
    desc: `BodhaPlay संस्कृतम् competition 2026 coming soon - <pre>shiighram aagamiShyati... </pre>`,
  },
];
// get parent element
const sectionCenter = document.querySelector(".section-center");
const btnContainer = document.querySelector(".btn-container");
// display all items when page loads
window.addEventListener("DOMContentLoaded", function () {
  diplayMenuItems(menu);
  displayMenuButtons();
});

function diplayMenuItems(menuItems) {
  let displayMenu = menuItems.map(function (item) {
    return `<article class="menu-item">
          <img src=${item.dir}/cover.jpg alt="${item.title}" class="photo" />
          <div class="item-info">
            <header>
              <a href=${item.dir}/ target="zat.am">${item.title}</a>
              <h4 class="price">${item.category}</h4>
            </header>
            <p class="item-text">
              ${item.desc}
            </p>
          </div>
        </article>`;
  });
  displayMenu = displayMenu.join("");
  // console.log(displayMenu);

  sectionCenter.innerHTML = displayMenu;
}
function displayMenuButtons() {
  const categories = menu.reduce(
    function (values, item) {
      if (!values.includes(item.category)) {
        values.push(item.category);
      }
      return values;
    },
    ["all"],
  );
  const categoryBtns = categories
    .map(function (category) {
      return `<button type="button" class="filter-btn" data-id=${category}>
          ${category}
        </button>`;
    })
    .join("");

  btnContainer.innerHTML = categoryBtns;
  const filterBtns = btnContainer.querySelectorAll(".filter-btn");
  //console.log(filterBtns);

  filterBtns.forEach(function (btn) {
    btn.addEventListener("click", function (e) {
      // console.log(e.currentTarget.dataset);
      const category = e.currentTarget.dataset.id;
      const menuCategory = menu.filter(function (menuItem) {
        // console.log(menuItem.category);
        if (menuItem.category === category) {
          //hht	if (menuItem.category.indexOf(category)>0) {
          return menuItem;
        }
      });
      if (category === "all") {
        diplayMenuItems(menu);
      } else {
        diplayMenuItems(menuCategory);
      }
    });
  });
}
