import { useState } from 'react'   //wehich we arr using to update the variables
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  let [counter, setCounter] = useState(0)    //creating a state variable and setting its initial value as zero
  //setcounter is a method or a funxtion who updates the counter

  //Count-Incremant
  const countvalue = (() => {
    console.log("COUNTER STARTED", counter);
    if (counter >= 10) {
      setCounter(10)
    } else {
      setCounter(counter + 1)     //this function will be

      //"""">>>>>>>>"INTERVIEW PERCEPTION MAN"
      
      //it has hidden call back dunction
      //the argument will get the result of previous one ---- menas its uppers one
      // setCounter((prev_counter)=>{
      //   prev_counter+ 1
      // })
      // setCounter((prev_counter)=>{
      //   prev_counter+ 1
      // })
      // setCounter((prev_counter)=>{
      //   prev_counter+ 1
      // })
    }
  })


  //Count decremant
  const removevalue = (() => {
    if (counter <= 0) {
      setCounter(0)
    } else {
      setCounter(counter - 1)
    }
  })

  return (

    <>

      <h1>Bouncer IN REACT-HOOKS</h1>
      <h2>Counter Value:{counter}</h2>
      <h2>UPdating the value : {counter}</h2>
      {/* anywhere Counter presnt it will update */}

      <button onClick={countvalue}>ADD VALUE</button>
      <br />
      <br />
      <button onClick={removevalue}>Remove VALUE:{counter}</button>
    </>
  )
}

export default App
