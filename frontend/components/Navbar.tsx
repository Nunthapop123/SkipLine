import React from 'react'

const Navbar = () => {
  return (
    <nav className="container mx-auto px-4 pt-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between">
          <span className="text-3xl font-bold text-[#3D5690]">SkipLine</span>
          <div className="flex items-center gap-6">
            <a href="#" className="text-[#3D5690] font-bold hover:opacity-80 transition-opacity">
              Menu
            </a>
            <button className="bg-[#3D5690] text-[#EDEBDF] font-bold rounded-[5px] px-6 py-2 hover:bg-opacity-90 transition-all">
              Order Now
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar