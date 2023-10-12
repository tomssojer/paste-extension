let allItems = document.querySelectorAll(".list-group-item");
let activeItemIndex;

document.addEventListener("keydown", (event) => {
  if (event.key == "Enter") {
    window.close();
  }

  allItems.forEach((item, index) => {
    if (item.classList.contains("active")) {
      activeItemIndex = index;
    }
  });

  if (event.key === "ArrowDown" && activeItemIndex < allItems.length - 1) {
    allItems[activeItemIndex].classList.remove("active");
    allItems[activeItemIndex + 1].classList.add("active");
  } else if (event.key === "ArrowUp" && activeItemIndex > 0) {
    allItems[activeItemIndex].classList.remove("active");
    allItems[activeItemIndex - 1].classList.add("active");
  }
});

document.addEventListener("click", () => {
  allItems.forEach((item, index) => {
    if (item.classList.contains("active")) {
      activeItemIndex = index;
    }
  });

  allItems[activeItemIndex].classList.remove("active");
  document.activeElement.classList.add("active");

  window.close();
});
