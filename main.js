let channelName = document.querySelector('#name')
let subsDiv = document.querySelector('.subs')
let joinChannelBtn = document.querySelector('.join')


let addSubsBox = () => {
    addSubBox()
}

let removeSubsBox = () => {
    quitChannel()
}

let joinChannel = () => {
    chrome.storage.sync.get("joined", async (data) => {
        console.log(data)
        if (data.joined == true) {
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.storage.sync.set({ joined: false })
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: removeSubsBox,
            });
            joinChannelBtn.classList.remove("pressed")
        }
        else {
            let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            chrome.storage.sync.set({ joined: true })
            chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: addSubsBox,
            });
            joinChannelBtn.classList.add("pressed")
        }
    })
}

let init = () => {
    chrome.storage.sync.get("joined", async (data) => {
        if (data.joined == true) {
            joinChannelBtn.classList.add("pressed")
        }
        else {
            joinChannelBtn.classList.remove("pressed")
        }
    })
}

init()

joinChannelBtn.addEventListener('click', joinChannel)