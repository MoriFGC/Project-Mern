import React from 'react'

export default function Skeleton() {
  return (
    <div className="flex flex-col w-full h-full bg-[#000000] rounded-lg mt-5">
      <div className="h-[200px] 2xl:h-[380px] overflow-hidden bg-slate-700 animate-pulse rounded-t-lg"></div>
      <div className="text-white font-mono text-center pt-5 pb-5">
        <div className="h-8 bg-slate-700 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
        <div className="h-4 bg-slate-700 rounded w-1/2 mx-auto animate-pulse"></div>
      </div>
    </div>
  )
}
