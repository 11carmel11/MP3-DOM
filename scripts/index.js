//actual website
player.songs.sort(compareTitle);
player.playlists.sort(compareName);
for (let song of player.songs) {
    document.getElementById("songs").append(createSongElement(song));
}
for (let pl of player.playlists) {
    document.getElementById("playlists").append(createPlaylistElement(pl));
}

/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {String} songId - the ID of the song to play
 */
function playSong(songId) {
    alert("You are playing song number " + songId);
}

/**
 * Creates a song DOM element based on a song object.
 */
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const imgElement = createElement("img");
    imgElement.setAttribute("src", coverArt);
    imgElement.setAttribute("alt", "album cover");
    const pElement = createElement("p");
    pElement.innerHTML =
        "title:" +
        title +
        "<br>" +
        "album:" +
        album +
        "<br>" +
        "artist:" +
        artist +
        "<br>" +
        "duration:" +
        mmssFormat(duration);
    const children = [pElement, imgElement];
    const classes = ["songs"];
    const attrs = { onclick: `playSong(${id})` };
    return createElement("div", children, classes, attrs);
}

/**
 * Creates a playlist DOM element based on a playlist object.
 */
function createPlaylistElement({ id, name, songs }) {
    const bElement = createElement("b");
    bElement.innerHTML = "name:" + name + ", " + songs.length + " songs inside, " + mmssFormat(playlistDuration(id));
    const children = [bElement];
    const classes = ["playlists"];
    const attrs = {};
    return createElement("div", children, classes, attrs);
}

/**
 * Creates a new DOM element.
 *
 * Example usage:
 * createElement("div", ["just text", createElement(...)], ["nana", "banana"], {id: "bla"})
 *
 * @param {String} tagName - the type of the element
 * @param {Array} children - the child elements for the new element.
 *                           Each child can be a DOM element, or a string (if you just want a text element).
 * @param {Array} classes - the class list of the new element
 * @param {Object} attributes - the attributes for the new element
 */

function createElement(tagName, children = [], classes = [], attributes = {}) {
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
    return element;
}

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
