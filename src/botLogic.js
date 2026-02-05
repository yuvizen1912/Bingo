const { checkBingo } = require('./gameLogic');

class BingoBot {
    constructor() {
        this.card = this.generateCard();
        this.markedIndices = [12]; // 12 is the FREE space in the middle
    }

    generateCard() {
        let card = [];
        while(card.length < 25) {
            let n = Math.floor(Math.random() * 75) + 1;
            if(!card.includes(n)) card.push(n);
        }
        return card;
    }

    // The bot "listens" for a number and marks it if it exists
    processNumber(number) {
        const index = this.card.indexOf(number);
        if (index !== -1) {
            this.markedIndices.push(index);
        }
        return checkBingo(this.markedIndices);
    }
}

module.exports = BingoBot;