let channelName = document.querySelector('#name')
let errDiv = document.querySelector('.err')
let joinChannelBtn = document.querySelector('.join')

let addSubsBox = () => {
    join()
}

let removeSubsBox = () => {
    quitChannel()
}

let force = () => {
    chrome.storage.sync.set({ joined: false })
    joinChannelBtn.classList.remove("pressed")
    chrome.storage.sync.set({ channelName: '' })
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    if (request.success) {
        chrome.storage.sync.set({ joined: true })
        joinChannelBtn.classList.add("pressed")
    }
    else if (request.leave) {
        chrome.storage.sync.set({ joined: false })
        joinChannelBtn.classList.remove("pressed")
        chrome.storage.sync.set({ channelName: '' })
    }
    else if (request.error) {
        errDiv.innerHTML = ""
        errDiv.innerHTML = request.error
        if(request.spc){
            document.querySelector('#force').addEventListener('click', force)
        }
    }
}
);


let joinChannel = () => {
    errDiv.innerHTML = ""
    chrome.storage.sync.get("joined", async (data) => {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        !data.joined && chrome.storage.sync.set({ channelName: channelName.value })

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: data.joined ? removeSubsBox : addSubsBox,
        });

    })
}

let init = () => {
    chrome.storage.sync.get("joined", async (data) => {
        chrome.storage.sync.get('channelName', function (result) {
            if (data.joined == true) {
                channelName.value = result.channelName
                joinChannelBtn.classList.add("pressed")
            }
            else {
                joinChannelBtn.classList.remove("pressed")
            }
        });
    })
}

init()

joinChannelBtn.addEventListener('click', joinChannel)