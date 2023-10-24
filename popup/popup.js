document.addEventListener("DOMContentLoaded", () => {
  let listGroup = document.querySelector(".list-group");
  let allItems, allContent, activeItemIndex;

  chrome.storage.local.get(["copiedValues"]).then((result) => {
    for (let i = 0; i < result.copiedValues.length; i++) {
      let listItem = document.createElement("a");
      listItem.setAttribute("href", "#");
      listItem.setAttribute("data-bs-toggle", "list");
      listItem.className = "list-group-item list-group-item-action";
      let listItemHtml = `
        <div class="row">
          <div class="col text-truncate content">${result.copiedValues[i]}</div>
          <div class="col-auto" style="border-width: 1px; border-radius: 3px; 
          border-style: solid;">${i}</div>
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
    activeItemIndex = searchActiveIndex(allItems);

    if (event.key == "Enter") {
      pasteToContentScript(allContent[activeItemIndex].innerText.trim());
      window.close();
    } else if (
      event.key === "ArrowDown" &&
      activeItemIndex < allContent.length - 1
    ) {
      allItems[activeItemIndex].classList.remove("active");
      allItems[activeItemIndex + 1].classList.add("active");
    } else if (event.key === "ArrowUp" && activeItemIndex > 0) {
      allItems[activeItemIndex].classList.remove("active");
      allItems[activeItemIndex - 1].classList.add("active");
    } else if (Array.from("0123456789").includes(event.key)) {
      pasteToContentScript(allContent[event.key].innerText.trim());
      window.close();
    }
  });

  listGroup.addEventListener("click", () => {
    activeItemIndex = searchActiveIndex(allItems);
    pasteToContentScript(allContent[activeItemIndex].innerText.trim());
    window.close();
  });
});

const searchActiveIndex = (items) => {
  for (let i = 0; i < items.length; i++) {
    if (items[i].classList.contains("active")) {
      return i;
    }
  }
};

const pasteToContentScript = (content) => {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { message: "paste", data: content });
  });
};
