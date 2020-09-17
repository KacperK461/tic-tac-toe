const setGame = class {
    constructor() {
        this.turn = Math.round(Math.random()) === 0 ? 'O' : 'X';
        this.board = [null, null, null, null, null, null, null, null, null];
        this.winner = null;
    }

    addField(index) {
        if(!this.board[index - 1]) {
            this.board[index - 1] = this.turn === 'O' ? 'O' : 'X';
            if(this.board[0] && this.board[0] === this.board[1] && this.board[0] === this.board[2] ||
               this.board[3] && this.board[3] === this.board[4] && this.board[3] === this.board[5] ||
               this.board[6] && this.board[6] === this.board[7] && this.board[6] === this.board[8] ||
               this.board[0] && this.board[0] === this.board[3] && this.board[0] === this.board[6] ||
               this.board[1] && this.board[1] === this.board[4] && this.board[1] === this.board[7] ||
               this.board[2] && this.board[2] === this.board[5] && this.board[2] === this.board[8] ||
               this.board[0] && this.board[0] === this.board[4] && this.board[0] === this.board[8] ||
               this.board[2] && this.board[2] === this.board[4] && this.board[2] === this.board[6]) {
                this.winner = this.turn;
            }
            else {
                let isDraw = true;
                for(let field of this.board) {
                    if(field === null)
                        isDraw = false;
                }
                if(isDraw)
                    this.winner = 'draw';               
            }
            this.turn = this.turn === 'O' ? 'X' : 'O';
        }       
    }
};

module.exports = setGame;