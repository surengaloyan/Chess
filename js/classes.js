// -----figures classes-----------------------------------------------------------------------------------------------------
class Pawn {
    constructor(numberId, letterId, color, symbol) {
        this.fullId = letterId + numberId;
        this.numberId = Number(numberId);
        this.letterId = letterId;
        this.color = color;
        this.symbol = symbol;
    }

    getPoses() {
        let poses = [];
        if (this.color == "black_figure") {
            if (this.numberId == 7) {
                let pose = document.querySelector('.' + this.letterId + (this.numberId - 1) + ' span');
                if (pose != null && pose.innerHTML == "") {
                    poses.push(this.letterId + (this.numberId - 1));
                    if (document.querySelector('.' + this.letterId + (this.numberId - 2) + ' span').innerHTML == "")
                        poses.push(this.letterId + (this.numberId - 2));
                }
            } else {
                let pose = document.querySelector('.' + this.letterId + (this.numberId - 1) + ' span');
                if (pose != null && pose.innerHTML == "")
                    poses.push(this.letterId + (this.numberId - 1));
            }
        } else {
            if (this.numberId == 2) {
                let pose = document.querySelector('.' + this.letterId + (this.numberId + 1) + ' span');
                if (pose != null && pose.innerHTML == "") {
                    poses.push(this.letterId + (this.numberId + 1));
                    if (document.querySelector('.' + this.letterId + (this.numberId + 2) + ' span').innerHTML == "")
                        poses.push(this.letterId + (this.numberId + 2));
                }
            } else {
                let pose = document.querySelector('.' + this.letterId + (this.numberId + 1) + ' span');
                if (pose != null && pose.innerHTML == "")
                    poses.push(this.letterId + (this.numberId + 1));
            }
        }
        return poses;
    }

    checkEat() {
        let poses = [];
        let id = letters.indexOf(this.letterId);
        if (this.color == "black_figure") {
            let leftArea = document.querySelector('.' + letters[id - 1] + (this.numberId - 1) + ' span');
            let rightArea = document.querySelector('.' + letters[id + 1] + (this.numberId - 1) + ' span');
            if (leftArea != undefined && leftArea.innerHTML != "" && leftArea.parentElement.classList.contains('white_figure'))
                poses.push(letters[id - 1] + (this.numberId - 1));
            if (rightArea != undefined && rightArea.innerHTML != "" && rightArea.parentElement.classList.contains('white_figure'))
                poses.push(letters[id + 1] + (this.numberId - 1));
        } else {
            let leftArea = document.querySelector('.' + letters[id - 1] + (this.numberId + 1) + ' span');
            let rightArea = document.querySelector('.' + letters[id + 1] + (this.numberId + 1) + ' span');
            if (leftArea != undefined && leftArea.innerHTML != "" && leftArea.parentElement.classList.contains('black_figure'))
                poses.push(letters[id - 1] + (this.numberId + 1));
            if (rightArea != undefined && rightArea.innerHTML != "" && rightArea.parentElement.classList.contains('black_figure'))
                poses.push(letters[id + 1] + (this.numberId + 1));
        }
        return poses;
    }

    move(id, game) {
        this.fullId = id;
        this.numberId = Number(id[1]);
        this.letterId = id[0];
        if (game) {
            if (this.color == "black_figure" && this.numberId == 1) {
                showPromotionBar(this.fullId);
            } else if (this.color == "white_figure" && this.numberId == 8) {
                showPromotionBar(this.fullId);
            }
        }
    }

}


class Rook {
    constructor(numberId, letterId, color, symbol) {
        this.fullId = letterId + numberId;
        this.numberId = Number(numberId);
        this.letterId = letterId;
        this.color = color;
        this.symbol = symbol;
        this.poses = [];
        this.eatPoses = [];
        this.castling = false;
    }


