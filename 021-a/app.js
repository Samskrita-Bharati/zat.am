const menu = [
  { id: 1, title: "अन्वेषणम् lines", category: "", dir: "1-li", desc: `क्रीडतु  । <br> Play with <pre>lines </pre>`,},
  { id: 2, title: "अन्वेषणम् circles", category: "", dir: "2-ci", desc: `क्रीडतु । <br> Play with <pre>circles</pre> `,},
  { id: 3, title: "अन्वेषणम् hexagons/cubes", category: "", dir: "3-he", desc: `क्रीडतु ।<br> Play with - <pre>cubes</pre>`,},
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