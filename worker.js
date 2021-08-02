let style, div
let socket
let channelName




let join = () => {
    chrome.storage.sync.get(['channelName'], function (result) {
        channelName = result.channelName
        socketConnect()
    });
}

let socketConnect = () => {
    console.log('Channel Name: ' + channelName)
    try {
        socket = io('https://cadmus-server.herokuapp.com/')

        socket.on('connect', () => {
            console.log('connected!')
            addSubBox()
            console.log(socket.id)
            socket.emit('join', { room: channelName })
            socket.on('msg', (msg) => {
                console.log(msg)
                addWord(msg.msg)
            })
            chrome.runtime.sendMessage({ success: "Joined" });
        });
        setTimeout(() => {
            if(socket.disconnected){
                chrome.runtime.sendMessage({ error: "Cannot Join!" });
                socket.disconnect()
            }
        }, 3000)
    }
    catch (e) {
        chrome.runtime.sendMessage({ error: "Cannot Join!" });
        socket.disconnect()
    }
}


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




}

let addWord = (word) => {
    let span = document.createElement('span')
    span.innerText = word + " "
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
        socket.disconnect()
        chrome.runtime.sendMessage({ leave: "Left" })
    }
    catch {
        chrome.runtime.sendMessage({ error: "Error: Cannot Leave! <a id='force'>Force Leave</a>", spc: true })
    }
}