const windowItemCont = document.getElementById("window-item-cont");
const newItemWindowIconWrapper = document.getElementById("new-item-window-icon-wrapper");
const newItemWindowTitle = document.getElementById("new-item-window-title");
const newItemWindowInputName = document.getElementById("input-name");
const newItemWindowInputLink = document.getElementById("input-link");
const backdrop = document.getElementById("backdrop");
const newItemWindow = document.getElementById("new-item-window");

const svgNS = "http://www.w3.org/2000/svg";

backdrop.addEventListener("click", hideNewItemWindow);

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

function moreButtonFc(e) {
    e.stopPropagation();
    console.log("test");
}

loadDir(null);
