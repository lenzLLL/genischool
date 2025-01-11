import React from 'react'

import AttendanceLeft from '@/components/attendance/left'
import AttendanceRight from '@/components/attendance/right'
 
export default function page() {
  return (
    <div className='grid grid-cols-10 gap-5 p-5'>
        <AttendanceLeft/>
        <AttendanceRight/>
        
    </div>
  )
}
