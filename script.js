const gameboard = (function() {
    const board = [];

    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(square());
        }
    } 

    const getBoard = () => board;

    const markSquare = (row, column, player) => {    
        const selectedSquare = board[row][column];

        if (selectedSquare.getValue() !== 0) {
            console.log(new Error('Invalid input select another square'));
        } else {
            selectedSquare.setSquare(player)
        }

        showBoard();
    }

    const showBoard = () => {
        const boardValues =  board.map((row) => row.map((square) => square.getValue()))
        console.table(boardValues);
    }

    return {
        getBoard,
        showBoard,
        markSquare
    }
})();

function square() {
    let value = 0;
    
    const setSquare = function(player) {
        value = player;
    }

    const getValue = () => value;

    return {
        setSquare,
        getValue
    }
};

const gameFlow = (function() {
    const players = [
        {
            name: 'Player 1',
            symbol: 1
        },
        {
            name: 'Player 2',
            symbol: 2
        }
    ]

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = function() {
        if (activePlayer === players[0]) {
            activePlayer = players[1];
        } else {
            activePlayer = players[0];
        }
    }

    const newRound = function() {
        gameboard.showBoard();
        console.log(`It is ${activePlayer.name}'s turn...`)
    }

    const playGame = function(row, column) {
        console.log(`${activePlayer.name} is marking the square at (${row},${column})`);

        if (gameboard.markSquare(row, column, activePlayer.symbol) !== 'invalid') {
            const result = gameboard.checkForWinner(activePlayer.symbol);

            if (result === 'Win') {
                gameboard.showBoard();
                console.log('Game Over,',`${activePlayer.name} is the winner!!!`);
            } else {
                switchActivePlayer();
                newRound();
            }
        }
    }

    newRound();

    return{
        getActivePlayer,
        playGame
    }
})();