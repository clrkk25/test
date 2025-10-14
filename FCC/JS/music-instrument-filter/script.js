const instrumentsArr = [
  { category: "woodwinds", instrument: "Flute", price: 500 },
  { category: "woodwinds", instrument: "Clarinet", price: 200 },
  { category: "woodwinds", instrument: "Oboe", price: 4000 },
  { category: "brass", instrument: "Trumpet", price: 200 },
  { category: "brass", instrument: "Trombone", price: 300 },
  { category: "brass", instrument: "French Horn", price: 4300 },
  { category: "percussion", instrument: "Drum Set", price: 500 },
  { category: "percussion", instrument: "Xylophone", price: 3000 },
  { category: "percussion", instrument: "Cymbals", price: 200 },
  { category: "percussion", instrument: "Marimba", price: 3000 }
]

const selectContainer = document.querySelector("select");
const productsContainer = document.querySelector(".products-container");

// 页面加载时显示所有乐器
document.addEventListener("DOMContentLoaded", () => {
  productsContainer.innerHTML = instrumentCards("all");
});

function instrumentCards(instrumentCategory) {
  const instruments =
    instrumentCategory === "all"
      ? instrumentsArr
      : instrumentsArr.filter(
          ({ category }) => category === instrumentCategory
        );

  return instruments
    .map(({ instrument, price, category }) => {
      return `
          <div class="card" data-category="${category}">
            <h2>${instrument}</h2>
            <p>$${price}</p>
          </div>
        `;
    }).join(''); // 使用 join('') 方法连接数组元素，去除逗号
}

selectContainer.addEventListener("change", () => {
  productsContainer.innerHTML = instrumentCards(selectContainer.value);
});