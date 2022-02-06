//-----globals-------------------------------------------------------------------------------------------------------
let figuresArr = [];
let figuresObjArr = [];
let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

let classArr = [];
let eatClassArr = [];
let castlingPoses = [];
let gamePosesHistory = [];
let turn = "white_figure";
let eater;
//-----------------
let wKingObj;
let bKingObj;

let wKing;
let bKing;

let whiteTimer;
let blackTimer;


//-----show poses----------------------------------------------------------------------------------------------------
function showPoses(figure) {
    if (figure.parentElement.classList.contains(turn)) {
        eater = figure;
        let id = figure.parentElement.classList[0];
        let item = figuresObjArr.filter(el => { return el.fullId == id })[0];
        if (item != undefined) {
            classArr.forEach(cl => {
                let it = document.querySelector('.' + cl + ' span');
                if (it.innerHTML == "") {
                    let parent = it.parentElement;
                    parent.classList.remove(showClass);
                    parent.replaceChild(it.cloneNode(true), it);
                }
            });
            eatClassArr.forEach(cls => document.querySelector('.' + cls + ' span').removeEventListener('click', eat));
            eatClassArr.forEach(cl => document.querySelector('.' + cl).classList.remove(showEatClass));
            castlingPoses.forEach(cl => document.querySelector('.' + cl).classList.remove(showCastlingClass));
            classArr = item.getPoses();
            eatClassArr = item.checkEat();
            classArr.forEach(cl => document.querySelector('.' + cl).classList.add(showClass));
            eatClassArr.forEach(cl => document.querySelector('.' + cl).classList.add(showEatClass));
            moveFigures(figure);
        }
    }
}


