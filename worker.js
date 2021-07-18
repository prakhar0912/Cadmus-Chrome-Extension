let style, div, inter


let addSubBox = () => {

    style = document.createElement('style');
    style.innerHTML = `
    .injected {
        position: absolute;
        z-index: 1000;
        background-color: #f1f1f1;
        border-radius: 20px;
        cursor: move;
        height: 150px;
        width: 40%;
        overflow: auto;
        overflow-x: hidden;
        word-wrap: break-word;
        overflow-wrap: break-word;
        padding: 30px;
        opacity: 0.6;
        box-shadow: inset 6px 6px 10px 0 rgba(0, 0, 0, 0.2), inset -6px -6px 10px 0 rgba(255, 255, 255, 0.5);
        font-size: 24px;
    }
    `;
    document.head.appendChild(style);


    div = document.createElement("div")
    div.classList.add("injected")
    document.body.appendChild(div)



    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

    let dragMouseDown = (e) => {

        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }

    let elementDrag = (e) => {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        div.style.top = (div.offsetTop - pos2) + "px";
        div.style.left = (div.offsetLeft - pos1) + "px";
    }

    let closeDragElement = () => {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }


    div.onmousedown = dragMouseDown;

    FetchWord()



}

let FetchWord = () => {
    let str = ['So ', 'this ', 'is ', 'all ', 'i ', 'can ', 'do ', 'for ', 'now ', 'so ', 'come ', 'on ', 'man ', 'this ', 'is ', 'all ', 'i ', 'can ', 'do ', 'for ', 'now ', 'so ', 'come ', 'on ', 'man ', 'this ', 'is ', 'all ', 'i ', 'can ', 'do']
    let i = 0
    inter = setInterval(() => {
        addWordMeet(str[i++])
        if (i >= str.length) { i = 0 }
    }, 500)
}

let addWordMeet = (word) => {
    let span = document.createElement('span')
    span.innerText = word
    div.appendChild(span)
}

let closeDragElement = () => {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
}

let quitChannel = () => {
    try {
        div.remove()
        style.remove()
        closeDragElement()
        clearInterval(inter)
    }
    catch{
        console.log('asrtra')
    }
}