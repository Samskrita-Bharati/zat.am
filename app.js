const menu = [
  { id: 1, title: "श्रीमद् भगवद्गीता", category: "TA", dir: "001-sbg", desc: `-तः पदानि अन्वेषयन्तु । <br> Find words jumbled up from any verse (shlokaH) of <pre>shriimad bhagavadgiitaa </pre>`,},
  { id: 2, title: "शिलाखण्डः , पत्रम् , कर्तरी", category: "RG", dir: "002-zpk", desc: `क्रीडतु । <br> Play Rock,Paper,Scissors - <pre>shilaakhaNDaH , patram , kartarii</pre> `,},
  { id: 3, title: "सोपानसर्पाः च", category: "ET", dir: "003-ssc", desc: `क्रीडतु ।<br> Play Ladders & Snakes game and learn with fun - <pre>sopaanasarpaaH cha</pre>`,},
  { id: 4, title: "सुडोकू ", category: "RG", dir: "004-sis",	desc : `क्रीडतु । <br> Challenge yourself to a Sudoku in <pre>saMskRRitam</pre>`,},
  { id: 5, title: "द्वन्द्वयुद्धम् ", category: "RG", dir: "005-dy",	 desc : `क्रीडतु । <br> Shall we call Tic-Tac-Toe in Sanskrit as <pre>dvandvayuddham ? :)</pre>`,  },
  { id: 6, title: "नाम किम्? ", category: "TA", dir: "006-nk", desc : `!? <br> Generate randomly (funny?) English-Sanskrit nick-<pre>naama</pre>`,
  },
  { id: 7, title: "श्रीकृष्णस्य वा अर्जुनस्य", category: "TA", dir: "007-ask", desc : ` नामपदानि अन्वेषयन्तु । <br> Find words jumbled up from names of Shri Krishna or Arjuna from <pre>shriimad bhagavadgiitaa </pre>`,},
 { id: 8, title: "संस्कृतम्  Minesweeper", category: "RG", dir: "008-mss", desc : ` क्रीडतु । <br> Play the classic game of Minesweeper - with numerals in <pre>saMskRRitam </pre>`,},
	 { id: 9, title: "Memory क्रीडा ", category: "RG", dir: "009-mmk", desc : ` क्रीडतु । <br> Play the classic game of Matching/Memory - with so more options coming soon`,}, 
	 { id: 10, title: "राशयः  ", category: "RG", dir: "010-sw", desc : ` Fun with राशिः । <br> Learning will happen too !`,}, 
	 { id: 11, title: "मासाः ", category: "RG", dir: "011-m", desc : ` Fun with मासाः । <br> Indian months !`,},  
	 { id: 12, title: "सूर्यनमस्कारः  ", category: "RG", dir: "012-sn", desc : ` Salute the Sun ! <br> सूर्यः <pre>suuryaH</pre>`,}, 
		 {
			id: 12, title: "सङ्ख्या matching", category: "RG", dir: "013-mts", desc : ` Match the सङ्ख्या ! (numbers in संस्कृतम् ) <br> <pre>sa~Nkhyaa</pre>`, 
		 },
  { id: 13, title: "शीघ्रम् आगमिष्यति ...", category: "TA", dir: "999-cs",
    desc: `Many more fun stuff coming soon - <pre>shiighram aagamiShyati... </pre> `,
  },
  { id: 14, title: "Connect the Dots", category: "RG", dir: "999-cs",
    desc: `coming soon - <pre>shiighram aagamiShyati... </pre>`,
  },
  { id: 15, title: "Paint by सङ्ख्या ", category: "ET", dir: "999-cs",
    desc: `Paint by sa~Nkhyaa coming soon - <pre>shiighram aagamiShyati... </pre>`,
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
              <a href=${item.dir}/>${item.title}</a>
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
    ["all"]
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
/*
var lnk = 'https://api.github.com/repos/thakkaha/baalamodinii/contents';
      (async () => {
        const response = await fetch(lnk);
        const data = await response.json();
        let htmlString = '';
        for (let file of data) {
          if(!hiddenfiles.includes(file.name)){
            htmlString += `<a href="${file.name}" class="col-6 col-md-2 archive-structure-pictorial" title="${file.html_url}"><div class="card sanskrit-english"><img class="img-fluid" src="${file.name}.png" alt="${file.name}" /><p>${file.name}</p></div></a>`;
          }
        }
        document.getElementById('stories').innerHTML += htmlString;
      })()
*/