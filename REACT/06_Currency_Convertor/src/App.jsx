import { useState } from "react";
import "./App.css";
import useCurrencyCustomHook from "./Custom_Hooks/01_CUreency";
import Input from "./Components/input";

function App() {
  // useCurrencyCustomHook("usd");
  const [amount, setAmount] = useState(0);
  //for the conversion button er are using this
  const [from, setFrom] = useState("usd"); // "usd" lo nunchi----- defaut usd petta
  const [to, setTo] = useState("inr"); // "inr" ki chnage ------ for default ga anthay

  //result amount we have to show how we changed
  const [convertedAmount, setConvertedAmount] = useState(0);

  //getting the hooks
  const gettingkeys = useCurrencyCustomHook(from);
  const options = Object.keys(gettingkeys);  //objects to project an array sorry mava
  //its hehehehe
  console.log(gettingkeys[to]);

  //swapping
  const swap = () => {
    setTo(from),
      setFrom(to),
      //test cheyalii
      setConvertedAmount(amount),
      setAmount(convertedAmount);
  };
  //final value on the conversion
  const convert = () => {
    console.log("parsed");
    const conversion = Number(amount) * gettingkeys[to];
    console.log("conversion", conversion);
    setConvertedAmount(conversion);
    console.log(options[to], parseFloat(amount), "multiply", conversion);
};

return (
  <div className="w-full h-screen flex justify-center items-center bg-cover bg-no-repeat" style={{ backgroundImage: `url('https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.freepik.com%2Ffree-photos-vectors%2Fcurrency-trading&psig=AOvVaw1VPds1oHEB5hxUhGefZib2&ust=1712283771308000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCPiexqLAp4UDFQAAAAAdAAAAABAR')` }}>
    <div className="w-full">
      <div className="w-full max-w-md mx-auto border border-gray-200 rounded-lg p-8 backdrop-blur-lg bg-white bg-opacity-80">
        <form onSubmit={(e) => { e.preventDefault(); convert(); }}>
          <div className="mb-4">
            <Input
              label="From"
              amount={amount}
              onAmountChange={(amount) => setAmount(amount)}
              onCurrencyChange={(currency) => setFrom(currency)}
              currencyoptions={options}
              selectedCurrency={from}
              className="mb-4"
            />
          </div>
          <div className="relative mb-4">
            <button
              type="button"
              className="absolute left-1/2 -translate-x-1/2 border-2 border-gray-300 rounded-md bg-gray-200 text-gray-700 px-4 py-2 hover:bg-gray-300 transition-colors duration-300"
              onClick={swap}
            >
              Swap
            </button>
          </div>
          <div className="mb-4">
            <Input
              label="To"
              amount={convertedAmount}
              currencyoptions={options}
              onCurrencyChange={(currency) => setTo(currency)}
              onAmountChange={(convertedAmount) => setConvertedAmount(convertedAmount)}
              selectedCurrency={to}
              className="mb-4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Convert {from.toUpperCase()} to {to.toUpperCase()}
          </button>
        </form>
      </div>
    </div>
  </div>
);


}

export default App;
