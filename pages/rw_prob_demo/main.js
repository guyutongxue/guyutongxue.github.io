// import EventEmitter3 from 'eventemitter3';

// const readDuration = 2000;
// const writeDuration = 3000;

let readCnt = 0;
function setReadCnt(val) {
    readCnt = val;
    $('#readCnt').text(readCnt.toString());
}

let writeMutex = false;
const writeMutexEE = new EventEmitter3.EventEmitter();

let readCntMutex = false;
const readCntMutexEE = new EventEmitter3.EventEmitter();

async function lockReadCnt() {
    while (readCntMutex) {
        await new Promise(r => readCntMutexEE.once('unlock', r));
    }
    readCntMutex = true;
    $('#readCnt').css('color', "red");
}
function unlockReadCnt() {
    readCntMutex = false;
    $('#readCnt').css('color', "black");
    readCntMutexEE.emit('unlock');
}

const readSpinner = $(`<div class="timer timer-black">
    <div class="pie pie-black spinner"></div>
    <div class="pie pie-black filler"></div>
    <div class="mask"></div>
</div>`);
const writeSpinner = $(`<div class="timer timer-red">
    <div class="pie pie-red spinner"></div>
    <div class="pie pie-red filler"></div>
    <div class="mask"></div>
</div>`);


function sleep(milsec) {
    return new Promise(r => setTimeout(r, milsec));
}

function hideBook() {
    $("#nobookImg,#penImg").show();
}
function showBook() {
    $("#nobookImg,#penImg").hide();
}
function randomPt(left, top, width, height) {
    return {
        x: left + width * Math.random(),
        y: top + height * Math.random(),
    };
}
function getReadingPt() {
    return randomPt(300, 600, 150, 100);
}
function getRWaitingPt() {
    return randomPt(85, 625, 100, 100);
}
function getWWaitingPt() {
    return randomPt(550, 600, 200, 150);
}
/**
 * 
 * @param {JQuery} obj 
 * @returns {JQuery}
 */
async function showDot(obj) {
    $('#canvas').append(obj);
    await anime({
        targets: obj[0],
        opacity: 1,
        duration: 800
    }).finished;
    return obj;
}
/**
 * 
 * @param {JQuery} obj 
 */
async function lockDoor(obj) {
    let position = getWWaitingPt();
    await anime({
        targets: obj[0],
        left: position.x,
        top: position.y,
        duration: 1000,
        easing: 'easeInOutExpo'
    }).finished;
    while (writeMutex) {
        await new Promise(r => writeMutexEE.once('unlock', r));
    }
    writeMutex = true;
    await anime({
        targets: obj[0],
        left: 650,
        top: 600,
        duration: 200,
        easing: 'easeInOutExpo'
    }).finished;
    $("#lockImg").show();
}
async function unlockDoor() {
    writeMutex = false;
    $("#lockImg").hide();
    writeMutexEE.emit('unlock');
}

/**
 * 
 * @param {JQuery} obj 
 */
async function write(obj) {
    hideBook();
    let time = $('#writeRange').val();
    obj.append(writeSpinner.clone().css('--time', time + 'ms'));
    await sleep(time);
    showBook();
    obj.addClass("pie-red");
    obj.children().remove();
}

async function read(obj) {
    let time = $('#readRange').val();
    obj.append(readSpinner.clone().css('--time', time + 'ms'));
    await sleep(time);
    obj.addClass("pie-black");
    obj.children().remove();
}

async function addReader() {
    let position = getRWaitingPt();
    let reader = $(`<div class="reader"></div>`).css({
        left: position.x,
        top: position.y
    });
    showDot(reader);
    await lockReadCnt();
    setReadCnt(readCnt + 1);
    if (readCnt === 1) {
        await lockDoor(reader);
    }
    unlockReadCnt();
    position = getReadingPt();
    // go to read point
    await anime({
        targets: reader[0],
        left: position.x,
        top: position.y,
        duration: 1000,
        easing: 'easeInOutExpo'
    }).finished;
    // reading
    await read(reader);
    // back
    await lockReadCnt();
    if (readCnt === 1) {
        await anime({
            targets: reader[0],
            left: 650,
            top: 600,
            duration: 1000,
            easing: 'easeInOutExpo'
        }).finished;
        unlockDoor();
    }
    setReadCnt(readCnt - 1);
    unlockReadCnt();
    await anime({
        targets: reader[0],
        left: 135,
        top: 675,
        opacity: 0,
        duration: 1000,
        easing: 'easeInOutExpo'
    }).finished;
    reader.remove();
}
async function addWriter() {
    let writer = $(`<div class="writer"></div>`).css({
        left: 865,
        top: 675
    });
    showDot(writer);
    await lockDoor(writer);
    // go to write point
    await anime({
        targets: writer[0],
        left: 650,
        top: 400,
        duration: 500,
        easing: 'easeInExpo'
    }).finished;
    await anime({
        targets: writer[0],
        left: 500,
        top: 400,
        duration: 500,
        easing: 'easeOutExpo'
    }).finished;
    // writing
    await write(writer);
    // back
    await anime({
        targets: writer[0],
        left: 650,
        top: 400,
        duration: 500,
        easing: 'easeInExpo'
    }).finished;
    await anime({
        targets: writer[0],
        left: 650,
        top: 500,
        duration: 500,
        easing: 'easeOutExpo'
    }).finished;
    unlockDoor();
    await anime({
        targets: writer[0],
        left: 650,
        top: 600,
        duration: 200,
        easing: 'easeInExpo'
    }).finished;
    await anime({
        targets: writer[0],
        left: 865,
        top: 675,
        opacity: 0,
        duration: 800,
        easing: 'easeOutExpo'
    }).finished;
    writer.remove();
}

