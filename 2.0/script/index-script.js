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

const svgNS = "http://www.w3.org/2000/svg";
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
let currentEditId;

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
            const {id, type, icon, name, link, color} = itemEl.dataset;
            currentEditId = id;
            displayEditItemWindow(name, type, icon, color, link);
        } else {
            console.log("delete");
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

function loadItem({id, pid, type, icon, name, link, color}) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("window-item", "cursor-pointer", color);

    itemElement.dataset.id = String(id);
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
    if (type == "folder") {
        useElement.setAttribute("href", "assets/icons/item-icons.svg#" + icon);
    } else {
        useElement.setAttribute("href", "assets/icons/item-icons.svg#" + icon);
    }
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

function loadDir(id) {
    console.log("loading the dir: ", id);
    // here enter the fetch of the DB
    //
    // until here

    const testData = [
        {
            id: 1,
            pid: 0,
            uid: 101,
            type: "folder",
            icon: "math-folder",
            name: "Math",
            link: null,
            color: "blue",
        },
        {
            id: 2,
            pid: 1,
            uid: 101,
            type: "link",
            icon: "math-link",
            name: "Algebra Notes",
            link: "https://example.com/algebra.pdf",
            color: "green",
        },
        {
            id: 3,
            pid: 0,
            uid: 101,
            type: "folder",
            icon: "biology-folder",
            name: "Biology stupidly long name don pollo salsa y pikante",
            link: null,
            color: "yellow",
        },
        {
            id: 4,
            pid: 3,
            uid: 101,
            type: "link",
            icon: "biology-link",
            name: "Cell Structure",
            link: "https://example.com/cell-structure",
            color: "red",
        },
        {
            id: 5,
            pid: 0,
            uid: 101,
            type: "folder",
            icon: "history-folder",
            name: "History",
            link: null,
            color: "purple",
        },
        {
            id: 6,
            pid: 5,
            uid: 101,
            type: "link",
            icon: "history-link",
            name: "World War II",
            link: "https://example.com/ww2-article",
            color: "orange",
        },
        {
            id: 7,
            pid: 0,
            uid: 101,
            type: "folder",
            icon: "coding-folder",
            name: "Coding",
            link: null,
            color: "pink",
        },
        {
            id: 8,
            pid: 7,
            uid: 101,
            type: "link",
            icon: "coding-link",
            name: "MDN JavaScript",
            link: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            color: "blue",
        },
        {
            id: 9,
            pid: 0,
            uid: 101,
            type: "folder",
            icon: "physics-folder",
            name: "Physics",
            link: null,
            color: "green",
        },
        {
            id: 10,
            pid: 9,
            uid: 101,
            type: "link",
            icon: "physics-link",
            name: "Kinematics",
            link: "https://example.com/kinematics",
            color: "red",
        },
    ];

    // clear the previous loaded items
    windowItemCont.innerHTML = "";

    // go through each item and load it
    testData.forEach(item => {
        loadItem(item);
    });
}

function loadIcons(type) {
    newItemWindowIconWrapper.innerHTML = "";

    const icons = [
        "",
        "biology-",
        "chemistry-",
        "coding-",
        "cooking-",
        "geography-",
        "history-",
        "languages-",
        "math-",
        "physics-",
        "social-studies-",
    ];

    icons.forEach(icon => {
        const iconSvg = document.createElementNS(svgNS, "svg");
        iconSvg.classList.add("new-item-window-icon", "cursor-pointer-darken");
        iconSvg.setAttribute("id", "new-item-window-" + icon + type + "-icon");
        iconSvg.addEventListener("click", selectIcon);
        newItemWindowIconWrapper.appendChild(iconSvg);

        const itemUse = document.createElementNS(svgNS, "use");
        itemUse.setAttribute("href", "assets/icons/item-icons.svg#" + icon + type);
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
        colorDiv.addEventListener("click", e => {
            selectColor(e);
        });
        newItemWindowColorWrapper.appendChild(colorDiv);
    }
    selectColor();
}

function displayNewItemWindow(type) {
    newItemWindowTitle.innerHTML = "New " + type;
    if (type == "folder") {
        newItemWindowInputLink.classList.add("hide");
    } else {
        newItemWindowInputLink.classList.remove("hide");
    }
    loadIcons(type);
    selectIcon();
    backdrop.classList.remove("hide");
    newItemWindow.classList.remove("hide");
}

function hideNewItemWindow() {
    newItemWindowInputName.value = "";
    newItemWindowInputLink.value = "";
    backdrop.classList.add("hide");
    newItemWindow.classList.add("hide");
    selectColor();
}

function selectIcon(targetOrEvent) {
    [...newItemWindowIconWrapper.children].forEach(icon => {
        icon.classList.remove("new-item-window-icon-selected");
    });
    if (!targetOrEvent) {
        newItemWindowIconWrapper.firstChild.classList.add("new-item-window-icon-selected");
    } else if (targetOrEvent.currentTarget) {
        targetOrEvent.currentTarget.classList.add("new-item-window-icon-selected");
    } else {
        targetOrEvent.classList.add("new-item-window-icon-selected");
    }
}

function selectColor(targetOrEvent) {
    let colorDiv;
    if (!targetOrEvent) {
        colorDiv = newItemWindowColorWrapper.firstChild; // default
    } else if (targetOrEvent.currentTarget) {
        colorDiv = targetOrEvent.currentTarget; // called from click handler
    } else {
        colorDiv = targetOrEvent; // direct element passed in
    }
    colorDiv.appendChild(colorCheck);
    colorCheck.style.fill = colorDiv.style.borderColor;
}

function moreButtonFc(button) {
    editPopupHide();
    editPopup.style.display = "flex";
    const item = button.parentNode;
    const color = item.classList[2];

    button.style.display = "none";
    item.appendChild(editPopup);

    editPopup.children[1].style.backgroundColor = colors[color][1];
    editPopup.children[1].style.opacity = "0.5";

    editPopup.style.backgroundColor = colors[color][0].replace("rgb", "rgba").replace(")", ", 0.5");
}

function editPopupHide() {
    [...windowItemCont.children].forEach(i => {
        i.children[2].style.display = "block";
    });
    newItemWindow.appendChild(editPopup);
    editPopup.style.display = "none";
}

function displayEditItemWindow(name, type, icon, color, link) {
    newItemWindowTitle.innerHTML = "Edit a " + type;
    newItemWindowInputName.value = name;
    if (type == "folder") {
        newItemWindowInputLink.classList.add("hide");
    } else {
        newItemWindowInputLink.classList.remove("hide");
        newItemWindowInputLink.value = link;
    }
    loadIcons(type);
    selectIcon([...newItemWindowIconWrapper.children].find(item => item.id.includes(icon)));
    selectColor([...newItemWindowColorWrapper.children].find(item => item.id.includes(color)));

    backdrop.classList.remove("hide");
    newItemWindow.classList.remove("hide");
}

editPopupHide();
loadColors();
loadDir();
