function Game(bool) {
	var self = this;
	this.playerTurn = true;
	this.chosenSpaces = [];
	this.board = {	1: '',
					2: '',
					3: '',
					4: '',
					5: '',
					6: '',
					7: '',
					8: '',
					9: ''
	};					// Key = square number
						// Value = occupant of square
	this.winningCombos = [[1,2,3],[4,5,6],[7,8,9],[1,5,9],[1,4,7],[2,5,8],[3,5,7],[3,6,9]];

	this.newGame = function() {
		// bool in Game constructor = true = 2p, false = cpu -- Implement later

		// Choose X and O and create players
		$('.instructions').css('display','block');
		$('.instructions').append('<button id="x">X</button><-- Choose your side --><button id="o">O</button>');
		$('button').each(function() {
			$(this).click(createPlayer);
		});
	};

	this.setClick = function(id) {
		// Adds id to chosenspaces
		self.chosenSpaces.push(id);
		self.chosenSpaces.sort();
		// Displays the updated board
		$('#box' + id).html(this.board[id]);

		// Turns off click events until next turn (important for CPU play)
		$('.square').each(function() {
			$(this).off();
		});
	};

	this.checkWin = function(team) {
		// Get only the values of current team
		var teamSquares = [];
		var len = Object.keys(this.board).length;
		for (var i = 1; i < len+1; i++) {

			if (this.board[i] === team) {
				teamSquares.push(i);
			}
		}

		// Compare X and O values in this.board vs this.winningCombos to see if anybody won
		for (var i = 0; i < this.winningCombos.length; i++) {
			var winCheck = true;
			this.winningCombos[i].forEach(function(number) {
				if (!teamSquares.includes(number)) {
					winCheck = false;
				}
			});

			if (winCheck) {
				this.endGame(this.winningCombos[i]);
				break;
			}
		}

		this.checkTie();
	};

	this.checkTie = function() {
		if (self.chosenSpaces.length > 8) {
			self.endGame();
		}

		self.nextTurn();
	};

	this.nextTurn = function() {
		if (self.playerTurn) {
			self.playerTurn = false;
			self.player2.getClick();
		} else {
			self.playerTurn = true;
			self.player1.getClick();
		}


	};

	this.endGame = function(winCombo) {
		if (arguments.length > 0) { // If a winning combo has been passed
			switch (self.playerTurn) {
				case true: // Player 1 wins
					alert('Player 1 wins!');
					break;
				case false: // Player 2 / CPU wins!
					alert('Player 2 wins!');
					break;
			}
		} else {
			alert("It's a tie!");
		}

		// TODO: Create a newgame prompt to start a new game

	};

	function createPlayer() {
		var teams = "xo";
		self.player1 = new Player(this.id);
		self.player2 = new Player(teams.replace(this.id,''));
		// Creates the 2 players, right now both human

		// Removes instructions window and starts the game
		$('.instructions').css('display','none');

		self.player1.getClick();
	}
}

function Player(team) {
	var self = this;
	this.team = team;
	
	this.getClick = function() {
		// Make all 9 squares clickable, after click make unclickable (important for CPU play), then 
		// setClick to the game
		$('.square').each(function() {
			$(this).click(function() {
					var adjustID = parseInt(this.id[this.id.length - 1]); // Selects only the number in the ID
					if (!game.board[adjustID]) { // Only works if game.board[adjustID] already exists
						game.board[adjustID] = self.team;
						game.setClick(adjustID);
						game.checkWin(self.team);
					}
			});
		});
	}
}

function Computer(team) {
	this.team = team;
}

function go() {
	game = new Game(true);
	game.newGame();
}

$(document).ready(go);