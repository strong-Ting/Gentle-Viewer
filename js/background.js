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
