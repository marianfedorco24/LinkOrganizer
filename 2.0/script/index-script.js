const windowItemCont = document.getElementById("window-item-cont");
const newItemWindowIconWrapper = document.getElementById("new-item-window-icon-wrapper");
const newItemWindowColorWrapper = document.getElementById("new-item-window-color-wrapper");
const newItemWindowTitle = document.getElementById("new-item-window-title");
const newItemWindowInputName = document.getElementById("input-name");
const newItemWindowInputLink = document.getElementById("input-link");
const backdrop = document.getElementById("backdrop");
const newItemWindow = document.getElementById("new-item-window");
const colorCheck = document.getElementById("color-check");
const editPopup = document.getElementById("edit-popup");
const notLoggedInWindow = document.getElementById("not-logged-in-window");
const deleteItemWindow = document.getElementById("delete-item-window");
const noItemsDiv = document.getElementById("no-items-div");
const newItemWindowConfirmBtn = document.getElementById("new-item-window-confirm-btn");
const popup = document.getElementById("popup");
const popupText = document.getElementById("popup-text");
const popupIconUse = document.getElementById("popup-icon-use");
const popupIcon = document.getElementById("popup-icon");

const dirUpBtn = document.getElementById("dir-up-btn");

const svgNS = "http://www.w3.org/2000/svg";
const apiBaseUrl = "https://api.fedorco.dev/linkorganizer/";
const colors = {
    white: ["rgb(216, 216, 216)", "rgb(147, 147, 147)"],
    red: ["rgb(255, 128, 128)", "rgb(219, 87, 87)"],
    orange: ["rgb(255, 162, 128)", "rgb(215, 105, 66)"],
    yellow: ["rgb(255, 238, 153)", "rgb(189, 164, 40)"],
    green: ["rgb(179, 255, 153)", "rgb(78, 190, 39)"],
    blue: ["rgb(153, 238, 255)", "rgb(40, 164, 189)"],
    purple: ["rgb(170, 153, 255)", "rgb(127, 108, 224)"],
    pink: ["rgb(255, 153, 255)", "rgb(198, 83, 198)"],
};
const icons = [
    "default",
    "biology",
    "chemistry",
    "coding",
    "cooking",
    "geography",
    "history",
    "languages",
    "math",
    "physics",
    "socialstudies",
];
let itemState = {
    id: "",
    pid: "",
    type: "",
    icon: "",
    color: "",
    name: "",
    link: "",
};
let dirList = [];

backdrop.addEventListener("click", hideNewItemWindow);
document.addEventListener("click", e => {
    if (editPopup.style.display !== "none" && !editPopup.contains(e.target)) {
        editPopupHide();
    }
});

windowItemCont.addEventListener("click", e => {
    const moreButtonSvg = e.target.closest(".window-item-more-btn");
    if (moreButtonSvg) {
        e.stopPropagation();
        moreButtonFc(moreButtonSvg.parentNode);
        return;
    }
    if (e.target.closest("#edit-popup")) {
        e.stopPropagation();
        const button = e.target.closest(".edit-popup-icon").parentNode;
        if (button.dataset.buttontype == "edit") {
            const itemEl = e.target.closest(".window-item");
            Object.assign(itemState, itemEl.dataset);
            displayEditItemWindow();
        } else {
            const itemEl = e.target.closest(".window-item");
            Object.assign(itemState, itemEl.dataset);
            displayDeleteItemWindow();
        }
        return;
    }

    const itemEl = e.target.closest(".window-item");
    if (!itemEl) return;
    if (itemEl.dataset.type == "folder") {
        loadDir(itemEl.dataset.id);
    } else {
        window.open(itemEl.dataset.link, "_blank");
    }
});
newItemWindowIconWrapper.addEventListener("click", e => {
    const icon = e.target.closest(".new-item-window-icon");
    selectIcon(icon);
});
newItemWindowColorWrapper.addEventListener("click", e => {
    const color = e.target.closest(".new-item-window-color");
    selectColor(color);
});

function loadItem({iid, pid, type, icon, name, link, color}) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("window-item", "cursor-pointer", color);

    itemElement.dataset.id = String(iid);
    itemElement.dataset.type = type;
    if (type == "link") {
        itemElement.dataset.link = link;
    }
    itemElement.dataset.color = color;
    itemElement.dataset.name = name;
    itemElement.dataset.icon = icon;

    windowItemCont.appendChild(itemElement);

    const iconElement = document.createElementNS(svgNS, "svg");
    iconElement.classList.add("window-item-icon");
    itemElement.appendChild(iconElement);

    const useElement = document.createElementNS(svgNS, "use");
    useElement.setAttribute("href", "assets/icons/item-icons.svg#" + icon + "-" + type);
    iconElement.appendChild(useElement);

    const labelElement = document.createElement("span");
    labelElement.classList.add("window-item-text");
    labelElement.innerHTML = name;
    itemElement.appendChild(labelElement);

    const moreButtonBtnElement = document.createElement("button");
    moreButtonBtnElement.classList.add("btn-hide", "cursor-pointer-darken");
    itemElement.appendChild(moreButtonBtnElement);

    const moreButtonSvgElement = document.createElementNS(svgNS, "svg");
    moreButtonSvgElement.classList.add("window-item-more-btn");
    moreButtonBtnElement.appendChild(moreButtonSvgElement);

    const moreButtonUseElement = document.createElementNS(svgNS, "use");
    moreButtonUseElement.setAttribute("href", "assets/icons/ui-icons.svg#more");
    moreButtonSvgElement.appendChild(moreButtonUseElement);
}

