import { useState, useCallback,useEffect } from 'react'

import './App.css'

function App() {
  const [length, setLength] = useState(8)
  const [numcheck, setNumcheck] = useState(false)
  const [charcheck, setCharcheck] = useState(false)
  const [password, setpassword] = useState('')

  //using callback hook
  const smallchanges = useCallback(() => {
    let newpass = ""
    const allAlphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

    if (numcheck) {
      let nums = "0123456789"
      newpass += nums.charAt(Math.floor(Math.random() * 10))

    }
    if (charcheck) {
      const specialCharacters = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
      newpass += specialCharacters.charAt(Math.floor(Math.random() * specialCharacters.length));
    }
    for (let i = 0; i <= length-1; i++) {
      let randomchar = Math.floor(Math.random() * allAlphabets.length)
      const element = allAlphabets.charAt(randomchar)
      newpass = newpass + element
      
    }
    setpassword(newpass)

  }, [length, numcheck, charcheck])
  //dependencies when these have small changes then use this function

  useEffect(()=>{
    smallchanges();   //manam yendhulo aithe chnanges tesukoni ravali anukutamoo oo function indhulo undali
  },[smallchanges,length,numcheck,charcheck]) //for a changes aithe  dependencies 
  return (
   <>
   <div className="container mx-auto max-w-md p-8 bg-gray-100 rounded-lg shadow-lg">
  <h1 className="text-3xl font-bold text-center mb-8">PASSWORD GENERATOR</h1>

  <div className="mb-4">
    <input
      type="text"
      value={password}
      readOnly
      className="border border-gray-300 rounded-md px-4 py-2 w-full"
      placeholder="Generated Password"
    />
  </div>

  <div className="mb-4 flex items-center justify-between">
    <input
      type="range"
      min="8"
      max="20"
      value={length}
      className="w-full"
      //targteing the value to chnage the length
      //using not escape the value
      onChange={e => setLength(Number(e.target.value))}
    />
    <span className="ml-4 text-lg font-semibold">{length}</span>
  </div>

  <div className="mb-4 flex items-center">
    <input
      type="checkbox"
      checked={numcheck}
      // //event listener
      // ..changing true into false and false into true by prev
      onClick={() => {
        setNumcheck((prev)=>!prev)
      }}
      className="mr-2"
    />
    <label>Include Numbers</label>
  </div>

  <div className="mb-4 flex items-center">
    <input
      type="checkbox"
      checked={charcheck}
      // //event listener
      // ..changing true into false and false into true by prev
      onClick={() => {
        setCharcheck((prev)=>!prev)
      }}
      className="mr-2"
    />
    <label>Include Special Characters</label>
  </div>

  <div className="flex justify-center">
    <button className="btn btn-green">Copy Password</button>
  </div>
</div>

   </>
  );
}

export default App
