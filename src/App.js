import './App.css';
import React from 'react';
import Die from './Die';
import {nanoid} from "nanoid"
import Confetti from "react-confetti";

function App() {

  const [dice, setDice] = React.useState(allNewDice())
  const [tenzies, setTenzies] = React.useState(false)
  const [countRolls, setCountRolls] = React.useState(0)
  const [lowestNum, setLowestNum] = React.useState(JSON.parse(localStorage.getItem("lowestNum")) || 0)

  // Check if all dice are held and have the same value; if yes, change tenzies to true. Save the lowest number of rolls in local storage.
  React.useEffect(() => {
    const allHeld = dice.every(die => die.isHeld)
    const firstValue = dice[0].value
    const allSameValue = dice.every(die => die.value === firstValue)
    if(allHeld && allSameValue) {
      setTenzies(true)
    }
    
    localStorage.setItem("lowestNum", JSON.stringify(lowestNum))


  }, [dice, lowestNum])

  // Generate a new die with a random number between 1-6, id and isHeld set to false.
  function generateNewDie() {
    return {
      value: Math.ceil(Math.random() * 6), 
      isHeld: false,
      id: nanoid()
    }
  }

  // Generate ten dice using generateNewDie function.
  function allNewDice() {
    const newArr = [];
    for (let i = 0; i < 10; i++) {
      newArr.push(generateNewDie());
    }
    return newArr;
  }

  
  function rollDice() {
    // If tenzies is false, increment countRolls, hold the chosen dice, and generate new dice if they're not held.
    if(!tenzies) {
      setCountRolls(prevCountRolls => prevCountRolls + 1)
      setDice(prevDice => prevDice.map(die => {
        return die.isHeld ? 
        die :
        generateNewDie()
      }))
    // If tenzies is true, find the lowest number of rolls, set tenzies to false, reset countRolls to 0, and generate new dice.
    } else {
      findLowestNum();
      setTenzies(false);
      setCountRolls(0); 
      setDice(allNewDice());    
    }
  }

  // Change the state of isHeld based on the id of die and the onclick event.
  function holdDice(id) {
    setDice(prevDice => prevDice.map(die => {
      return die.id === id ? 
      {...die, isHeld: !die.isHeld} :
      die
      })
    )
  }

  // Find the lowest number of rolls and update lowestNum if applicable.
  function findLowestNum() {
    if(lowestNum === 0) {
      setLowestNum(countRolls)
    }
    else {
      setLowestNum(prevLowestNum => (prevLowestNum < countRolls ? prevLowestNum : countRolls))
    }
  }

  // Map through the dice and add props to the Die component.
  const diceElements = dice.map(die => (
  <Die key={die.id} value={die.value} isHeld={die.isHeld} holdDice={() => holdDice(die.id)}/>
  ))

  return (
    <div>
      {tenzies && <Confetti />}
      <main>
        <h1 className="title">Tenzies</h1>
        <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
        <div className="container">
          {diceElements}
        </div>
        <button className="roll-dice" onClick={rollDice}>{tenzies ? "New Game" : "Roll"}</button>
        {lowestNum !== 0 && <p className="lowest-num">The lowest number of rolls: {lowestNum}</p>}
        {tenzies && <p className="final-num">The current number of rolls: {countRolls} </p> }
      </main>
    </div>
  );
}

export default App;
