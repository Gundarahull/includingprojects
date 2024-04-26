import { useState } from 'react'
import './App.css'

function App() {
  const [color, setColor] = useState('white')

  return (
    <>
      {/* //in the div we are assigning the colors
    //by these we are changing the colors */}


      <div className="flex flex-wrap justify-center items-center h-screen duration-200" style={{ backgroundColor: color }}>
        <h1 className="text-black text-center text-4xl py-10 w-full">BACK-Ground Changer</h1>

        <div className="flex justify-center w-full">
          <button className="bg-green hover:bg-green-600 text-green-800 font-bold py-2 px-4 rounded m-2" onClick={() => setColor('green')}>
            GREEN
          </button>
          <button className="bg-white hover:bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded m-2" onClick={() => setColor('white')}>
            WHITE
          </button>
          <button className="bg-olive-500  hover:bg-olive-600 text-olive-800 font-bold py-2 px-4 rounded m-2" onClick={() => setColor('olive')}>
            OLIVE
          </button>
          <button className="bg-brown-500  hover:bg-brown-600 text-brown-800 font-bold py-2 px-4 rounded m-2" onClick={() => setColor('brown')}>
            BROWN
          </button>
          <button className="bg-aqua-500  hover:bg-aqua-600 text-aqua-800 font-bold py-2 px-4 rounded m-2" onClick={() => setColor('aqua')}>
            AQUA
          </button>
        </div>
      </div>

    </>
  )
}

export default App
