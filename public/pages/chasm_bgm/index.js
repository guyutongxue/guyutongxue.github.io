// const { Howl } = require("howler")


const START = [
    0, 1572, 2049, 4032, 1477
];
const END = [
    230000, 224719, 254105, 236132, 243061
];

function generateHowl(/** @type {string[]} */ name, /** @type {number} */ no) {
    return name.map(n => new Howl({
        src: [n],
        sprite: {
            d: [START[no], END[no] - START[no], true]
        },
    }));
}

/** @type {Howl[][]} */
const AUDIOS = [
    [
        "1.b.2.mp3",
        "1.b.mp3", // TODO
        "1.b.mp3",
    ],
    [
        "2.b.mp3",
        "2.1.mp3",
        "2.2.mp3",
    ],
    [
        "3.b.mp3",
        "3.1.mp3",
        "3.2.mp3",
    ],
    [
        "4.b.mp3",
        "4.1.mp3",
        "4.2.mp3",
    ],
    [
        "5.b.mp3", 
        "5.mp3",
        "5.mp3"
    ],
].map((name, no) => generateHowl(name, no));



const AUDIO_LOADED = AUDIOS.flat().map(a => new Promise(r => a.on('load', r)));

async function play(no, ty = 0) {
    await AUDIO_LOADED;
    const id = AUDIOS[no][ty].play('d');
    const now = (new Date()).getTime();
    const tick = now % (END[no] - START[no]);
    AUDIOS[no][ty].seek(tick / 1000, id);
    // Stop other audios
    AUDIOS[no].filter((_, i) => i !== ty).forEach(a => a.stop());
    AUDIOS.filter((_, i) => i !== no).forEach(a => a.forEach(b => b.stop()));
}

function stop() {
    AUDIOS.forEach(a => a.forEach(b => b.stop()));
}

let place = 1;
let ty = -1;

function tySwitch(newTy) {
    const srcEle = document.querySelector(`.switch-btn[data-ty="${newTy}"]`);
    if (srcEle.classList.contains("active")) {
        console.log("stop");
        srcEle.classList.remove("active");
        srcEle.blur();
        ty = -1;
        stop();
    } else {
        document.querySelectorAll(".switch-btn").forEach(e => e.classList.remove("active"));
        srcEle.classList.add("active");
        ty = newTy;
        play(place, ty);
    }
}

function placeSwitch(newPlace) {
    place = newPlace;
    if (ty !== -1) {
        play(place, ty);
    }
    document.querySelectorAll(".point").forEach(e => e.classList.remove("active"));
    const srcEle = document.querySelector(`.point[data-place="${newPlace}"]`);
    srcEle.classList.add("active");
}