    changeIDs(i, fullID) {
        if (i == 1)
            return String(+fullID[0] - 1) + String(+fullID[1]);
        else if (i == 2)
            return String(+fullID[0] + 1) + String(+fullID[1]);
        else if (i == 3)
            return String(+fullID[0]) + String(+fullID[1] + 1);
        else
            return String(+fullID[0]) + String(+fullID[1] - 1);
    }

    checkDir(i) {
        let clr;
        this.color == "black_figure" ? clr = "white_figure" : clr = "black_figure";
        let fullID = String(letters.indexOf(this.letterId)) + String(this.numberId);
        fullID = this.changeIDs(i, fullID);
        let pose = document.querySelector('.' + letters[+fullID[0]] + +fullID[1] + ' span');
        if (pose !== null) {
            while (pose.innerHTML == "" || pose.parentElement.classList.contains(clr)) {
                if (pose.parentElement.classList.contains(clr)) {
                    this.eatPoses.push(letters[+fullID[0]] + +fullID[1]);
                    break;
                }
                this.poses.push(letters[+fullID[0]] + +fullID[1]);
                fullID = this.changeIDs(i, fullID);
                pose = document.querySelector('.' + letters[+fullID[0]] + +fullID[1] + ' span');
                if (pose === null) break;
            }
        }
    }

    getPoses() {
        this.eatPoses = [];
        this.poses = [];

        this.checkDir(1);
        this.checkDir(2);
        this.checkDir(3);
        this.checkDir(4);

        return this.poses;
    }

    checkEat() {
        return this.eatPoses;
    }

    move(id, game) {
        this.fullId = id;
        this.numberId = Number(id[1]);
        this.letterId = id[0];
        if (game)
            this.castling = true;
    }
}




class Knight {
    constructor(numberId, letterId, color, symbol) {
        this.fullId = letterId + numberId;
        this.numberId = Number(numberId);
        this.letterId = letterId;
        this.color = color;
        this.symbol = symbol;
        this.eatPoses = [];
    }

    getPoses() {
        this.eatPoses = [];
        let poses = [];
        let clr;
        this.color == "black_figure" ? clr = "white_figure" : clr = "black_figure";

        let indexes = [
            [letters[letters.indexOf(this.letterId) - 2], this.numberId + 1],
            [letters[letters.indexOf(this.letterId) - 1], this.numberId + 2],
            [letters[letters.indexOf(this.letterId) - 2], this.numberId - 1],
            [letters[letters.indexOf(this.letterId) - 1], this.numberId - 2],
            [letters[letters.indexOf(this.letterId) + 2], this.numberId - 1],
            [letters[letters.indexOf(this.letterId) + 1], this.numberId - 2],
            [letters[letters.indexOf(this.letterId) + 2], this.numberId + 1],
            [letters[letters.indexOf(this.letterId) + 1], this.numberId + 2]
        ]

        for (const index of indexes) {
            const newPose = document.querySelector('.' + index[0] + index[1] + ' span');
            if (newPose != null) {
                if (newPose.innerHTML == "") {
                    poses.push(index[0] + index[1])
                } else if (newPose.parentElement.classList.contains(clr)) {
                    this.eatPoses.push(index[0] + index[1]);
                }
            }

        }
        return poses;
    }

    checkEat() {
        return this.eatPoses;
    }

    move(id) {
        this.fullId = id;
        this.numberId = Number(id[1]);
        this.letterId = id[0];
    }
}




class Bishop {
    constructor(numberId, letterId, color, symbol) {
        this.fullId = letterId + numberId;
        this.numberId = Number(numberId);
        this.letterId = letterId;
        this.color = color;
        this.symbol = symbol;
        this.poses = [];
        this.eatPoses = [];
    }

    changeIDs(i, fullID) {
        if (i == 1) {
            return String(+fullID[0] - 1) + String(+fullID[1] + 1);
        } else if (i == 2)
            return String(+fullID[0] - 1) + String(+fullID[1] - 1);
        else if (i == 3)
            return String(+fullID[0] + 1) + String(+fullID[1] + 1);
        else
            return String(+fullID[0] + 1) + String(+fullID[1] - 1);
    }

