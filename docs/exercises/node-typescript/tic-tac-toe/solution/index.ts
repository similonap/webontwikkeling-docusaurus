import readline from 'readline-sync';

let board : string[][] = [[' ', ' ', ' '], [' ', ' ', ' '], [' ', ' ', ' ']];

let currentPlayer : string = 'X';
let moveCount : number = 0;

while (true) {
    console.log('  0 1 2');
    for (let i = 0; i < 3; i++) {
        let row = board[i].join('|');
        console.log(`${i} ${row}`);
        if (i < 2) console.log('  -----');
    }

    let move : string = readline.question(`Player ${currentPlayer}, enter your move (row,col): `);
    let split : string[] = move.split(',');
    let row : number = parseInt(split[0]);
    let col : number = parseInt(split[1]);

    if (row >= 0 && row < 3 && col >= 0 && col < 3) {
        if (board[row][col] === ' ') {
            board[row][col] = currentPlayer;
            moveCount++;

            let win = false;
            for (let i = 0; i < 3; i++) {
                if (board[i][0] === currentPlayer && board[i][1] === currentPlayer && board[i][2] === currentPlayer ||
                    board[0][i] === currentPlayer && board[1][i] === currentPlayer && board[2][i] === currentPlayer) {
                    win = true;
                }
            }
            if (board[0][0] === currentPlayer && board[1][1] === currentPlayer && board[2][2] === currentPlayer ||
                board[0][2] === currentPlayer && board[1][1] === currentPlayer && board[2][0] === currentPlayer) {
                win = true;
            }

            if (win) {
                console.log(`Player ${currentPlayer} wins!`);
                break;
            } else if (moveCount == 9) {
                console.log("It's a draw!");
                break;
            }

            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        } else {
            console.log('That spot is already taken, please choose another.');
        }
    } else {
        console.log('Invalid move, please try again.');
    }
}

export {}