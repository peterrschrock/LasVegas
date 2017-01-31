## Las Vegas

[LasVegasLink] (https://peterrschrock.github.io/)

### About the Game

Las Vegas is a German board game created in 2012. The game relies heavily on chance, but there is some skill involved with estimating various probabilities. For 2-5 players.

At the beginning of each game, six casinos are set up, corresponding to the six faces of a dice. Each casino is assigned some amount of money (randomly.) Each player gets eight dice per round. In clockwise order, each player rolls their eight dice and selects one casino to bid on. Suppose Anne rolls 1,1,1,2,4,4,5,6 and decides to bid her 1's. In this case Anne bids all three of her dice that were 1's, leaving her with five remaining dice. The three 1's are placed on Casino 1. If at the end of the round, Anne has the most dice in the 1 Casino, she wins the money that was placed there at the beginning of the round. For each roll, a player must bid at least one die. If they roll multiple dice with the same number they must bid all of those dice, they cannot bid only some of them. So, in the example above, Anne could not have bid only two of her three 1's. The players roll in clockwise order until everyone is out of dice. Then, the winners get their money. If there is a draw, no one gets the money. Typically, players have different colored dice to distinguish who bid what.



Players can:

* View the Game instructions
* Start New Games with 2-5 Players
* Select Which of their dice to bid for each roll

This project is implemented in vanilla JavaScript and uses HTML canvas for the game board.

### Game Board

The game board displays:

* Each casino, including the number of dice bid at that casino bid by each player and a colored circle indicator of who would win that casino's money if the game were to end right now.
* Each player's name, color, money collected, and the number of dice they have remaining.
* The most recent bid, so that the user can easily understand what is happening.
* The dice, either in a rolling animation or after they are sorted.

A Five Player Game:
![selectDice] (docs/screenshots/select-dice.png)

A Three Player Game:
![threePlayers] (docs/screenshots/three-players.png)

The Instructions Page:
![instructions] (docs/screenshots/instructions.png)

```js

```


### Future Features
* Adding more logic so that the ai players play more intelligence.
* Adding dice animations to move the dice to the corresponding casinos after they are bid.
