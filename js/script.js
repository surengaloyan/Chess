// ----globals-------------------------------------------------------------------------------------------------------
const root = document.querySelector(':root');
const gamingArea = document.querySelector('.gaming_area');
const matchesList = document.querySelector('.matches_list');
const historySingleBox = document.querySelector('.history_single_box');
const blackClickSound = document.querySelector('.black_click_sound');
const whiteClickSound = document.querySelector('.white_click_sound');
const wEatFiguresAarea = document.querySelector('.white_eat_figures_area');
const bEatFiguresAarea = document.querySelector('.black_eat_figures_area');
const promotionBar = document.querySelector('.pown_promotion_box .inner');
const promotionFiguresBox = document.querySelector('.promotion_figures');
const winnerNameArea = document.querySelector('.winner_name');
const startPage = document.querySelector('.start_page');
const endTime = document.querySelector('.end_of_time');
const endGame = document.querySelector('.end_of_game');
const desk = document.querySelector('.desk');
const newDesk = desk.innerHTML;

//-----------------
let showClass = "active_pose";
let showEatClass = "eat_pose";
let showCastlingClass = "castling_pose";

let matchesListItems = [];
let mute = true;
let blackMinutes, whiteMinutes;
let blackSeconds = 0, whiteSeconds = 0;

// ----functions-----------------------------------------------------------------------------------------------------
function changeColor(clr) {
    let color;
    switch (clr) {
        case "blue":
            root.style.setProperty('--main-col', 'linear-gradient(to top, #040b67, #0874aa)');
            gamingArea.style.backgroundImage = "url(img/blue_pattern.png)";
            color = "blue";
            break;
        case "red":
            root.style.setProperty('--main-col', 'linear-gradient(to top, #6b001b, #e91c93)');
            gamingArea.style.backgroundImage = "url(img/red_pattern.png)";
            color = "red";
            break;
        case "yellow":
            root.style.setProperty('--main-col', 'linear-gradient(to top, #9e5c00, #e9e21c)');
            gamingArea.style.backgroundImage = "url(img/yellow_pattern.png)";
            color = "yellow";
            break;
        case "green":
            root.style.setProperty('--main-col', 'linear-gradient(to top, #073d00, #009912)');
            gamingArea.style.backgroundImage = "url(img/green_pattern.png)";
            color = "green";
            break;
        case "purple":
            root.style.setProperty('--main-col', 'linear-gradient(to top, rgb(41, 1, 78), rgb(158, 12, 184))');
            gamingArea.style.backgroundImage = "url(img/purple_pattern.png)";
            color = "purple";
            break;
        case "black":
            root.style.setProperty('--main-col', 'linear-gradient(to top, rgb(0, 0, 0), rgb(0, 0, 0))');
            gamingArea.style.backgroundImage = "url(img/black_pattern.png)";
            color = "black";
            break;
        case "orange":
            root.style.setProperty('--main-col', 'linear-gradient(to top, rgb(126, 47, 2), rgb(160, 90, 10))');
            gamingArea.style.backgroundImage = "url(img/orange_pattern.png)";
            color = "orange";
            break;
        case "brown":
            root.style.setProperty('--main-col', 'linear-gradient(to top, rgb(49, 18, 0), rgb(116, 62, 1))');
            gamingArea.style.backgroundImage = "url(img/brown_pattern.png)";
            color = "brown";
            break;
        case "gray":
            root.style.setProperty('--main-col', 'linear-gradient(to top, rgb(70, 69, 69), rgb(151, 151, 151))');
            gamingArea.style.backgroundImage = "url(img/gray_pattern.png)";
            color = "gray";
            break;
        case "rainbow":
            root.style.setProperty('--main-col', 'linear-gradient(to top, rgb(62, 1, 112), rgb(25, 10, 160), rgb(0, 128, 167), rgb(10, 160, 30), rgb(244, 248, 6), rgb(190, 104, 5), rgb(167, 0, 0))');
            gamingArea.style.backgroundImage = "url(img/rainbow_pattern.png)";
            color = "rainbow";
            break;
        default:
            break;
    }
    localStorage.setItem("mainColor", color);
}

