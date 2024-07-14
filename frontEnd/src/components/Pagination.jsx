import React from 'react'

export default function Pagination({currentPage, setCurrentPage, totalPages, setLimit, limit}) {
  return (
    <div className='flex justify-center gap-4 items-center text-white font-semibold text-[20px] mt-[50px]'>
    <button className="text-black bg-verde border-2 border-solid border-verde text-[20px] font-bold hover:text-white hover:bg-black  rounded-lg p-[10px] px-4 font-mono" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>Back</button>
    <span className='text-white text-[25px] font-semibold font-'>{currentPage}/{totalPages}</span>
    <button className="text-black bg-verde border-2 border-solid border-verde text-[20px] font-bold hover:text-white hover:bg-black  rounded-lg p-[10px] px-4 font-mono" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages}>Next</button>
    <select 
      className='bg-verde text-black text-[20px] font-semibold rounded-lg p-[13px] outline-none border-2 border-verde'
      value={limit} 
      onChange={(e) => setLimit(Number(e.target.value))}
    >
      <option value={5}>5</option>
      <option value={10}>10</option>
      <option value={20}>20</option>
  </select>
  </div>
  )
}