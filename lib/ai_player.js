const randomAllocationProbabilities = [
    [1],
    [
        0.8333333333333333, 0.16666666666666666
    ],
    [
        0.7175925925925926, 0.2314814814814815, 0.05092592592592593
    ],
    [
        0.6246249142661182, 0.26765046296296313, 0.09082433127572022, 0.016900291495198907
    ],
    [
        0.5497479284947693, 0.28273327554234773, 0.12479787046563078, 0.03654605179596619, 0.006174873701290464
    ],
    [
        0.48864005626357393,
        0.2855164354271376,
        0.15015503565828917,
        0.05770678884921891,
        0.015521958967025315,
        0.0024597248347752584
    ],
    [
        0.43814064334040925,
        0.2810906335062934,
        0.16790799043801888,
        0.07742338639459535,
        0.02741749220659768,
        0.006965867076680246,
        0.0010539870373371379
    ],
    [
        0.3959369812189038,
        0.27256806555053203,
        0.17941726939596964,
        0.09455244507402434,
        0.04026787327676963,
        0.013489377663121244,
        0.0032875690668217558,
        0.00048041875411542135
    ],
    [
        0.36030563533236026,
        0.26187008607465484,
        0.1860403149315499,
        0.10867374514430733,
        0.05300477512531394,
        0.021375725659127005,
        0.006875338146995475,
        0.0016234123967606596,
        0.00023096718818415668
    ]
];

class AIPlayer {
  static getMove(bills, casinos, whichPlayer, diceValuesArray){
    const diceLeftArr = this.getDiceLeft(casinos);
    const deficitArrays = this.getDeficits(casinos, whichPlayer, diceLeftArr);
    const winProbs = this.getWinProbs(deficitArrays, diceValuesArray, diceLeftArr[whichPlayer], diceLeftArr.length);
    let move = this.getBestMove(winProbs, bills);


    return move;
  }

  static getBestMove(winProbs, bills){
    let billVals = [];
    bills.forEach(casinoSlot => {
      let casinoArr = [];
      casinoSlot.forEach(bill => {
        casinoArr.push(bill.amount);
      });
      billVals.push(casinoArr);
    });

    let bestMove = winProbs[0][0];
    // let bestMoveValue = winProbs[0][1] * billVals[bestMove - 1];
    let bestMoveValue = 0;
    winProbs.forEach(winProb => {
      let value = 0;
      winProb[1].forEach((chance, idx) => {
        value += chance * billVals[idx][0];
      });
      if(value > bestMoveValue){
        bestMoveValue = value;
        bestMove = winProb[0];
      }
    });
    return bestMove;
  }

  static getWinProbs(deficitArrays, diceValues, diceLeft, numPlayers){
    const moves = this.unique(diceValues);
    let solutions = [];
    for (var i = 0; i < moves.length; i++) {
      const move = moves[i];
      let ifThisMoveArr = [];
      // const deficitArray = deficitArrays[move - 1];
      const diceSpent = diceValues.filter((x) => x == move).length;
      const remainingDice = diceLeft - diceSpent;
      const rands = randomAllocationProbabilities[remainingDice];
      for (var m = 0; m < deficitArrays.length; m++) {
        let deficitArray = deficitArrays[m].slice(0);

        for (var j = rands.length - 1; j > -1; j--) {
          for (var k = deficitArray.length - 1 - diceLeft; k > -1; k--) {
            let toAdd = j;
            if(move === m + 1){
              toAdd += diceSpent;
            }
            const probabilityMass = deficitArray[k] * rands[j];
            deficitArray[k + toAdd] += probabilityMass;
            deficitArray[k] -= probabilityMass;
          }
        }
        ifThisMoveArr.push(deficitArray);
      }

      let winsArr = [];
      ifThisMoveArr.forEach(defArr => {
        const ties = defArr[8];
        const wins = defArr.slice(9).reduce( (a,b) => a + b, 0);
        const winChance = wins + ties / ((numPlayers - 1) * 2);
        winsArr.push(winChance);
      });


      solutions.push([move, winsArr]);
    }
    return solutions;
  }

  static unique(arr) {
    var hash = {}, result = [];
    for ( var i = 0, l = arr.length; i < l; ++i ) {
        if ( !hash.hasOwnProperty(arr[i]) ) { //it works with objects! in FF, at least
            hash[ arr[i] ] = true;
            result.push(arr[i]);
        }
    }
    return result;
}

  static getDeficits(casinos, whichPlayer, diceLeftArr){
    let dummyCasinosBids = [];
    casinos.forEach(casino => {
      dummyCasinosBids.push(casino.diceBids.slice(0));
    });
    return dummyCasinosBids.map( bids => {
      const myDiceBid = bids[whichPlayer];
      let deficitArr = [0, 0, 0, 0, 0, 0, 0, 0, 0,
                        0, 0, 0, 0, 0, 0, 0, 0];
      deficitArr[myDiceBid + 8] = 1;
      for (var i = 0; i < bids.length; i++) {
        if(i !== whichPlayer){
          const cpuBidSoFar = bids[i];
          const cpuDiceLeft = diceLeftArr[i];
          const rands = randomAllocationProbabilities[cpuDiceLeft];
          for (var j = rands.length - 1; j > -1; j--) {
            const totalDicePlayed = j + cpuBidSoFar;
            const defArrIdx = 8 - totalDicePlayed + myDiceBid;
            for (var k = defArrIdx + 1; k < deficitArr.length; k++) {
              deficitArr[defArrIdx] += deficitArr[k] * rands[j];
              deficitArr[k] *= (1 - rands[j]);
            }
          }
        }
      }
      return deficitArr;
      // return myDiceBid - otherHighest;
    });
  }

  static getDiceLeft(casinos){
    const numPlayers = Object.keys(casinos[0].diceBids).length;
    const diceLeftArr = [];
    for (var i = 0; i < numPlayers; i++) {
      diceLeftArr.push(8);
    }
    for (var i = 0; i < numPlayers; i++) {
      casinos.forEach(casino => {
        diceLeftArr[i] -= casino.diceBids[i];
      });
    }
    return diceLeftArr;
  }
}

module.exports = AIPlayer;