// ------move figures------------------------------------------------------------------------------------------------
function moveFigures(figure) {
    let id = figure.parentElement.classList[0];
    let item = figuresObjArr.filter(el => { return el.fullId == id })[0];
    // ------castling-----------------------------------------------------------------------------------------------
    if (item.symbol == "♔" || item.symbol == "♚") {
        if (item.castling == false) {
            let checkRight = [
                document.querySelector('.' + letters[letters.indexOf(id[0]) + 1] + id[1] + ' span'),
                document.querySelector('.' + letters[letters.indexOf(id[0]) + 2] + id[1] + ' span')
            ];
            let checkLeft = [
                document.querySelector('.' + letters[letters.indexOf(id[0]) - 1] + id[1] + ' span'),
                document.querySelector('.' + letters[letters.indexOf(id[0]) - 2] + id[1] + ' span'),
                document.querySelector('.' + letters[letters.indexOf(id[0]) - 3] + id[1] + ' span')
            ];
            let isRight = 0;
            checkRight.forEach(el => { if (el.innerHTML == "") isRight++; });
            let isLeft = 0;
            checkLeft.forEach(el => { if (el.innerHTML == "") isLeft++; });
            if (isRight == 2) {
                let rook = document.querySelector('.' + letters[letters.indexOf(id[0]) + 3] + id[1] + ' span');
                let rookObj = figuresObjArr.filter(el => { return el.fullId == rook.parentElement.classList[0] })[0];
                if (rook.innerHTML == "♜" || rook.innerHTML == "♖" && rookObj.castling == false) {
                    castlingPoses.push(letters[letters.indexOf(id[0]) + 3] + id[1]);
                    rook.addEventListener('click', castling);
                }
            };
            if (isLeft == 3) {
                let rook = document.querySelector('.' + letters[letters.indexOf(id[0]) - 4] + id[1] + ' span');
                let rookObj = figuresObjArr.filter(el => { return el.fullId == rook.parentElement.classList[0] })[0];
                if (rook.innerHTML == "♜" || rook.innerHTML == "♖" && rookObj.castling == false) {
                    castlingPoses.push(letters[letters.indexOf(id[0]) - 4] + id[1]);
                    rook.addEventListener('click', castling);
                }
            }

            castlingPoses.forEach(cl => document.querySelector('.' + cl).classList.add(showCastlingClass));

            function castling(e) {
                classArr.forEach(cl => {
                    let elem = document.querySelector('.' + cl + ' span');
                    if (elem.innerHTML == "") {
                        let parent = elem.parentElement;
                        parent.replaceChild(elem.cloneNode(true), elem);
                    }
                });
                let rook = e.target, rookParent = rook.parentElement;
                let kingTarget, rookTarget;
                if (isRight == 2 && rookParent.classList.contains(letters[letters.indexOf(id[0]) + 3] + id[1])) {
                    kingTarget = document.querySelector('.' + letters[letters.indexOf(id[0]) + 2] + id[1] + ' span');
                    rookTarget = document.querySelector('.' + letters[letters.indexOf(id[0]) + 1] + id[1] + ' span');
                    kingTarget.addEventListener('click', () => { showPoses(kingTarget) });
                    rookTarget.addEventListener('click', () => { showPoses(rookTarget) });
                }
                if (isLeft == 3 && rookParent.classList.contains(letters[letters.indexOf(id[0]) - 4] + id[1])) {
                    kingTarget = document.querySelector('.' + letters[letters.indexOf(id[0]) - 2] + id[1] + ' span');
                    rookTarget = document.querySelector('.' + letters[letters.indexOf(id[0]) - 1] + id[1] + ' span');
                    kingTarget.addEventListener('click', () => { showPoses(kingTarget) });
                    rookTarget.addEventListener('click', () => { showPoses(rookTarget) });
                }

                //---Check Check---------
                if (item.color == "black_figure") {
                    castleButNotShow(rook, rookParent, rookTarget, kingTarget, item, figure);
                    if (bKingObj.checkCheck() == false) {
                        reCastleButNotShow(rook, rookParent, rookTarget, kingTarget, item, figure);
                        move();
                    } else {
                        reCastleButNotShow(rook, rookParent, rookTarget, kingTarget, item, figure);
                        rook.addEventListener('click', () => { showPoses(rook) });
                    }
                } else if (item.color == "white_figure") {
                    castleButNotShow(rook, rookParent, rookTarget, kingTarget, item, figure);
                    if (wKingObj.checkCheck() == false) {
                        reCastleButNotShow(rook, rookParent, rookTarget, kingTarget, item, figure);
                        move();
                    } else {
                        reCastleButNotShow(rook, rookParent, rookTarget, kingTarget, item, figure);
                        rook.addEventListener('click', () => { showPoses(rook) });
                    }
                }

                function move() {
                    if (!mute) {
                        if (item.color == "black_figure")
                            blackClickSound.play();
                        else
                            whiteClickSound.play();
                        setTimeout(() => {
                            document.addEventListener('click', playClick);
                        }, 1);
                    }
                    let rookObj = figuresObjArr.filter(el => { return el.fullId == rookParent.classList[0] })[0];
                    rookObj.move(rookTarget.parentElement.classList[0], true);
                    item.move(kingTarget.parentElement.classList[0], true);
                    classArr.forEach(cl => document.querySelector('.' + cl).classList.remove(showClass));
                    eatClassArr.forEach(cl => document.querySelector('.' + cl).classList.remove(showEatClass));
                    castlingPoses.forEach(cl => document.querySelector('.' + cl).classList.remove(showCastlingClass));
                    rook.parentElement.classList.remove(rookObj.color);
                    rookTarget.parentElement.classList.add(rookObj.color);
                    rook.innerHTML = "";
                    rookTarget.innerHTML = rookObj.symbol;
                    figure.parentElement.classList.remove(item.color);
                    kingTarget.parentElement.classList.add(item.color);
                    figure.innerHTML = "";
                    kingTarget.innerHTML = item.symbol;

                    eatClassArr.forEach(cls => {
                        document.querySelector('.' + cls + ' span').removeEventListener('click', eat);
                    });
                    classArr.forEach(cl => {
                        let it = document.querySelector('.' + cl + ' span');
                        if (it.innerHTML == "") {
                            let parent = it.parentElement;
                            parent.classList.remove(showClass);
                            parent.replaceChild(it.cloneNode(true), it);
                        }
                    });
                    castlingPoses.forEach(cl => document.querySelector('.' + cl + ' span').removeEventListener('click', castling));
                    castlingPoses.forEach(cl => document.querySelector('.' + cl).classList.remove(showCastlingClass));
                    castlingPoses = [];
                    savePose(rookObj, 'castling');
                    turn == "white_figure" ? turn = "black_figure" : turn = "white_figure";
                    changeTimer(turn);
                }
            }
        } else {
            castlingPoses.forEach(el => document.querySelector('.' + cl + ' span').removeEventListener('click', castling));
        }
    }
    // ------move ---------------------------------------------------------------------------------------------------
    classArr.forEach(cls => {

        function dragORclick(e) {
            showPoses(e.target);
            document.removeEventListener('click', playClick);
        }
        let target = document.querySelector('.' + cls + ' span');
        if (item.color == "black_figure") {
            moveButNotShow(target, figure, item);
            if (bKingObj.checkCheck() == false) {
                reMoveButNotShow(target, figure, item);
                isCheck();
                target.addEventListener('click', move);
            } else
                reMoveButNotShow(target, figure, item);
        } else if (item.color == "white_figure") {
            moveButNotShow(target, figure, item);
            if (wKingObj.checkCheck() == false) {
                reMoveButNotShow(target, figure, item);
                isCheck();
                target.addEventListener('click', move);
            } else
                reMoveButNotShow(target, figure, item);
        }

        function move() {
            if (!mute) {
                if (item.color == "black_figure")
                    blackClickSound.play();
                else
                    whiteClickSound.play();
                setTimeout(() => {
                    document.addEventListener('click', playClick);
                }, 1);
            }
            classArr.forEach(cl => document.querySelector('.' + cl).classList.remove(showClass));
            eatClassArr.forEach(cl => document.querySelector('.' + cl).classList.remove(showEatClass));
            castlingPoses.forEach(cl => document.querySelector('.' + cl).classList.remove(showCastlingClass));
            figure.innerHTML = "";
            target.innerHTML = item.symbol;
            figure.parentElement.classList.remove(item.color);
            target.parentElement.classList.add(item.color);
            item.move(target.parentElement.classList[0], true);
            target.addEventListener('click', dragORclick);

            target.removeEventListener('click', move);
            eatClassArr.forEach(cls => {
                document.querySelector('.' + cls + ' span').removeEventListener('click', eat);
            });
            castlingPoses.forEach(cl => document.querySelector('.' + cl).replaceChild(document.querySelector('.' + cl + ' span').cloneNode(true), document.querySelector('.' + cl + ' span')));
            castlingPoses.forEach(cl => document.querySelector('.' + cl + ' span').addEventListener('click', dragORclick));
            castlingPoses = [];
            isCheck();
            savePose(item);
            turn == "white_figure" ? turn = "black_figure" : turn = "white_figure";
            changeTimer(turn);
        }
    });
    // ------eat-----------------------------------------------------------------------------------------------------
    eatClassArr.forEach(cls => {
        let target = document.querySelector('.' + cls + ' span');
        let obj = figuresObjArr.filter(el => { return el.fullId == target.parentElement.classList[0] })[0];
        let sorceObj = figuresObjArr.filter(el => { return el.fullId == eater.parentElement.classList[0] })[0];
        if (item.color == "black_figure") {
            eatButNotShow(target, obj, sorceObj);
            if (bKingObj.checkCheck() == false) {
                reEatButNotShow(target, obj, sorceObj);
                target.addEventListener('click', eat);
            } else {
                reEatButNotShow(target, obj, sorceObj);
            }
        } else if (item.color == "white_figure") {
            eatButNotShow(target, obj, sorceObj);
            if (wKingObj.checkCheck() == false) {
                reEatButNotShow(target, obj, sorceObj);
                target.addEventListener('click', eat);
            } else {
                reEatButNotShow(target, obj, sorceObj);
            }
        }
    });
}