function changeFigures(fnt) {
    let font;
    root.style.setProperty('--font-sz', '2.3rem');
    switch (fnt) {
        case "sans_serif":
            root.style.setProperty('--figures-font', 'sans-serif');
            font = "sans_serif";
            if (isMobileDevice) {
                root.style.setProperty('--font-sz', '1.5rem');
                root.style.setProperty('--al-it', 'center');
            }
            break;
        case "free_serif":
            root.style.setProperty('--figures-font', 'FreeSerif');
            font = "free_serif";
            break;
        case "dejavu_sans":
            root.style.setProperty('--figures-font', 'DejaVuSans');
            font = "dejavu_sans";
            break;
        case "pecita":
            root.style.setProperty('--figures-font', 'Pecita');
            font = "pecita";
            break;
        case "quivira":
            root.style.setProperty('--figures-font', 'Quivira');
            font = "quivira";
            break;
        default:
            break;
    }
    localStorage.setItem("figuresFont", font);
}
// ----check device-------------------------------------------------------------------------------------------------
let details = navigator.userAgent;
let regexp = /android|iphone|kindle|ipad/i;
let isMobileDevice = regexp.test(details);

// ----DOMContentLoaded----------------------------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    // ----set color------------------------
    if (localStorage.getItem('mainColor') != null) {
        let color = localStorage.getItem('mainColor');
        changeColor(color);
    } else {
        localStorage.setItem('mainColor', 'purple')
    }
    // ----set font-------------------------
    if (localStorage.getItem('figuresFont') != null) {
        let font = localStorage.getItem('figuresFont');
        changeFigures(font);
    } else {
        localStorage.setItem('figuresFont', 'sans_serif')
    }

    if (isMobileDevice)
        nameBox.style.overflowY = "scroll";

    getFiguresObjects()
    getMatchesHistory();

});

function getFiguresObjects() {
    figuresArr.push(...document.querySelectorAll('.black_figure span'));
    figuresArr.push(...document.querySelectorAll('.white_figure span'));
    figuresArr.forEach(figure => {
        addFigure(figure.parentElement.classList[0][1], figure.parentElement.classList[0][0], figure.parentElement.classList[2], figure.innerText);
        figure.addEventListener('click', () => {
            document.removeEventListener('click', playClick);//sound
            showPoses(figure);
        });
    })
    wKingObj = figuresObjArr.filter(el => { return el.symbol == "♔" })[0];
    bKingObj = figuresObjArr.filter(el => { return el.symbol == "♚" })[0];

}

// ------add figures objects-----------------------------------------------------------------------------------------
function addFigure(numberId, letterId, color, symbol) {
    if (symbol == "♟" || symbol == "♙")
        figuresObjArr.push(new Pawn(numberId, letterId, color, symbol));
    if (symbol == "♜" || symbol == "♖")
        figuresObjArr.push(new Rook(numberId, letterId, color, symbol));
    if (symbol == "♞" || symbol == "♘")
        figuresObjArr.push(new Knight(numberId, letterId, color, symbol));
    if (symbol == "♝" || symbol == "♗")
        figuresObjArr.push(new Bishop(numberId, letterId, color, symbol));
    if (symbol == "♛" || symbol == "♕")
        figuresObjArr.push(new Queen(numberId, letterId, color, symbol));
    if (symbol == "♚" || symbol == "♔")
        figuresObjArr.push(new King(numberId, letterId, color, symbol));
}




// ------timer & start page-----------------------------------------------------------------------------------------
const timers = document.querySelectorAll('.timer_box div');
const blackTimerMinutes = document.querySelector('.black_timer .minutes');
const blackTimerSeconds = document.querySelector('.black_timer .seconds');

const whiteTimerMinutes = document.querySelector('.white_timer .minutes');
const whiteTimerSeconds = document.querySelector('.white_timer .seconds');


