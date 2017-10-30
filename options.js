function save() {
    var blacklist = document.getElementById("blacklist").value;
    status.innerHTML = "Saving...";
    chrome.storage.sync.set({"dontannoyme_blacklist": blacklist}, function() {

        var status = document.getElementById("status");
        status.innerHTML = "Options Saved.";
        setTimeout(function() {
            status.innerHTML = "";
        }, 750);
    });
}

function restore() {
    chrome.storage.sync.get("dontannoyme_blacklist", function(response) {
        var blacklist = response["dontannoyme_blacklist"];
        if (!blacklist) {
            blacklist = getSampleBlacklist();
        }
        document.getElementById("blacklist").value = blacklist;
    });
}

function getSampleBlacklist() {
    var sampleBlacklist = [
       "tag that friend",
       "playboy",
       "rosemilk" 
    ];
    return sampleBlacklist.join(", ");
}

document.addEventListener("DOMContentLoaded", function() {
    restore();
    document.getElementById("save").addEventListener('click', save);
});