function isCheck() {
    wKing = document.querySelector('.' + wKingObj.fullId + ' span');
    bKing = document.querySelector('.' + bKingObj.fullId + ' span');
    if (bKingObj.checkCheck()) {
        bKing.parentElement.classList.add('check');
    } else
        bKing.parentElement.classList.remove('check');

    if (wKingObj.checkCheck()) {
        wKing.parentElement.classList.add('check');
    } else
        wKing.parentElement.classList.remove('check');
}

function eat(e) {
    let targetItem = e.target;
    if (!mute) {
        if (targetItem.color != "black_figure")
            blackClickSound.play();
        else
            whiteClickSound.play();
        setTimeout(() => {
            document.addEventListener('click', playClick);
        }, 1);
    }

    let obj = figuresObjArr.filter(el => { return el.fullId == targetItem.parentElement.classList[0] })[0];
    let sorceObj = figuresObjArr.filter(el => { return el.fullId == eater.parentElement.classList[0] })[0];
    sorceObj.color == "white_figure" ? wEatFiguresAarea.innerHTML += "<div>" + obj.symbol + "</div>" : bEatFiguresAarea.innerHTML += "<div>" + obj.symbol + "</div>";
    eatClassArr.forEach(cl => document.querySelector('.' + cl).classList.remove(showEatClass));
    classArr.forEach(cl => document.querySelector('.' + cl).classList.remove(showClass));
    castlingPoses.forEach(cl => document.querySelector('.' + cl).classList.remove(showCastlingClass));
    targetItem.parentElement.classList.remove(obj.color);
    figuresObjArr.splice(figuresObjArr.indexOf(obj), 1);
    eater.innerHTML = "";

    eater.parentElement.classList.remove(sorceObj.color);
    targetItem.parentElement.classList.add(sorceObj.color);
    sorceObj.move(targetItem.parentElement.classList[0], true);
    targetItem.innerHTML = sorceObj.symbol;
    eatClassArr.forEach(cls => {
        document.querySelector('.' + cls + ' span').removeEventListener('click', eat);
    });
    classArr.forEach(cl => {
        let it = document.querySelector('.' + cl + ' span');
        if (it.innerHTML == "") {
            let parent = it.parentElement;
            parent.classList.remove(showClass);
            parent.replaceChild(it.cloneNode(true), it);
        }
    });
    castlingPoses.forEach(cl => document.querySelector('.' + cl).replaceChild(document.querySelector('.' + cl + ' span').cloneNode(true), document.querySelector('.' + cl + ' span')));
    castlingPoses.forEach(cl => document.querySelector('.' + cl + ' span').addEventListener('click', () => {
        showPoses(document.querySelector('.' + cl + ' span'));
    }));
    castlingPoses = [];
    isCheck();
    savePose(obj)
    turn == "white_figure" ? turn = "black_figure" : turn = "white_figure";
    changeTimer(turn);
}


