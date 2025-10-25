const gameboard = (function() {
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
            return 'invalid';
        } else {
            selectedSquare.setSquare(player)
        }
    }

    const boardValues = () => board.map((row) => row.map((square) => square.getValue()));

    const showBoard = () => console.table(boardValues());

    const checkForWinner = function(playerSymbol) {
        const boardValue = boardValues();

        const winningCoords = [
            [boardValue[0][0],boardValue[1][0],boardValue[2][0]],

            [boardValue[0][1],boardValue[1][1],boardValue[2][1]],

            [boardValue[0][2],boardValue[1][2],boardValue[2][2]],

            [boardValue[0][0],boardValue[1][1],boardValue[2][2]],

            [boardValue[0][2],boardValue[1][1],boardValue[2][0]],

            [boardValue[0][0],boardValue[0][1],boardValue[0][2]],

            [boardValue[1][0],boardValue[1][1],boardValue[1][2]],

            [boardValue[2][0],boardValue[2][1],boardValue[2][2]]
        ];
        
        if (winningCoords.some((coordSet) => coordSet.every((coordinate) => coordinate === playerSymbol))) {
            return 'Win';
        }  
        else if (winningCoords.every((coordSet) => coordSet.every((coordinate) => coordinate !== 0))) {
            return 'Tie';
        }
    }

    return {
        getBoard,
        markSquare,
        checkForWinner
    }
})();

const gameFlow = (function() {
    const players = [
        {
            name: 'Player 1',
            symbol: 'X'
        },
        {
            name: 'Player 2',
            symbol: 'O'
        }
    ]

    const setPlayerName = function(name1, name2) {
        if (name1 !== '' && name2 === '') {
            players[0].name = name1;
        } else if (name2 !== '' && name1 === '') {
            players[1].name = name2;
        } else if(name1 !== '' && name2 !== '') {
            players[0].name = name1;
            players[1].name = name2;
        }
    }

    let activePlayer = players[0];

    const getActivePlayer = () => activePlayer;

    const switchActivePlayer = function() {
        if (activePlayer === players[0]) {
            activePlayer = players[1];
        } else {
            activePlayer = players[0];
        }
    }

    const resetActivePlayer = () => activePlayer = players[0];

    const newRound = function() {
        gameboard.showBoard();
        console.log(`It is ${activePlayer.name}'s turn...`)
    }

    const playGame = function(row, column) {
        if (gameboard.markSquare(row, column, activePlayer.symbol) !== 'invalid') {
            const result = gameboard.checkForWinner(activePlayer.symbol);

            if (result === 'Win' || result === 'Tie') {
                return result;
            } else {
                switchActivePlayer();
            }
        }
    }

    return{
        getActivePlayer,
        playGame,
        resetActivePlayer,
        setPlayerName
    }
})();

const displayController = (function() {
    const board = gameboard.getBoard();
    const boardDisplay = document.querySelector('.board');

    const updateBoardDisplay = function() {
        boardDisplay.textContent = '';
        board.forEach((row, rowIndex) => row.forEach((square, squareIndex) => {
            const boardButton = document.createElement('button');
            boardButton.classList.add('square');
            boardButton.dataset.row = rowIndex;
            boardButton.dataset.column = squareIndex;

            if (square.getValue() !== 0) {
                boardButton.textContent = square.getValue();
            }

            boardDisplay.append(boardButton);
        }))
    }

    const displayGameState = function(result) {
        const gameStateDiv = document.querySelector('.gameState');

        if (result === 'Win') {
            gameStateDiv.textContent = `Game Over, ${gameFlow.getActivePlayer().name} is the winner!!!`;
        } else if (result === 'Tie') {
            gameStateDiv.textContent = 'Game Over, no moves left to play. Tie game.';
        } else {
            gameStateDiv.textContent = `${gameFlow.getActivePlayer().name}'s turn.`;
        }
    }

    const boardClickHandler = function(event) {
        const row = event.target.dataset.row;
        const column = event.target.dataset.column;

        if (row === undefined) {
            return;
        }

        const result = gameFlow.playGame(row, column);

        if (result === 'Win' || result === 'Tie') {
            boardDisplay.removeEventListener('click', boardClickHandler);
        }

        updateBoardDisplay();
        displayGameState(result);
    }
    boardDisplay.addEventListener('click', boardClickHandler);

    const startScreen = document.querySelector('.startScreen');
    const boardContainer = document.querySelector('.boardContainer');
    const startButton = document.querySelector('.startButton');
    const player1Name = document.querySelector('#player1Name');
    const player2Name = document.querySelector('#player2Name');

    const startHandler = function() {
        gameFlow.setPlayerName(player1Name.value, player2Name.value);
        boardContainer.style.display = 'flex';
        startScreen.style.display = 'none';
        updateBoardDisplay();
        displayGameState();
    }
    startButton.addEventListener('click', startHandler);

    const restartButton = document.querySelector('.restartButton');

    const restartHandler = function() {
        board.forEach((row) => row.forEach((square) => square.setSquare(0)));
        gameFlow.resetActivePlayer();
        boardDisplay.addEventListener('click', boardClickHandler);
        updateBoardDisplay();
        displayGameState();
    }
    restartButton.addEventListener('click', restartHandler);
})();