// Type 2


function getRWaitingPt2() {
    return randomPt(85, 625, 100, 100);
}

let readMutex = false;
const readMutexEE = new EventEmitter3.EventEmitter();

let writeCnt = 0;
let writeCntMutex = false;
const writeCntMutexEE = new EventEmitter3.EventEmitter();

function setWriteCnt(val) {
    writeCnt = val;
    $('#writeCnt').text(writeCnt.toString());
}

async function lockReadDoor(obj, reading = true) {
    let mp = reading ? -1 : 1;
    await anime({
        targets: obj[0],
        left: 250 + mp * 100 * Math.random(),
        top: 625 + 100 * Math.random(),
        duration: 200,
        easing: 'easeInOutExpo'
    }).finished;
    while (readMutex) {
        await new Promise(r => readMutexEE.once('unlock', r));
    }
    readMutex = true;
    await anime({
        targets: obj[0],
        left: 250,
        top: 675,
        duration: 1000,
        easing: 'easeInOutExpo'
    }).finished;
    $("#lockReadImg").show();
}
async function unlockReadDoor(obj) {
    await anime({
        targets: obj[0],
        left: 250,
        top: 675,
        duration: 1000,
        easing: 'easeInOutExpo'
    }).finished;
    readMutex = false;
    $("#lockReadImg").hide();
    readMutexEE.emit('unlock');
}

async function lockWriteCnt() {
    while (writeCntMutex) {
        await new Promise(r => writeCntMutexEE.once('unlock', r));
    }
    writeCntMutex = true;
    $('#writeCnt').css('color', 'red');
}

function unlockWriteCnt() {
    writeCntMutex = false;
    $('#writeCnt').css('color', "black");
    writeCntMutexEE.emit('unlock');
}

async function addReader2() {
    let position = getRWaitingPt2();
    let reader = $(`<div class="reader"></div>`).css({
        left: position.x,
        top: position.y
    });
    showDot(reader);
    await lockReadDoor(reader);
    await lockReadCnt();
    setReadCnt(readCnt + 1);
    if (readCnt === 1) {
        await lockDoor(reader);
    }
    unlockReadCnt();
    await unlockReadDoor(reader);
    position = getReadingPt();
    // go to read point
    await anime({
        targets: reader[0],
        left: position.x,
        top: position.y,
        duration: 1000,
        easing: 'easeInOutExpo'
    }).finished;
    // reading
    await read(reader);
    // back
    await lockReadCnt();
    if (readCnt === 1) {
        await anime({
            targets: reader[0],
            left: 650,
            top: 600,
            duration: 1000,
            easing: 'easeInOutExpo'
        }).finished;
        unlockDoor();
    }
    setReadCnt(readCnt - 1);
    unlockReadCnt();
    await anime({
        targets: reader[0],
        left: 250,
        top: 750,
        opacity: 0,
        duration: 1000,
        easing: 'easeInOutExpo'
    }).finished;
    reader.remove();
}

async function addWriter2() {
    let writer = $(`<div class="writer"></div>`).css({
        left: 865,
        top: 675
    });
    showDot(writer);
    await lockWriteCnt();
    setWriteCnt(writeCnt + 1);
    if (writeCnt === 1) {
        await lockReadDoor(writer, false);
    }
    unlockWriteCnt();
    await lockDoor(writer);
    // go to write point
    await anime({
        targets: writer[0],
        left: 650,
        top: 400,
        duration: 500,
        easing: 'easeInExpo'
    }).finished;
    await anime({
        targets: writer[0],
        left: 500,
        top: 400,
        duration: 500,
        easing: 'easeOutExpo'
    }).finished;
    // writing
    await write(writer);
    // back
    await anime({
        targets: writer[0],
        left: 650,
        top: 400,
        duration: 500,
        easing: 'easeInExpo'
    }).finished;
    await anime({
        targets: writer[0],
        left: 650,
        top: 500,
        duration: 500,
        easing: 'easeOutExpo'
    }).finished;
    unlockDoor();
    await anime({
        targets: writer[0],
        left: 650,
        top: 600,
        duration: 200,
        easing: 'easeInOutExpo'
    }).finished;
    await lockWriteCnt();
    setWriteCnt(writeCnt - 1);
    if (writeCnt === 0) {
        await unlockReadDoor(writer);
    }
    unlockWriteCnt();
    await anime({
        targets: writer[0],
        left: 865,
        top: 675,
        opacity: 0,
        duration: 800,
        easing: 'easeOutExpo'
    }).finished;
    writer.remove();
}