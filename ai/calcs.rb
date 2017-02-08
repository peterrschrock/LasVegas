def probTableOneRoll(diceLeft)
  return [1] if diceLeft == 0
  arr = []
  rolls = []
  ans = Array.new(diceLeft + 1, 0)
  roll = Array.new(diceLeft, 1)
  final = Array.new(diceLeft, 6)
  rolls << roll
  while roll != final
    roll = incrementRoll(roll, diceLeft - 1)
    rolls << roll
  end
  rolls.each do |roll|
    num_moves = roll.uniq.length
    num_ones = roll.count(1)
    ans[num_ones] += 1 / (num_moves * (6 ** diceLeft)).to_f
    ans[0] += (num_moves - 1) / (num_moves.to_f * (6 ** diceLeft))
  end
  ans
end

def incrementRoll(roll, idx)
  newRoll = roll.dup
  newRoll[idx] = roll[idx] + 1
  if newRoll[idx] > 6
    newRoll[idx] = 1
    return incrementRoll(newRoll, idx - 1)
  end
  newRoll
end


def probTableAllRolls()
  ans = []
  0.upto(8) do |diceLeft|
    ans << probTableOneRoll(diceLeft)
  end
  ans
end

# p probTableAllRolls

def cumulativeTable()
  cum = []
  probs = probTableAllRolls()
  probs.each_with_index do |probEntry, diceLeft|
    if diceLeft < 2
      cum << probEntry
    else
      cumEntry = Array.new(diceLeft + 1, 0)
      probEntry.each_with_index do |prob, diceSpent|
        next if diceSpent == 0
        cum[diceLeft - diceSpent].each_with_index do |lookup_val, lookup_idx|
          cumEntry[diceSpent + lookup_idx] += prob * lookup_val
          cumEntry[lookup_idx] += prob * lookup_val * 5
        end
      end
      # cumEntry[0] = 1 - cumEntry.inject(:+)
      cum << cumEntry
    end
  end
  cum
end

p cumulativeTable()
