const socket = io();
const playerBoardDiv = document.getElementById('player-board');
const botBoardDiv = document.getElementById('bot-board');
const status = document.getElementById('status');

let playerCard = [], botCard = [];

function generateCard() {
    let card = [];
    while(card.length < 25) {
        let n = Math.floor(Math.random() * 75) + 1;
        if(!card.includes(n)) card.push(n);
    }
    return card;
}

function createUIBoard(container, card, isBot) {
    container.innerHTML = '';
    card.forEach((num, i) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.id = isBot ? `bot-${num}` : `user-${num}`;
        cell.innerText = i === 12 ? 'FREE' : num;
        if(i === 12) cell.classList.add('marked');
        container.appendChild(cell);
    });
}

document.getElementById('startBtn').onclick = () => {
    playerCard = generateCard();
    botCard = generateCard();
    createUIBoard(playerBoardDiv, playerCard, false);
    createUIBoard(botBoardDiv, botCard, true);
    socket.emit('startGame');
};

socket.on('nextNumber', (num) => {
    status.innerText = `Number Called: ${num}`;
    
    // Player marking (Automatic for simplicity in this demo, or add click events)
    const userCell = document.getElementById(`user-${num}`);
    if(userCell) userCell.classList.add('marked');

    // Bot marking (The "Computer" logic)
    const botCell = document.getElementById(`bot-${num}`);
    if(botCell) botCell.classList.add('bot-marked');

    checkWin();
});

function checkWin() {
    // Basic win check logic would go here
    // For now, it's a race to see the boards fill up!
}