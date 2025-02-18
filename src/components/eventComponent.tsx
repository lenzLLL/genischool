"use client"
import React from 'react'

export default function EventComponent({event}:{event:any}) {
  return (
    <div
    className="p-5 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-lamaSky even:border-t-lamaPurple"
    key={event?.id}
  >
    <div className="flex items-center justify-between">
      <h1 className="font-semibold text-gray-600">{event?.title}</h1>
      <span className="text-gray-300 text-xs">
      {event?.startTime && event?.startTime.toLocaleTimeString("en-UK", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })}
      </span>
    </div>
    <p className="mt-2 text-gray-400 text-sm">{event?.description}</p>
  </div>
  )
}
