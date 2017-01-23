## Las Vegas Board Game (with AI?)

### About the Game

Las Vegas is a German board game created in 2012. The game relies heavily on chance, but there is some skill involved with estimating various probabilities. For 2+ players. There are four rounds in the game.

At the beginning of each round, six casinos are set up, corresponding to the six faces of a dice. Each casino is assigned some amount of money (randomly.) Each player gets eight dice per round. In clockwise order, each player rolls their eight dice and selects one casino to bid on. Suppose Anne rolls 1,1,1,2,4,4,5,6 and decides to bid her 1's. In this case Anne bids all three of her dice that were 1's leaving her with five remaining dice. The three 1's are placed on Casino 1. If at the end of the round, Anne has the most dice in the 1 Casino, she wins the money that was placed there at the beginning of the round. For each roll, a player must bid at least one die. If they roll multiple dice with the same number they must bid all of those dice, they cannot bid only some of them. So, in the example above, Anne could not have bid only two of her three 1's. The players roll in clockwise order until everyone is out of dice. Then, the winners get their money for the round. If there is a draw, no one gets the money. Typically, players have different colored dice to distinguish who bid what. At the end of the four rounds, the player with the most money wins. I would probably make one round games to start though.

### Minimum Viable Product  

Users will be able to:

- [ ] Read a brief description of the rules
- [ ] Start and reset a game
- [ ] Play against AI's - MVP would be the AI's bidding at random from available moves
- [ ] Roll dice and bid at a casino
- [ ] See current money collected by each player
- [ ] See who won at the end
- [ ] Read a production Readme

### Wireframes

![gameplay](wireframes/game_play.png)
![menu](wireframes/rules_menu.png)

### Tech stack

I will use Javascript, jquery, webpack, html canvas, and easel.js to build this game

`board.js`: frontend to deal with showing the game board.

`vegas.js`: backend script that will deal with game logic.

`computer.js`: AI player's logic (if/when implemented).

### Implementation Timeline

**Day 1**:

- Get scripts set up and bundled appropriately
- Render dice object to html canvas element

**Day 2**:

- Be able to roll dice and bid graphically
- Write game logic

**Day 3**:

- Make sure menu acts appropriately
- Polish and add styling
- Be able to play a game with AI's that play randomly


**Day 4**:

- Work on AI logic


### Possible Bonus features

- [ ] Add some heuristics or ability to simulate possibilities to increase AI intelligence
