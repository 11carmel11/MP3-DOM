//sorting the player for later, saves headache...
player.songs.sort(compareTitle);
player.playlists.sort(compareName);
//Plays a song from the player.
//Playing a song means changing the visual indication of the currently playing song.
function playSong(songId) {
    alert("You are playing song number " + songId);
}

/**
 * Removes a song from the player, and updates the DOM to match.
 *
 * @param {Number} songId - the ID of the song to remove
 */
function removeSong(songId) {
    // Your code here
}

/**
 * Adds a song to the player, and updates the DOM to match.
 */
function addSong({ title, album, artist, duration, coverArt }) {
    // Your code here
}

/**
 * Acts on a click event on an element inside the songs list.
 * Should handle clicks on play buttons and remove buttons of songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleSongClickEvent(event) {
    // Your code here
}

/**
 * Handles a click event on the button that adds songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleAddSongEvent(event) {
    // Your code here
}

//Creates a song DOM element based on a song object.
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const img = createElement("img", [], [], { src: coverArt, alt: "album cover" });
    const infoDiv = createElement("div", [
        createElement("p", [], [], {}, `Title: ${title}`),
        createElement("p", [], [], {}, `Album: ${album}`),
        createElement("p", [], [], {}, `Artist: ${artist}`),
        createElement("p", [], [setClass(duration)], {}, `Duration: ${mmssFormat(duration)}`),
    ]);
    const children = [infoDiv, img];
    const classes = ["songs"];
    const attrs = { onclick: `playSong(${id})` };
    const text = null;
    const eventListeners = {'click': handleSongClickEvent};
    return createElement("div", children, classes, attrs, text, eventListeners)
}

//Creates a playlist DOM element based on a playlist object.
function createPlaylistElement({ id, name, songs }) {
    const children = [
        createElement("p", [], [], {}, `name: ${name}`),
        createElement("p", [], [], {}, `${songs.length} songs inside,`),
        createElement("p", [], [], {}, `${mmssFormat(playlistDuration(id))}`),]
    const classes = ["playlists"]
    const attrs = {}
    const text = null;
    const eventListeners = {}
    return createElement("div", children, classes, attrs, text, eventListeners)
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"}, {click: (...) => {...}})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 * @param {Object} eventListeners - the event listeners on the element
 */
function createElement(tagName, children = [], classes = [], attributes = {}, text = null, eventListeners = {}) {
    const element = document.createElement(tagName);
    for (let child of children) {
        element.append(child);
    }
    for (let name of classes) {
        element.classList.add(name);
    }
    for (let attribute in attributes) {
        element.setAttribute(attribute, attributes[attribute]);
    }
    if (text !== null) {
        element.innerText = text;
    }
    for (act in eventListeners) {
        element.addEventListener(act, eventListeners[act]);
    }
    return element;
}

/**
 * Inserts all songs in the player as DOM elements into the songs list.
 */
function generateSongs(song) {
    document.getElementById("songs").append(createSongElement(song));
}

/**
 * Inserts all playlists in the player as DOM elements into the playlists list.
 */
function generatePlaylists(pl) {
    document.getElementById("playlists").append(createPlaylistElement(pl));
}

/**
Creating the page structure
*/
for (let song of player.songs) {
  generateSongs(song);  
}
for (let pl of player.playlists) {
  generatePlaylists(pl);  
}


/**
Making the add-song-button actually do something
*/
document.getElementById("add-button").addEventListener("click", handleAddSongEvent)



//extra functions:

// sort by title
function compareTitle(a, b) {
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }
    return 0;
}
//sort by name
function compareName(a, b) {
    if (a.name < b.name) {
        return -1;
    }
    if (a.name > b.name) {
        return 1;
    }
    return 0;
}
//function that makes the mm:ss format
function mmssFormat(sec) {
    let hours = Math.floor(sec / 3600);
    let mins = Math.floor((sec - hours * 3600) / 60);
    let secs = sec % 60;
    if (hours < 10) {
        hours = "0" + hours;
    }
    if (mins < 10) {
        mins = "0" + mins;
    }
    if (secs < 10) {
        secs = "0" + secs;
    }
    if (parseInt(hours) > 0) {
        return `${hours}:${mins}:${secs}`;
    } else return `${mins}:${secs}`;
}
//gets pl duration in seconds
function playlistDuration(id) {
    const songs = getPLById(id).songs;
    let durations = [];
    let sum = 0;
    for (let i = 0; i < player.songs.length; i++) {
        for (let j = 0; j < songs.length; j++) {
            if (songs[j] === player.songs[i].id) {
                durations.push(player.songs[i].duration);
            }
        }
    }
    for (let i = 0; i < durations.length; i++) {
        sum += durations[i];
    }
    return sum;
}
//takes id and returns the playlist object
function getPLById(id) {
    let i = 0;
    let existId = false;
    for (i; i < player.playlists.length; i++) {
        if (player.playlists[i].id === id) {
            existId = true;
            return player.playlists[i];
        }
    }
    if (!existId) {
        throw "error: ID is not exist";
    }
}
//sets the class to indicate the color
function setClass(sec) {
    if (sec <= 0) {
        throw "error - duration is not standard";
    }
    const redness = Math.floor(sec / 30);
    if (redness <= 4) {
        return "short-song";
    }
    if (redness >= 14) {
        return "long-song";
    }
    return `duration-color-${redness}`;
}