timers.forEach(el => {
    el.addEventListener('click', () => {
        startPage.classList.add('hide');
        blackMinutes = Number(el.className.substring(1));
        whiteMinutes = Number(el.className.substring(1));
        let minutes = blackMinutes < 10 ? "0" + blackMinutes : blackMinutes;
        blackTimerMinutes.innerText = minutes;
        whiteTimerMinutes.innerText = minutes;
        blackTimerSeconds.innerText = "00";
        whiteTimerSeconds.innerText = "00";
        if (blackMinutes == 0) {
            blackMinutes = false;
        }
    })
})

function changeBlackSeconds() {
    blackSeconds--;
    if (blackSeconds < 0) {
        blackSeconds = 59;
        changeBlackMinutes();
    }
    blackTimerSeconds.innerHTML = blackSeconds < 10 ? "0" + blackSeconds : blackSeconds;
}

function changeWhiteSeconds() {
    whiteSeconds--;
    if (whiteSeconds < 0) {
        whiteSeconds = 59;
        changeWhiteMinutes();
    }
    whiteTimerSeconds.innerHTML = whiteSeconds < 10 ? "0" + whiteSeconds : whiteSeconds;
}

function changeBlackMinutes() {
    blackMinutes--;
    if (blackMinutes < 0) {
        clearInterval(blackTimer);
        endTime.classList.add('active');
        gamingArea.classList.add('active');
    } else {
        blackTimerMinutes.innerHTML = blackMinutes < 10 ? "0" + blackMinutes : blackMinutes;
    }
}

function changeWhiteMinutes() {
    whiteMinutes--;
    if (blackMinutes < 0) {
        clearInterval(whiteTimer);
        endTime.classList.add('active');
        gamingArea.classList.add('active');
    } else {
        whiteTimerMinutes.innerHTML = whiteMinutes < 10 ? "0" + whiteMinutes : whiteMinutes;
    }
}

function changeTimer(turn) {
    if (turn == "white_figure") {
        p1NameArea.classList.add('active');
        p2NameArea.classList.remove('active');
        if (blackMinutes) {
            whiteTimer = setInterval(changeWhiteSeconds, 1000);
            clearInterval(blackTimer);
        }
    } else {
        p2NameArea.classList.add('active');
        p1NameArea.classList.remove('active');
        if (blackMinutes) {
            blackTimer = setInterval(changeBlackSeconds, 1000);
            clearInterval(whiteTimer);
        }
    }
}


// ----menu----------------------------------------------------------------------------------------------------------
const menuBtn = document.querySelector('.menu_btn');
const navBar = document.querySelector('nav');
const restartBtns = document.querySelectorAll('.restart');
const blurArea = document.querySelector('.for_blur');
menuBtn.addEventListener('click', showHideMenu);
function showHideMenu() {
    if (menuBtn.classList.contains('fa-times')) {
        themesBtn.classList.remove('active');
        themesBox.classList.remove('active');
        figuresBtn.classList.remove('active');
        figuresBox.classList.remove('active');
        namesBtn.classList.remove('active');
        nameBox.classList.remove('active');
        historyBtn.classList.remove('active');
        historyBox.classList.remove('active');
        changeTimer(turn);
    } else {
        clearInterval(blackTimer);
        clearInterval(whiteTimer);
    }
    menuBtn.classList.toggle('fa-times');
    navBar.classList.toggle('active');
    gamingArea.classList.toggle('active');
}

// ----music---------------------------------------------------------------------------------------------------------
const musicBtn = document.querySelector('.music');
const music = document.querySelector('.chess_music');
musicBtn.addEventListener('click', () => {
    musicBtn.classList.toggle('active');
    if (musicBtn.classList.contains('active'))
        music.play();
    else
        music.pause();
})

//----sounds---------------------------------------------------------------------------------------------------------
const soundsBtn = document.querySelector('.sounds');
const clickSound = document.querySelector('.click_sound');
soundsBtn.addEventListener('click', () => {
    soundsBtn.classList.toggle('active');
    mute = false;
    if (soundsBtn.classList.contains('active'))
        document.addEventListener('click', playClick);
    else
        document.removeEventListener('click', playClick);
})

function playClick() {
    clickSound.play();
}


