
//>>>>>>""HOOKS""

//the functions which are returning the variable and a function are HOOKS
// function name(){
//     return []
// }
// console.log(name);

import { useEffect,useState } from "react";

//creating own custom HOOK

const useCurrencyCustomHook=((currency)=>{
    const [data,setData]=useState({})
    //giving input currency
    useEffect(()=>{
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
        .then(response => response.json())
        .then(res => {
            setData(res[currency]);
            // console.log("Data in fetch:", res[currency]); // Logging fetched data
        })
    },[currency]);
    //currency ni change chesthu untam kadha so dependencies lo currency pettam

    //data update ayiuntadhi kadha mava soo.. we are logging Data anamata "heheheheeh"
    // console.log("testing data",data);

    return  data; //returning
})

export default useCurrencyCustomHook
