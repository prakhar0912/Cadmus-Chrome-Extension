let channelName = document.querySelector('#name')
let subsDiv = document.querySelector('.subs')
let joinChannelBtn = document.querySelector('.join')


let addSubsBox = () => {
    join()
}

let removeSubsBox = () => {
    quitChannel()
}




let joinChannel = () => {
    chrome.storage.sync.get("joined", async (data) => {
        console.log(data)
        console.log(channelName.value)
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.storage.sync.set({ joined: !data.joined })
        chrome.storage.sync.set({ channelName: data.joined ? '' : channelName.value })

        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: data.joined ? removeSubsBox : addSubsBox,
        });
        data.joined ? joinChannelBtn.classList.remove("pressed") : joinChannelBtn.classList.add("pressed")
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