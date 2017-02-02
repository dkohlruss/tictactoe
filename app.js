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

	this.setClick = function(id, team) {
		// Adds id to chosenspaces
		self.chosenSpaces.push(id);
		self.chosenSpaces.sort();
		// Displays the updated board
        console.log("updating board");
        this.board[id] = team;
		$('#box' + id).html(this.board[id]);
        console.log(this.board[id]);
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
        if (!winCheck) {
            this.checkTie();
        }
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
					console.log('Player 1 wins!');
					break;
				case false: // Player 2 / CPU wins!
					console.log('Player 2 wins!');
					break;
			}
		} else {
			console.log("It's a tie!");
		}

        $('.square').each(function() {
            $(this).off();
        });

		// TODO: Create a newgame prompt to start a new game

	};

	function createPlayer() {
	    // TODO: Use self.bool to determine human or computer
		var teams = "xo";
		self.player1 = new Player(this.id);
		self.player2 = new Computer(teams.replace(this.id,''));
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
						game.setClick(adjustID, self.team);
						game.checkWin(self.team);
					}
			});
		});
	}
}

function Computer(team) {
    var self = this;
	this.team = team;
	this.compSquares = [];

    // AI for computer processed in this function
	this.getClick = function() {
	    var choice = 0;
	    var blankSpaces = []; // Blank spaces
        var cornerSquares = [1,3,7,9];
        var sideSquares = [2,4,6,8];

	    // Iterate through most to least favorable conditions

        // Winning conditions satisfied (for win & block)
        var winningConditions = function(team) {
            var chooseThis = false;
            var newCombos = [];
            var len = Object.keys(game.board).length;
            var regMatch = new RegExp(team, 'g');
            var chosen = false;

            // Get list of free spaces
            for (var i = 1; i < len+1; i++) {
                if (game.board[i] === '') {
                    blankSpaces.push(i);
                }
            }
            // Iterate over each blank space
            for (var u = 0; u < blankSpaces.length; u++) {
                // Create an array of combinations that contain the current value being iterated over
                newCombos = game.winningCombos.filter(function(combo) {
                    return combo.indexOf(blankSpaces[u]) !== -1;
                }); // Returns a list of all combos available with current blank space

                // Ensures only 1 entry of each winning combo is
                newCombos = newCombos.filter(function(item, position) {
                    return newCombos.indexOf(item) === position;
                });

                // Loops over this new array
                for (var i = 0; i < newCombos.length; i++) {

                    // Sets toStr to = the contents of board values with newCombos[i] keys IE: 'XO '
                    var toStr = game.board[newCombos[i][0]] + game.board[newCombos[i][1]] +
                        game.board[newCombos[i][2]] + "";

                    // Checks each potential winning combination in this list of combos
                    // if the string exists and it contains 2 X's (and a blank), the choice is made
                    if (toStr.match(regMatch) && toStr.match(regMatch).length > 1) {
                        chosen = true;
                        break;
                    }

                }
                if (chosen) {
                    return blankSpaces[u];
                }
            }
            return -1; // Returns -1 if no choice found
            // Check the value of each entry in winCombos's array of entries, match pattern xx_, x_x, _xx (or with o's
        };

        // For non-winning conditions on corners and sides
        var choiceConditions = function(choices) {
            return choices.filter(function (square) {
                return blankSpaces.indexOf(square) > -1;
            }); // returns an array of all values in cornerSquares that are also in
        };


        // Iterates through possible choices below
        // Win conditions satisfied
        if (winningConditions(self.team) > 0) {
            console.log("Win!");
            game.setClick(winningConditions(self.team), self.team);
        }
        // Block conditions satisfied
        else if (winningConditions(game.player1.team) > 0) {
            console.log(winningConditions(game.player1.team));
            console.log("Block!");
            game.setClick(winningConditions(game.player1.team), self.team);
        }

        // Choose a corner
        else if (choiceConditions(cornerSquares)) {
            console.log("Corner?");
            console.log(choiceConditions(cornerSquares));
            var cornerChoices = choiceConditions(cornerSquares);
            cornerChoices = cornerChoices.sort(function() {
                return .5 - Math.random();
            }); // (Sort of) randomizes the array -- From http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
            console.log(cornerChoices[0]);
            game.setClick(cornerChoices[0], self.team);
        }

        // Choose the center
        else if (blankSpaces.indexOf(5) !== -1) {
            console.log(5);
            game.setClick(5, self.team);
        }

        // Choose a side
        else {
            console.log("Side");
            var sideChoices = choiceConditions(sideSquares);
            sideChoices = sideChoices.sort(function() {
                return .5 - Math.random();
            }); // (Sort of) randomizes the array -- From http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
            game.setClick(sideChoices[0], self.team);
        }

        game.checkWin(self.team);
	};


}

function go() {
	game = new Game(false);
	game.newGame();
}

$(document).ready(go);