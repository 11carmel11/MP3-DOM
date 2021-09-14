//sorting the player for later, saves headache...
player.songs.sort(compareTitle);
player.playlists.sort(compareName);
//Plays a song from the player.
//Playing a song means changing the visual indication of the currently playing song.
function playSong(songId) {
    alert("You are playing song number " + songId);
}

/**
 * Adds a song to the player, and updates the DOM to match.
 */
function addSong({title, album, artist, duration, coverArt}) {
    const id = player.songs.length + 1;
    const newSong = {id, title, album, artist, duration, coverArt };
    player.songs.unshift(newSong);
    player.songs.sort(compareTitle);
    const nextSongObj = player.songs[player.songs.indexOf(newSong) + 1];
    const nextSongElm = document.getElementById(nextSongObj.id);
    const songElm =  createSongElement(newSong);
    document.getElementById("songs").insertBefore(songElm, nextSongElm);
}

/**
 * Acts on a click event on an element inside the songs list.
 * Should handle clicks on play buttons and remove buttons of songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleSongClickEvent(event) {
    const target = event.target.innerText;
    if (target === "🗑️") {
        event.path[2].remove();
    }
    if (target === "▶️") {
        playSong(parseInt(event.path[2].attributes[1].value));
    }
}

/**
 * Handles a click event on the button that adds songs.
 *
 * @param {MouseEvent} event - the click event
 */
function handleAddSongEvent(event) {
    const title = event.path[1].children[1].children[0].value;
    const album = event.path[1].children[1].children[1].value;
    const artist = event.path[1].children[1].children[2].value;
    const duration = mmssToSec(event.path[1].children[1].children[3].value);
    const coverArt = event.path[1].children[1].children[4].value;
    return addSong({title, album, artist, duration, coverArt});
}

//Creates a song DOM element based on a song object.
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const buttons = createElement(
        "span",
        [createElement("p", [], ["buttons"], {}, "▶️"), createElement("p", [], ["buttons"], {}, "🗑️")],
        ["button-span"]
    );
    const img = createElement("img", [], [], { src: coverArt, alt: "album cover", height: 300, width: 300 });
    const infoDiv = createElement("div", [
        createElement("p", [], [], {}, `Title: ${title}`),
        createElement("p", [], [], {}, `Album: ${album}`),
        createElement("p", [], [], {}, `Artist: ${artist}`),
        createElement("p", [], [setClass(duration)], {}, `Duration: ${mmssFormat(duration)}`),
    ]);
    const children = [infoDiv, buttons, img];
    const classes = ["songs"];
    const attrs = { id };
    const text = null;
    const eventListeners = {};
    return createElement("div", children, classes, attrs, text, eventListeners);
}

//Creates a playlist DOM element based on a playlist object.
function createPlaylistElement({ id, name, songs }) {
    const children = [
        createElement("p", [], [], {}, `name: ${name}`),
        createElement("p", [], [], {}, `${songs.length} songs inside,`),
        createElement("p", [], [], {}, `${mmssFormat(playlistDuration(id))}`),
    ];
    const classes = ["playlists"];
    const attrs = {};
    const text = null;
    const eventListeners = {};
    return createElement("div", children, classes, attrs, text, eventListeners);
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
function generateSongs() {
    const songsDiv = document.getElementById("songs");
    for (let song of player.songs) {
        songsDiv.append(createSongElement(song));
    }
    songsDiv.addEventListener("click", handleSongClickEvent);
}

/**
 * Inserts all playlists in the player as DOM elements into the playlists list.
 */
function generatePlaylists() {
    for (let pl of player.playlists) {
        document.getElementById("playlists").append(createPlaylistElement(pl));
    }
}

/**
Creating the page structure
*/
generateSongs();
generatePlaylists();

/**
Making the add-song-button actually do something
*/
document.getElementById("add-button").addEventListener("click", handleAddSongEvent);

//extra functions:

//sort by title
function compareTitle(a, b) {
    if (a.title < b.title) {
        return -1;
    }
    if (a.title > b.title) {
        return 1;
    }
    return 1;
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
//makes the mm:ss format
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
//returns the song object
function getSongById(id) {
    let i = 0;
    for (i; i < player.songs.length; i++) {
      if (player.songs[i].id === id) {
        return player.songs[i];
      }
    }
  }
//turns mm:ss to seconds
function mmssToSec(str) {
    let numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let arr = str.split(':');
    for (let part of arr) {
      let subArr = part.split('');
      for (let subPart of subArr) {
        if (!numbers.includes(subPart)) {
          throw 'error';
        }
      }
    }
    if (arr.length === 3) {
      if (arr[1] > 59 || arr[2] > 59) throw 'error';
      return parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60 + parseInt(arr[2]);
    } else {
      if (arr[0] > 59 || arr[1] > 59) throw 'error';
      return parseInt(arr[0]) * 60 + parseInt(arr[1]);
    }
  }