//----eat-----------
function eatButNotShow(target, obj, sorceObj) {

    target.parentElement.classList.remove(obj.color);
    eater.innerHTML = "";
    eater.parentElement.classList.remove(sorceObj.color);
    target.parentElement.classList.add(sorceObj.color);
    sorceObj.move(target.parentElement.classList[0], false);
    target.innerHTML = sorceObj.symbol;
    figuresObjArr.splice(figuresObjArr.indexOf(obj), 1);
}
function reEatButNotShow(target, obj, sorceObj) {

    target.parentElement.classList.add(obj.color);
    eater.innerHTML = sorceObj.symbol;
    eater.parentElement.classList.add(sorceObj.color);
    target.parentElement.classList.remove(sorceObj.color);
    sorceObj.move(eater.parentElement.classList[0], false);
    target.innerHTML = obj.symbol;
    figuresObjArr.push(obj);
}
//----move----------
function moveButNotShow(target, figure, item) {

    figure.innerHTML = "";
    target.innerHTML = item.symbol;
    figure.parentElement.classList.remove(item.color);
    target.parentElement.classList.add(item.color);
    item.move(target.parentElement.classList[0], false);
}
function reMoveButNotShow(target, figure, item) {

    figure.innerHTML = item.symbol;
    target.innerHTML = "";
    figure.parentElement.classList.add(item.color);
    target.parentElement.classList.remove(item.color);
    item.move(figure.parentElement.classList[0], false);
}

//----castling----------
function castleButNotShow(rook, rookParent, rookTarget, kingTarget, item, figure) {
    let rookObj = figuresObjArr.filter(el => { return el.fullId == rookParent.classList[0] })[0];
    rookObj.move(rookTarget.parentElement.classList[0], false);
    item.move(kingTarget.parentElement.classList[0], false);
    rook.parentElement.classList.remove(rookObj.color);
    rookTarget.parentElement.classList.add(rookObj.color);
    rook.innerHTML = "";
    rookTarget.innerHTML = rookObj.symbol;
    figure.parentElement.classList.remove(item.color);
    kingTarget.parentElement.classList.add(item.color);
    figure.innerHTML = "";
    kingTarget.innerHTML = item.symbol;
}

function reCastleButNotShow(rook, rookParent, rookTarget, kingTarget, item, figure) {
    let rookObj = figuresObjArr.filter(el => { return el.fullId == rookTarget.parentElement.classList[0] })[0];
    rookObj.move(rook.parentElement.classList[0], false);
    item.move(figure.parentElement.classList[0], false);
    rookTarget.parentElement.classList.remove(rookObj.color);
    rookParent.classList.add(rookObj.color);
    rookTarget.innerHTML = "";
    rook.innerHTML = rookObj.symbol;
    figure.parentElement.classList.add(item.color);
    kingTarget.parentElement.classList.remove(item.color);
    kingTarget.innerHTML = "";
    figure.innerHTML = item.symbol;
}

// ----promotion of pown----------------------------------------------------------------------------------------------------------
function showPromotionBar(fullId) {
    promotionBar.classList.add('active');
    const figure = document.querySelector('.' + fullId + ' span');
    const figureObj = figuresObjArr.filter(obj => { return obj.fullId == fullId })[0];
    let promotionFigsArr = [];
    if (figureObj.color == "black_figure") {
        promotionFigsArr.push(...["♞", "♝", "♜", "♛"]);
    } else {
        promotionFigsArr.push(...["♘", "♗", "♖", "♕"]);
    }
    promotionFiguresBox.innerHTML = "";
    promotionFigsArr.forEach(sym => {
        let item = document.createElement('div');
        item.innerHTML = sym;
        item.addEventListener('click', (e) => {
            figuresObjArr.splice(figuresObjArr.indexOf(figureObj), 1);
            addFigure(fullId[1], fullId[0], figure.parentElement.classList[2], sym);
            let newFigObj = figuresObjArr.filter(obj => { return obj.fullId == fullId })[0];

            console.log(fullId);
            console.log(figuresObjArr);
            console.log(newFigObj);

            figure.innerHTML = newFigObj.symbol;
            promotionBar.classList.remove('active');
            isCheck();
        });
        promotionFiguresBox.appendChild(item);
    })
}


