document.addEventListener("DOMContentLoaded", () => {
  let listGroup = document.querySelector(".list-group");
  let allItems;
  let activeItemIndex;

  chrome.storage.local.get(["copiedValues"]).then((result) => {
    for (let i = 0; i < result.copiedValues.length; i++) {
      let listItem = document.createElement("li");
      listItem.className = "list-group-item";
      let listItemHtml = `
        <div class="row">
          <div class="col text-truncate">${result.copiedValues[i]}</div>
          <div class="col-1">${i}</div>
        </div>`;
      if (i == 0) {
        listItem.classList.add("active");
      }
      listItem.innerHTML = listItemHtml;
      listGroup.appendChild(listItem);
    }

    allItems = document.querySelectorAll(".list-group-item");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key == "Enter") {
      allItems.forEach((item, index) => {
        if (item.classList.contains("active")) {
          activeItemIndex = index;
        }

        window.close();
      });
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

  listGroup.addEventListener("click", () => {
    allItems.forEach((item, index) => {
      if (item.classList.contains("active")) {
        activeItemIndex = index;
      }
    });

    allItems[activeItemIndex].classList.remove("active");
    document.activeElement.classList.add("active");

    window.close();
  });
});
