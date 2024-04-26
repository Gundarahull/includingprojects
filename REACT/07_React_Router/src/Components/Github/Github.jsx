import React, { useEffect, useState } from 'react'

function Github() {
    const [data, setData] = useState(0)
    useEffect(()=>{
        fetch('https://api.github.com/users/hiteshchoudhary')
        .then(response=>response.json())
        .then(data=>{
            console.log(data);
            setData(data)
        })
    })
    return (
        <div className="flex justify-center items-center">
          <h1 className="text-3xl">GITHUB FOLLOWERS: {data.followers}</h1>
        </div>
      )
      
}

export default Github
