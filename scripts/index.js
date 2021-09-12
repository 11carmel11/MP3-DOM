/**
 * Plays a song from the player.
 * Playing a song means changing the visual indication of the currently playing song.
 *
 * @param {String} songId - the ID of the song to play
 */
function playSong(songId) {
    alert(songId);
}

/**
 * Creates a song DOM element based on a song object.
 */
function createSongElement({ id, title, album, artist, duration, coverArt }) {
    const imgElement = createElement("img");
    imgElement.setAttribute("src", coverArt)
    const pElement = createElement("p");
    pElement.innerHTML = "title:" + title + "<br>" + "album:" + album + "<br>" + "artist:" + artist + "<br>" + "duration:" + duration  ; 
    const children = [pElement, imgElement ]
    const classes = ["background"]
    const attrs = { onclick: `playSong(${id})` }
    return createElement("div", children, classes, attrs)
}

/**
 * Creates a playlist DOM element based on a playlist object.
 */
function createPlaylistElement({ id, name, songs }) {
    const bElement = createElement("b");
    bElement.innerHTML = "id:" + id + " name:" + name + " songs:" + songs;
    const children = [bElement];
    const classes = [];
    const attrs = {};                
    return createElement("div", children, classes, attrs)
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


player.songs.sort(compareTitle);
player.playlists.sort(compareName);
for (let song of player.songs) {
    document.getElementById("songs").append(createSongElement(song));
}
for (let pl of player.playlists) {
    document.getElementById("playlists").append(createPlaylistElement(pl));
}



// You can write more code below this line
function compareTitle(a, b) {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  }

function compareName(a, b) {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name > b.name) {
      return 1;
    }
    return 0;
  }