// ------on/off dark mode--------------------------------------------------------------------------------------------
const darkBtn = document.querySelector('.dark');
// -----get device mode----------
let matched = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (matched) {
    darkBtn.classList.add('active');
    document.body.classList.add('dark');
} else {
    darkBtn.classList.remove('active');
    document.body.classList.remove('dark');
}
darkBtn.addEventListener('click', () => {
    darkBtn.classList.toggle('active');
    document.body.classList.toggle('dark');
});

// ------themes------------------------------------------------------------------------------------------------------
const themesBtn = document.querySelector('.themes');
const themesBox = document.querySelector('.theme_box');
let themeBtnsArr = [...document.querySelectorAll('.theme_box div')];

themesBtn.addEventListener('click', () => {
    themesBtn.classList.toggle('active');
    themesBox.classList.toggle('active');

    figuresBtn.classList.remove('active');
    figuresBox.classList.remove('active');
    namesBtn.classList.remove('active');
    nameBox.classList.remove('active');
    historyBtn.classList.remove('active');
    historyBox.classList.remove('active');
})

themeBtnsArr.forEach(btn => {
    btn.addEventListener('click', () => {
        changeColor(btn.className);
    })
})

// ------figures------------------------------------------------------------------------------------------------------
const figuresBtn = document.querySelector('.figures');
const figuresBox = document.querySelector('.figure_box');
let figureBtnsArr = [...document.querySelectorAll('.figure_box div')];

figuresBtn.addEventListener('click', () => {
    figuresBtn.classList.toggle('active');
    figuresBox.classList.toggle('active');

    themesBtn.classList.remove('active');
    themesBox.classList.remove('active');
    namesBtn.classList.remove('active');
    nameBox.classList.remove('active');
    historyBtn.classList.remove('active');
    historyBox.classList.remove('active');
})

figureBtnsArr.forEach(btn => {
    btn.addEventListener('click', () => {
        changeFigures(btn.className)
    })
})
// ------names------------------------------------------------------------------------------------------------------
const namesBtn = document.querySelector('.names');
const saveNamesBtn = document.querySelector('#save_names');
const nameBox = document.querySelector('.name_box');
const backFromNames = document.querySelector('.back_from_names');
const backFromHistory = document.querySelector('.back_from_history');

const player1NameInput = document.querySelector('#player1_name_input');
const player2NameInput = document.querySelector('#player2_name_input');
const p1NameArea = document.querySelector('.p1name_area');
const p2NameArea = document.querySelector('.p2name_area');

namesBtn.addEventListener('click', () => {
    nameBox.classList.toggle('active');
    namesBtn.classList.toggle('active');

    figuresBtn.classList.remove('active');
    figuresBox.classList.remove('active');
    themesBtn.classList.remove('active');
    themesBox.classList.remove('active');
    historyBtn.classList.remove('active');
    historyBox.classList.remove('active');
});

saveNamesBtn.addEventListener('click', () => {
    if (player1NameInput.value != "" && player2NameInput.value != "") {
        saveNamesBtn.classList.add('active');
        if (saveNamesBtn.classList.contains('active')) {
            saveNamesBtn.value = "saved";
            p1NameArea.innerHTML = player1NameInput.value;
            p2NameArea.innerHTML = player2NameInput.value;
        }
    } else
        saveNamesBtn.value = "save"
});

player1NameInput.addEventListener('focus', () => {
    saveNamesBtn.classList.remove('active');
    saveNamesBtn.value = "save";
})
player2NameInput.addEventListener('focus', () => {
    saveNamesBtn.classList.remove('active');
    saveNamesBtn.value = "save";
})

backFromNames.addEventListener('click', () => {
    nameBox.classList.remove('active');
    namesBtn.classList.remove('active');
})

// ------poses------------------------------------------------------------------------------------------------------
const posesBtn = document.querySelector('.poses');
posesBtn.addEventListener('click', () => {
    posesBtn.classList.toggle('active');
    classArr.forEach(cl => document.querySelector('.' + cl).classList.remove(showClass));
    eatClassArr.forEach(cl => document.querySelector('.' + cl).classList.remove(showEatClass));
    castlingPoses.forEach(cl => document.querySelector('.' + cl).classList.remove(showCastlingClass));
    if (posesBtn.classList.contains('active')) {
        showClass = "active_pose";
        showEatClass = "eat_pose";
        showCastlingClass = "castling_pose";
    } else {
        showClass = "hidden_active_pose";
        showEatClass = "hidden_eat_pose";
        showCastlingClass = "hidden_castling_pose";
    }
})