    checkDir(i) {
        let clr;
        this.color == "black_figure" ? clr = "white_figure" : clr = "black_figure";
        let fullID = String(letters.indexOf(this.letterId)) + String(this.numberId);
        fullID = this.changeIDs(i, fullID);
        let pose = document.querySelector('.' + letters[+fullID[0]] + +fullID[1] + ' span');
        if (pose !== null) {
            while (pose.innerHTML == "" || pose.parentElement.classList.contains(clr)) {
                if (pose.parentElement.classList.contains(clr)) {
                    this.eatPoses.push(letters[+fullID[0]] + +fullID[1]);
                    break;
                }
                this.poses.push(letters[+fullID[0]] + +fullID[1]);
                fullID = this.changeIDs(i, fullID);
                pose = document.querySelector('.' + letters[+fullID[0]] + +fullID[1] + ' span');
                if (pose === null) break;
            }
        }
    }

    getPoses() {
        this.eatPoses = [];
        this.poses = [];

        this.checkDir(1);
        this.checkDir(2);
        this.checkDir(3);
        this.checkDir(4);
        return this.poses;
    }

    checkEat() {
        return this.eatPoses;
    }

    move(id) {
        this.fullId = id;
        this.numberId = Number(id[1]);
        this.letterId = id[0];
    }
}




class Queen {
    constructor(numberId, letterId, color, symbol) {
        this.fullId = letterId + numberId;
        this.numberId = Number(numberId);
        this.letterId = letterId;
        this.color = color;
        this.symbol = symbol;
        this.poses = [];
        this.eatPoses = [];
    }

    changeIDs(i, fullID) {
        if (i == 1)
            return String(+fullID[0] - 1) + String(+fullID[1] + 1);
        else if (i == 2)
            return String(+fullID[0] - 1) + String(+fullID[1] - 1);
        else if (i == 3)
            return String(+fullID[0] + 1) + String(+fullID[1] + 1);
        else if (i == 4)
            return String(+fullID[0] + 1) + String(+fullID[1] - 1);
        else if (i == 5)
            return String(+fullID[0] - 1) + String(+fullID[1]);
        else if (i == 6)
            return String(+fullID[0] + 1) + String(+fullID[1]);
        else if (i == 7)
            return String(+fullID[0]) + String(+fullID[1] + 1);
        else
            return String(+fullID[0]) + String(+fullID[1] - 1);
    }

    checkDir(i) {
        let clr;
        this.color == "black_figure" ? clr = "white_figure" : clr = "black_figure";
        let fullID = String(letters.indexOf(this.letterId)) + String(this.numberId);
        fullID = this.changeIDs(i, fullID);
        let pose = document.querySelector('.' + letters[+fullID[0]] + +fullID[1] + ' span');
        if (pose !== null) {
            while (pose.innerHTML == "" || pose.parentElement.classList.contains(clr)) {
                if (pose.parentElement.classList.contains(clr)) {
                    this.eatPoses.push(letters[+fullID[0]] + +fullID[1]);
                    break;
                }
                this.poses.push(letters[+fullID[0]] + +fullID[1]);
                fullID = this.changeIDs(i, fullID);
                pose = document.querySelector('.' + letters[+fullID[0]] + +fullID[1] + ' span');
                if (pose === null) break;
            }
        }
    }

    getPoses() {
        this.eatPoses = [];
        this.poses = [];

        this.checkDir(1);
        this.checkDir(2);
        this.checkDir(3);
        this.checkDir(4);
        this.checkDir(5);
        this.checkDir(6);
        this.checkDir(7);
        this.checkDir(8);

        return this.poses;
    }

    checkEat() {
        return this.eatPoses;
    }

    move(id) {
        this.fullId = id;
        this.numberId = Number(id[1]);
        this.letterId = id[0];
    }
}


