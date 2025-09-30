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