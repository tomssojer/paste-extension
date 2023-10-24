document.addEventListener("DOMContentLoaded", () => {
  let listGroup = document.querySelector(".list-group");
  let allItems;
  let allContent;
  let activeItemIndex;

  chrome.storage.local.get(["copiedValues"]).then((result) => {
    for (let i = 0; i < result.copiedValues.length; i++) {
      let listItem = document.createElement("li");
      listItem.className = "list-group-item";
      let listItemHtml = `
        <div class="row">
          <div class="col text-truncate content">${result.copiedValues[i]}</div>
          <div class="col-auto number">${i}</div>
        </div>`;
      if (i == 0) {
        listItem.classList.add("active");
      }
      listItem.innerHTML = listItemHtml;
      listGroup.appendChild(listItem);
    }

    allItems = document.querySelectorAll(".list-group-item");
    allContent = document.querySelectorAll(".list-group-item .content");
  });

  document.addEventListener("keydown", (event) => {
    searchActiveIndex();

    if (event.key == "Enter") {
      pasteToContentScript(allContent[activeItemIndex].innerText.trim());
      window.close();
    } else if (
      event.key === "ArrowDown" &&
      activeItemIndex < allItems.length - 1
    ) {
      allItems[activeItemIndex].classList.remove("active");
      allItems[activeItemIndex + 1].classList.add("active");
    } else if (event.key === "ArrowUp" && activeItemIndex > 0) {
      allItems[activeItemIndex].classList.remove("active");
      allItems[activeItemIndex - 1].classList.add("active");
    }
    if (Array.from("0123456789").includes(event.key)) {
      window.close();
    }
  });

  listGroup.addEventListener("click", () => {
    searchActiveIndex();
    pasteToContentScript(allContent[activeItemIndex].innerText.trim());

    window.close();
  });
});

const searchActiveIndex = () => {
  allItems.forEach((item, index) => {
    if (item.classList.contains("active")) {
      activeItemIndex = index;
    }
  });
};

const pasteToContentScript = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "paste", data: content });
  });
};
