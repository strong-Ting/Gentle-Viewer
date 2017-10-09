var toggle = true;

chrome.storage.onChanged.addListener(function(changes, area) {
    if(changes.status.newValue == "true")
    { 
    chrome.browserAction.setTitle({title:'script on'});
    chrome.browserAction.setIcon({path: "icons/on.png"});
    }
    else
    {
    chrome.browserAction.setTitle({title:'script off'});
    chrome.browserAction.setIcon({path: "icons/off.png"});
    }    
});

chrome.browserAction.onClicked.addListener(function(tab) {

  toggle = !toggle;
  if(toggle){
    //chrome.browserAction.setIcon({path: "icons/on.png", tabId:tab.id});

//    chrome.browserAction.setTitle({title:'script on'});
    chrome.storage.sync.set({"status":"true"});
 }
  else{
//    chrome.browserAction.setIcon({path: "icons/off.png", tabId:tab.id});

//    chrome.browserAction.setTitle({title:'script off'});
    chrome.storage.sync.set({"status":"false"});
      }
});
/*
function downloads(url,filename){
    var isdownloads = null;
    var downloadOptions = {
        "url" : url,
        "saveAs":false,
        "filename":filename
    };
    chrome.downloads.download(downloadOptions,function(downloadId) {
        
        if(chrome.runtime.lastError) {
            console.warn("Whoops.. " + chrome.runtime.lastError.message);
            isdownloads = false;
        } else {
            isdownloads = true;
        }
    });
    return isdownloads;
}
*/
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {  
    if(message.url !== undefined && message.filename !== undefined)
    {
        var downloadOptions = {
            "url" : message.url,
            "saveAs":false,
            "filename":message.filename
        };
        chrome.downloads.download(downloadOptions,function(downloadId) {
            var isdownloads =null;
            if(chrome.runtime.lastError) {
                console.warn("Whoops.. " + chrome.runtime.lastError.message);
                isdownloads = false;
            } else {
                isdownloads = true;
            }
        });

        sendResponse("download:  "+{content: message.filename});  
   
    }
/*
 chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
    var name = message.filename.substring(0,19);
    suggest({
        filename: name+"/"+item.filename,
        conflictAction: 'overwrite',
        conflict_action: 'overwrite'
    });

}); 
*/  
});


/*
chrome.tabs.create({
    url: 'https://exhentai.org/g/1126032/f9c510e136/'
}, function(tab) {
    chrome.tabs.onUpdated.addListener(function func(tabId, changeInfo) {
        if (tabId == tab.id && changeInfo.status == 'complete') {
            chrome.tabs.onUpdated.removeListener(func);
            savePage(tabId);
        }
    });
});

function savePage(tabId) {
    chrome.pageCapture.saveAsMHTML({
        tabId: tabId
    }, function(blob) {
        var url = URL.createObjectURL(blob);
        // Optional: chrome.tabs.remove(tabId); // to close the tab
        chrome.downloads.download({
            url: url,
            filename: 'whatever.mhtml'
        });
    });
}*/