function handleApiResponse(response) {
    if (response.display) {
        displayPopup(response.message, response.messagetype);
    }
    if (response.messagetype == "error") {
        console.error(response.message);
    }
    return response;
}

async function loadDir(pid) {
    dirList.push(pid);
    itemState.pid = pid;

    // dim the dir up button if it is the home dir (0)
    if (pid == 0) {
        dirUpBtn.classList.add("btn-disable");
    } else {
        dirUpBtn.classList.remove("btn-disable");
    }

    try {
        const response = await fetch(apiBaseUrl + `get-items?pid=${pid}`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = handleApiResponse(await response.json());
        if (response.status == 401) {
            displayLoginWindow();
            backdrop.style.pointerEvents = "none";
            return;
        }

        // clear the previous loaded items
        clearItems();

        // if dir empty, display the no items placeholder
        if (data.length == 0) {
            displayNoItemsPlaceholder();
        } else {
            hideNoItemsPlaceholder();
        }

        // go through each item and load it
        data.forEach(item => {
            loadItem(item);
        });
    } catch (error) {
        console.error("Data fetch failed:", error);
        displayPopup("A server error occured. Please contact the administrator.", "error");
    }
}

function loadIcons(type) {
    newItemWindowIconWrapper.innerHTML = "";

    icons.forEach(icon => {
        const iconSvg = document.createElementNS(svgNS, "svg");
        iconSvg.classList.add("new-item-window-icon", "cursor-pointer-darken");
        iconSvg.setAttribute("id", "new-item-window-" + icon + "-" + type + "-icon");
        newItemWindowIconWrapper.appendChild(iconSvg);

        const itemUse = document.createElementNS(svgNS, "use");
        itemUse.setAttribute("href", "assets/icons/item-icons.svg#" + icon + "-" + type);
        iconSvg.appendChild(itemUse);
    });
}

function loadColors() {
    for (const color in colors) {
        const colorDiv = document.createElement("div");
        colorDiv.id = "new-item-window-color-" + color;
        colorDiv.style.backgroundColor = colors[color][0];
        colorDiv.style.borderColor = colors[color][1];
        colorDiv.classList.add("new-item-window-color", "cursor-pointer-darken");
        newItemWindowColorWrapper.appendChild(colorDiv);
    }
    selectColor();
}

function displayNewItemWindow(type) {
    newItemWindowConfirmBtn.innerHTML = "Create";
    newItemWindowConfirmBtn.setAttribute("onclick", "createNewItem()");
    itemState.type = type;
    loadIcons(type);
    selectIcon();
    newItemWindowTitle.innerHTML = "New " + type;
    if (type == "folder") {
        newItemWindowInputLink.classList.add("hide");
    } else {
        newItemWindowInputLink.classList.remove("hide");
    }
    backdrop.classList.remove("hide");
    newItemWindow.classList.remove("hide");
    requestAnimationFrame(() => {
        newItemWindow.classList.add("transition-fade");
    });
}

function hideNewItemWindow() {
    newItemWindowInputName.value = "";
    newItemWindowInputLink.value = "";
    backdrop.classList.add("hide");
    newItemWindow.classList.remove("transition-fade");
    requestAnimationFrame(() => {
        newItemWindow.classList.add("hide");
    });
    selectColor();
}

function selectIcon(targetOrEvent) {
    [...newItemWindowIconWrapper.children].forEach(icon => {
        icon.classList.remove("new-item-window-icon-selected");
    });
    if (!targetOrEvent) {
        newItemWindowIconWrapper.firstChild.classList.add("new-item-window-icon-selected");
        itemState.icon = "default";
    } else {
        targetOrEvent.classList.add("new-item-window-icon-selected");
        itemState.icon = targetOrEvent.id.split("-")[3];
    }
}

function selectColor(targetOrEvent) {
    let colorDiv;
    if (!targetOrEvent) {
        colorDiv = newItemWindowColorWrapper.firstChild; // default
        itemState.color = "white";
    } else {
        colorDiv = targetOrEvent; // direct element passed in
        itemState.color = targetOrEvent.id.split("-")[4];
    }
    colorCheck.classList.remove("hide");
    colorDiv.appendChild(colorCheck);
    colorCheck.style.fill = colorDiv.style.borderColor;
}

function moreButtonFc(button) {
    editPopupHide();
    editPopup.classList.remove("hide");
    const item = button.parentNode;
    const color = item.classList[2];

    button.classList.add("hide");
    item.appendChild(editPopup);

    editPopup.children[1].style.backgroundColor = colors[color][1];
    editPopup.children[1].style.opacity = "0.5";

    editPopup.style.backgroundColor = colors[color][0].replace("rgb", "rgba").replace(")", ", 0.5");
}

function editPopupHide() {
    const items = [...document.querySelectorAll(".window-item")];
    if (items) {
        items.forEach(i => {
            i.children[2].classList.remove("hide");
        });
    }
    newItemWindow.appendChild(editPopup);
    editPopup.classList.add("hide");
}

function displayEditItemWindow() {
    newItemWindowConfirmBtn.innerHTML = "Confirm";
    newItemWindowConfirmBtn.setAttribute("onclick", "editItem()");
    newItemWindowTitle.innerHTML = "Edit a " + itemState.type;
    newItemWindowInputName.value = itemState.name;
    if (itemState.type == "folder") {
        newItemWindowInputLink.classList.add("hide");
    } else {
        newItemWindowInputLink.classList.remove("hide");
        newItemWindowInputLink.value = itemState.link;
    }
    loadIcons(itemState.type);
    selectIcon(
        [...newItemWindowIconWrapper.children].find(item => item.id.includes(itemState.icon)),
    );
    selectColor(
        [...newItemWindowColorWrapper.children].find(item => item.id.includes(itemState.color)),
    );

    backdrop.classList.remove("hide");
    newItemWindow.classList.remove("hide");
    requestAnimationFrame(() => {
        newItemWindow.classList.add("transition-fade");
    });
}

function displayLoginWindow() {
    backdrop.classList.remove("hide");
    notLoggedInWindow.classList.remove("hide");
}

function displayDeleteItemWindow() {
    backdrop.classList.remove("hide");
    deleteItemWindow.classList.remove("hide");
    requestAnimationFrame(() => {
        deleteItemWindow.classList.add("transition-fade");
    });
}

function hideDeleteItemWindow() {
    backdrop.classList.add("hide");
    deleteItemWindow.classList.add("hide");
}

function clearItems() {
    const items = document.querySelectorAll(".window-item");
    items.forEach(item => item.remove());
}

function displayNoItemsPlaceholder() {
    noItemsDiv.classList.remove("hide");
}

function hideNoItemsPlaceholder() {
    noItemsDiv.classList.add("hide");
}

async function createNewItem() {
    try {
        const data = {
            name: newItemWindowInputName.value.trim(),
            link: newItemWindowInputLink.value.trim(),
            type: itemState.type,
            pid: itemState.pid,
            color: itemState.color,
            icon: itemState.icon,
        };
        const request = await fetch(apiBaseUrl + "add-item", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const response = handleApiResponse(await request.json());
        if (response.messagetype == "success") {
            hideNewItemWindow();
            loadDir(itemState.pid);
        }
    } catch (error) {
        console.error("Item creation failed:", error);
        displayPopup("A server error occured. Please contact the administrator.", "error");
    }
}

function dirUp() {
    dirList.pop();
    loadDir(dirList.at(-1));
    dirList.pop();
}

function dirHome() {
    dirList = [];
    loadDir(0);
}

async function editItem() {
    try {
        const data = {
            name: newItemWindowInputName.value.trim(),
            link: newItemWindowInputLink.value.trim(),
            type: itemState.type,
            color: itemState.color,
            icon: itemState.icon,
        };
        const request = await fetch(apiBaseUrl + "edit-item?iid=" + itemState.id, {
            method: "PATCH",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const response = handleApiResponse(await request.json());
        if (response.messagetype == "success") {
            hideNewItemWindow();
            loadDir(dirList.at(-1));
        }
    } catch (error) {
        console.error("Item edit failed:", error);
        displayPopup("A server error occured. Please contact the administrator.", "error");
    }
}

async function deleteItem() {
    try {
        const request = await fetch(apiBaseUrl + "delete-item?iid=" + itemState.id, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = handleApiResponse(await request.json());
        if (response.messagetype == "success") {
            hideDeleteItemWindow();
            loadDir(dirList.at(-1));
        }
    } catch (error) {
        console.error("Item deletion failed:", error);
        displayPopup("A server error occured. Please contact the administrator.", "error");
    }
}

function sleep(s) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}

async function displayPopup(text, type) {
    hidePopupInstant();
    popupText.innerHTML = text;
    if (type == "success") {
        popupIconUse.setAttribute("href", "assets/icons/ui-icons.svg#success");
        popupIcon.classList.remove("popup-icon-red");
        popupIcon.classList.add("popup-icon-green");
    } else {
        popupIconUse.setAttribute("href", "assets/icons/ui-icons.svg#error");
        popupIcon.classList.remove("popup-icon-green");
        popupIcon.classList.add("popup-icon-red");
    }
    popup.classList.add("popup-show");
    await sleep(3);
    popup.classList.remove("popup-show");
}
function hidePopupInstant() {
    popup.style.transition = "none"; // disable animation
    popup.classList.remove("popup-show"); // jump to end state
    popup.offsetHeight; // force browser reflow
    popup.style.transition = ""; // re-enable for future use
}

function redirectFedorcodevLogin() {
    document.cookie = "redirect=linkorganizer; domain=.fedorco.dev; path=/; max-age=90";
    window.location.href = "https://fedorco.dev/login";
}

loadColors();
loadDir(0);
