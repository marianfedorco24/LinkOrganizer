const windowItemCont = document.getElementById("window-item-cont");

const svgNS = "http://www.w3.org/2000/svg";

function addItem({id, pid, uid, type, icon, name, link, color}) {
    const itemElement = document.createElement("div");
    itemElement.classList.add("window-item", color);
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
    moreButtonBtnElement.classList.add("btn-hide");
    itemElement.appendChild(moreButtonBtnElement);

    const moreButtonSvgElement = document.createElementNS(svgNS, "svg");
    moreButtonSvgElement.classList.add("window-item-more-btn");
    moreButtonBtnElement.appendChild(moreButtonSvgElement);

    const moreButtonUseElement = document.createElementNS(svgNS, "use");
    moreButtonUseElement.setAttribute("href", "assets/icons/ui-icons.svg#more");
    moreButtonSvgElement.appendChild(moreButtonUseElement);

    if (type == "folder") {
        useElement.setAttribute("href", "assets/icons/folder-icons.svg#" + icon);
    } else {
        useElement.setAttribute("href", "assets/icons/link-icons.svg#" + icon);
        itemElement.addEventListener("click", () => {
            window.open(link, "_blank");
        });
    }
}
