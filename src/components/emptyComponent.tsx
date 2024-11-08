import React from 'react'

export default function EmptyComponent({msg}:{msg:string}) {
  return (
    <div className="w-full mt-10 flex items-center flex-col justify-center h-[50vh]">
              <img className="w-64 h-64" src ="/empty.png"/>
              <h1 style={{letterSpacing:"2px"}} className="font-bold">{msg}</h1>
            </div>
  )
}
