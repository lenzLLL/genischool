import React from 'react'
import { formatNumber } from './resultats/result-table'

export const ProgressBar = ({current,fixed,title}:{current:number,fixed:number,title:string}) => {
  let w = formatNumber((current/fixed)*100)
  return (
   <div className='flex flex-col items-center  justify-start gap-1 w-full'> 
    <div className='w-full bg-gray-400 rounded-lg relative'>
    <div style={{width:`${w}%`,background:"linear-gradient(to top, #0ea5e9, #4f46e5)"}} className={`h-5 text-white gap-3 text-sm font-bold rounded-lg  flex items-center justify-center`}>
    {parseInt(w.toString())>20 && <span >{w}%</span> }
   
    
    </div>
    {parseInt(w.toString())<=20 && <span className='absolute top-0 text-white right-0 left-0 pb-2 text-center' >{w}%</span> }
    </div>
    <div className='text-[#555] text-sm'>    <span className='mr-2'>{title}</span>    <span>{current}fcfa/{fixed}fcfa</span></div>
   </div>
  
)
}
