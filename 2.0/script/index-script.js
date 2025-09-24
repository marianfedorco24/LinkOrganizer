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

backdrop.addEventListener("click", hideNewItemWindow);
document.addEventListener("click", e => {
    if (editPopup.style.display !== "none" && !editPopup.contains(e.target)) {
        editPopupHide();
    }
});
editPopup.addEventListener("click", e => {
    e.stopPropagation();
});

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

function loadItem({id, pid, type, icon, name, link, color}) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("window-item", "cursor-pointer", color);
    windowItemCont.appendChild(itemElement);

    const iconElement = document.createElementNS(svgNS, "svg");
    iconElement.classList.add("window-item-icon");
    itemElement.appendChild(iconElement);

    const useElement = document.createElementNS(svgNS, "use");
    iconElement.appendChild(useElement);

    const labelElement = document.createElement("span");
    labelElement.classList.add("window-item-text");
    labelElement.innerHTML = name;
    itemElement.appendChild(labelElement);

    const moreButtonBtnElement = document.createElement("button");
    moreButtonBtnElement.classList.add("btn-hide", "cursor-pointer-darken");
    moreButtonBtnElement.addEventListener("click", moreButtonFc);
    itemElement.appendChild(moreButtonBtnElement);

    const moreButtonSvgElement = document.createElementNS(svgNS, "svg");
    moreButtonSvgElement.classList.add("window-item-more-btn");
    moreButtonBtnElement.appendChild(moreButtonSvgElement);

    const moreButtonUseElement = document.createElementNS(svgNS, "use");
    moreButtonUseElement.setAttribute("href", "assets/icons/ui-icons.svg#more");
    moreButtonSvgElement.appendChild(moreButtonUseElement);

    if (type == "folder") {
        useElement.setAttribute("href", "assets/icons/item-icons.svg#" + icon);
        itemElement.addEventListener("click", () => {
            loadDir(id);
        });
    } else {
        useElement.setAttribute("href", "assets/icons/link-icons.svg#" + icon);
        itemElement.addEventListener("click", () => {
            window.open(link, "_blank");
        });
    }
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
            icon: "math-link",
            name: "Projects",
            link: null,
            color: "blue",
        },
        {
            id: 2,
            pid: 1,
            uid: 101,
            type: "link",
            icon: "history-link",
            name: "GitHub",
            link: "https://github.com",
            color: "red",
        },
        {
            id: 3,
            pid: 1,
            uid: 101,
            type: "link",
            icon: "file-doc",
            name: "Docs",
            link: "https://developer.mozilla.org",
            color: "green",
        },
        {
            id: 4,
            pid: 0,
            uid: 101,
            type: "folder",
            icon: "biology-folder",
            name: "School",
            link: null,
            color: "yellow",
        },
        {
            id: 5,
            pid: 4,
            uid: 101,
            type: "link",
            icon: "file-pdf",
            name: "Math PDF",
            link: "https://example.com/math.pdf",
            color: "red",
        },
        {
            id: 4,
            pid: 0,
            uid: 101,
            type: "folder",
            icon: "biology-folder",
            name: "School",
            link: null,
            color: "yellow",
        },
        {
            id: 5,
            pid: 4,
            uid: 101,
            type: "link",
            icon: "file-pdf",
            name: "Math PDF",
            link: "https://example.com/math.pdf",
            color: "red",
        },
        {
            id: 4,
            pid: 0,
            uid: 101,
            type: "folder",
            icon: "biology-folder",
            name: "School",
            link: null,
            color: "yellow",
        },
        {
            id: 5,
            pid: 4,
            uid: 101,
            type: "link",
            icon: "file-pdf",
            name: "Math PDF",
            link: "https://example.com/math.pdf",
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
        colorDiv.classList.add("new-item-window-color");
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

function selectIcon(e) {
    [...newItemWindowIconWrapper.children].forEach(icon => {
        icon.classList.remove("new-item-window-icon-selected");
    });
    if (!e) {
        newItemWindowIconWrapper.firstChild.classList.add("new-item-window-icon-selected");
    } else {
        e.currentTarget.classList.add("new-item-window-icon-selected");
    }
}

function selectColor(e) {
    let colorDiv;
    if (!e) {
        colorDiv = newItemWindowColorWrapper.firstChild;
    } else {
        colorDiv = e.currentTarget;
    }
    colorDiv.appendChild(colorCheck);
    colorCheck.style.fill = colorDiv.style.borderColor;
}

function moreButtonFc(e) {
    e.stopPropagation();
    editPopupHide();
    editPopup.style.display = "flex";
    const button = e.currentTarget;
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

editPopupHide();

loadColors();

loadDir(null);