class King {
    constructor(numberId, letterId, color, symbol) {
        this.fullId = letterId + numberId;
        this.numberId = Number(numberId);
        this.letterId = letterId;
        this.color = color;
        this.symbol = symbol;
        this.poses = [];
        this.eatPoses = [];
        this.castling = false;
        this.isCheck = false;
    }

    getPoses() {
        this.poses = [];
        this.eatPoses = [];
        let clr, sym;
        this.color == "black_figure" ? clr = "white_figure" : clr = "black_figure";
        this.symbol == "♚" ? sym = "♔" : sym = "♚";

        let poses = [
            this.letterId + (this.numberId + 1),
            this.letterId + (this.numberId - 1),
            letters[letters.indexOf(this.letterId) + 1] + this.numberId,
            letters[letters.indexOf(this.letterId) - 1] + this.numberId,
            letters[letters.indexOf(this.letterId) - 1] + (this.numberId - 1),
            letters[letters.indexOf(this.letterId) + 1] + (this.numberId + 1),
            letters[letters.indexOf(this.letterId) - 1] + (this.numberId + 1),
            letters[letters.indexOf(this.letterId) + 1] + (this.numberId - 1)
        ];
        let dangerPoses = [];
        for (const obj of figuresObjArr) {
            if (obj.color == clr && obj.symbol != "♚" && obj.symbol != "♔" && obj.symbol != "♟" && obj.symbol != "♙") {
                dangerPoses.push(...obj.getPoses());
            }
        }
        let king = figuresObjArr.filter(el => { return el.symbol == sym })[0];
        dangerPoses.push(...king.getKingPoses());
        poses.forEach(pos => {
            let thereIs = false;
            dangerPoses.forEach(dPos => {
                if (pos == dPos)
                    thereIs = true;
                else if (document.querySelector('.' + pos) != null && document.querySelector('.' + pos).classList.contains(clr)) {
                    this.eatPoses.push(pos);
                    thereIs = true;
                }
            });
            if (document.querySelector('.' + pos) != null && !document.querySelector('.' + pos).classList.contains(this.color) && thereIs == false)
                this.poses.push(pos);
        });

        dangerPoses.forEach(el => {
            this.eatPoses = this.eatPoses.filter(elem => { return el != elem })
        })

        return this.poses;
    }

    getKingPoses() {
        let poses = [
            this.letterId + (this.numberId + 1),
            this.letterId + (this.numberId - 1),
            letters[letters.indexOf(this.letterId) + 1] + this.numberId,
            letters[letters.indexOf(this.letterId) - 1] + this.numberId,
            letters[letters.indexOf(this.letterId) - 1] + (this.numberId - 1),
            letters[letters.indexOf(this.letterId) + 1] + (this.numberId + 1),
            letters[letters.indexOf(this.letterId) - 1] + (this.numberId + 1),
            letters[letters.indexOf(this.letterId) + 1] + (this.numberId - 1)
        ];
        return poses;
    }


    checkEat() {
        return this.eatPoses;
    }

    checkCheck() {
        let clr;
        this.color == "black_figure" ? clr = "white_figure" : clr = "black_figure";
        let dangerPoses = [];
        for (const obj of figuresObjArr) {
            if (obj.color == clr && obj.symbol != "♚" && obj.symbol != "♔") {
                obj.getPoses();
                dangerPoses.push(...obj.checkEat());
            }
        }
        let check = false;
        dangerPoses.forEach(dPose => { if (dPose == this.fullId) check = true });
        return check;
    }


    move(id, game) {
        document.querySelector('.' + this.fullId).classList.remove('check');
        this.fullId = id;
        this.numberId = Number(id[1]);
        this.letterId = id[0];
        if (game)
            this.castling = true;
    }
}


class Match {
    constructor(id, player1, player2, date, winner, poses) {
        this.id = id;
        this.player1 = player1;
        this.player2 = player2;
        this.date = date;
        this.winner = winner;
        this.poses = poses;
    }
}