// -------win btns----------------------------------------------------------------------------------------------
const winSelect = document.querySelector('#win_select');
const winBtns = document.querySelector('.win_btns');

winSelect.addEventListener('click', () => {
    winBtns.classList.toggle('active');
})

const whiteWinnerBtns = document.querySelectorAll('.white_winner');
const blackWinnerBtns = document.querySelectorAll('.black_winner');
const nobodysBtns = document.querySelectorAll('.nobodys');

whiteWinnerBtns.forEach(el => el.addEventListener('click', () => {
    winBtns.classList.remove('active');
    saveHistory('white');
    showWinner('white');
}));
blackWinnerBtns.forEach(el => el.addEventListener('click', () => {
    winBtns.classList.remove('active');
    saveHistory('black');
    showWinner('black');
}));
nobodysBtns.forEach(el => el.addEventListener('click', () => {
    winBtns.classList.remove('active');
    saveHistory('nobodys');
    showWinner('nobodys');
}))

function showWinner(winner) {
    endGame.classList.add('active');
    clearInterval(blackTimer);
    clearInterval(whiteTimer);
    if (winner == "white") {
        winnerNameArea.innerHTML = p1NameArea.innerHTML;
    } else if (winner == "black") {
        winnerNameArea.innerHTML = p2NameArea.innerHTML;
    } else {
        winnerNameArea.innerHTML = "nobody\'s";
    }
}


// ------history----------------------------------------------------------------------------------------------------
const historyBtn = document.querySelector('.history');
const historyBox = document.querySelector('.history_box');

historyBtn.addEventListener('click', () => {
    historyBtn.classList.toggle('active');
    historyBox.classList.toggle('active');

    figuresBtn.classList.remove('active');
    figuresBox.classList.remove('active');
    themesBtn.classList.remove('active');
    themesBox.classList.remove('active');
    namesBtn.classList.remove('active');
    nameBox.classList.remove('active');
})

backFromHistory.addEventListener('click', () => {
    historyBtn.classList.remove('active');
    historyBox.classList.remove('active');
})

function savePose(figure, message) {
    let id = figure.fullId;
    let sym = figure.symbol;

    //-----push new pose ------------------------------------
    if (message == "castling") {

        if (turn == "white_figure") {
            if (id == "d1" || id == "d8") gamePosesHistory.push("0-0-0");
            else gamePosesHistory.push("0-0");
        } else {
            if (id == "d1" || id == "d8")
                gamePosesHistory[gamePosesHistory.length - 1] += "➙0-0-0";
            else gamePosesHistory[gamePosesHistory.length - 1] += "➙0-0";
        }

    } else {

        if (turn == "white_figure")
            gamePosesHistory.push(sym + id);
        else
            gamePosesHistory[gamePosesHistory.length - 1] += "➙" + sym + id;

    }

}

function saveHistory(winner) {
    let matchesHistory;
    if (localStorage.getItem('matchesHistory') == null) {
        matchesHistory = [];
    } else {
        matchesHistory = JSON.parse(localStorage.getItem('matchesHistory'));
    }

    let today = new Date();
    let day = today.getDate() < 10 ? "0" + today.getDate() : today.getDate();
    let month = today.getMonth() < 10 ? "0" + today.getMonth() : today.getMonth();
    let date = day + "." + month + "." + today.getFullYear();

    matchesHistory.push(new Match(Date.now(), p1NameArea.innerHTML, p2NameArea.innerHTML, date, winner, gamePosesHistory));
    localStorage.setItem('matchesHistory', JSON.stringify(matchesHistory));
    getMatchesHistory();
}


