var lock = false; // so we don't trigger dontAnnoyMe() as we manipulate the dom in dontAnnoyMe()

var facebookStoryClass = ".fbUserStory";
var dontAnnoyMe = function(regex) {
    if (lock) {
        return;
    }
    lock = true;
    jQuery(facebookStoryClass + ":not(.dontannoyme)")
        .filter(function() {
            if (jQuery(this).closest(facebookStoryClass + ".dontannoyme").length > 0) {
                return false;
            }
            var matches = regex.exec(this.textContent);
            if (matches !== null) {
                var matchingString = matches.join(", ");
                var story = jQuery(this);
                story.addClass("dontannoyme");
                story.parent().addClass("dontannoyme");
                story.parent().hide();

                return true;
            }
            return false;
        })
        .addClass("dontannoyme");
    lock = false;
}

function makeRegex(blacklist) {
    var bannedWords = blacklist.split(/,\s*/); // comma-separated, optional whitespace
    // only match on word boundaries
    bannedWords = bannedWords.map(function(word) { return "\\b" + escape(word) + "\\b"; });
    return new RegExp(bannedWords.join("|"), "i");
}

function escape(str) {
    // source: http://stackoverflow.com/questions/3561493/is-there-a-regexp-escape-function-in-javascript/3561711#3561711
    return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

chrome.storage.sync.get("dontannoyme_blacklist", function(response) {
    var blacklist = response["dontannoyme_blacklist"];
    if (!blacklist) {
        if (window.confirm("'Don't Annoy Me!' won't do anything unless you " +
                "set up a list of words to ban." +
                "\nDo that now?")) {
            window.open(chrome.extension.getURL("options.html"));
        }
    } else {
        var regex = makeRegex(blacklist);
        document.addEventListener("DOMNodeInserted", function() {
            // this runs pretty slow-- it'd be better to hook into whatever event Facebook
            // uses to trigger loading additional content, I think.
            dontAnnoyMe(regex);
        });
        dontAnnoyMe(regex);
    }
});