function getMatchesHistory() {
    let matchesHistory;
    if (localStorage.getItem('matchesHistory') == null) {
        matchesHistory = [];
    } else {
        matchesHistory = JSON.parse(localStorage.getItem('matchesHistory'));
    }
    matchesList.innerHTML = "";
    matchesHistory.forEach(match => {
        let item = document.createElement('li');
        item.id = match.id;
        item.innerHTML = `<span class="date">${match.date}</span>`;
        item.innerHTML += `<span class="players">${match.player1}<span class="vs"> vs </span>${match.player2}</span>`;
        if (match.winner == "white")
            item.innerHTML += "<span class='winner'><i class='fas fa-chess-king'></i></span>"
        else if (match.winner == "black")
            item.innerHTML += "<span class='winner'><i class='fas fa-chess-king black'></i></span>"
        else
            item.innerHTML += "<span class='winner'><i class='fas fa-handshake'></i></span>"

        matchesList.appendChild(item);
    });
    matchesListItems = document.querySelectorAll('.matches_list li');

    matchesListItems.forEach(li => {
        li.addEventListener('click', () => {
            historySingleBox.classList.add('active');
            let matchesHistory;
            if (localStorage.getItem('matchesHistory') == null) {
                matchesHistory = [];
            } else {
                matchesHistory = JSON.parse(localStorage.getItem('matchesHistory'));
            }
            const match = matchesHistory.filter(el => { return el.id == li.id })[0];
            let item = document.createElement('div');
            item.id = match.id;
            item.innerHTML += '<i class="fas fa-arrow-left back_from_history_single"></i>';
            item.innerHTML += '<i class="fas fa-trash"></i>';
            item.innerHTML += `<div class="players">${match.player1}<span class="vs"> vs </span>${match.player2}</div> <hr>`;
            item.innerHTML += `<div class="date">date : ${match.date}</div>`;
            item.innerHTML += `<div class="p1col">${match.player1} : <i class='fas fa-chess-king'></i></div>`;
            item.innerHTML += `<div class="p2col">${match.player2} : <i class='fas fa-chess-king black'></i></div>`;
            if (match.winner == "white")
                item.innerHTML += `<div class='winner'>winner: ${match.player1}</i></div>`;
            else if (match.winner == "black")
                item.innerHTML += `<div class='winner'>winner: ${match.player2}</i></div>`;
            else
                item.innerHTML += `<div class='winner'>winner: nobody's</i></div>`;

            item.innerHTML += `<div class="poses">${match.poses}</div>`
            historySingleBox.innerHTML = "";
            historySingleBox.appendChild(item);
            document.querySelector('.back_from_history_single').addEventListener('click', () => {
                historySingleBox.classList.remove('active');
            })
            document.querySelector('.fa-trash').addEventListener('click', removeFromLocalStorege);
        })
    })
}

function removeFromLocalStorege(e) {
    let matchesHistory;
    if (localStorage.getItem('matchesHistory') == null) {
        matchesHistory = [];
    } else {
        matchesHistory = JSON.parse(localStorage.getItem('matchesHistory'));
    }
    historySingleBox.classList.remove('active');
    const item = e.target.parentElement;
    const match = matchesHistory.filter(el => { return el.id == item.id })[0];
    matchesHistory.splice(matchesHistory.indexOf(match), 1);
    localStorage.setItem('matchesHistory', JSON.stringify(matchesHistory));
    getMatchesHistory();
}

// ------restart----------------------------------------------------------------------------------------------------
restartBtns.forEach(el => el.addEventListener('click', restart));
function restart() {
    menuBtn.classList.remove('fa-times');
    navBar.classList.remove('active');
    gamingArea.classList.remove('active');
    endGame.classList.remove('active');
    endTime.classList.remove('active');
    wEatFiguresAarea.innerHTML = "";
    bEatFiguresAarea.innerHTML = "";
    p1NameArea.classList.add('active');
    p2NameArea.classList.remove('active');
    desk.innerHTML = newDesk;
    figuresArr = [];
    figuresObjArr = [];
    classArr = [];
    eatClassArr = [];
    castlingPoses = [];
    gamePosesHistory = [];
    turn = "white_figure";
    blackSeconds = 0;
    whiteSeconds = 0;
    getFiguresObjects();
    startPage.classList.remove('hide');
}
