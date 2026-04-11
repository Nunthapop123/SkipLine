import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-[#3D5690] mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="flex justify-between items-start mb-10">
            <div className="max-w-xs">
              <p className="text-white font-bold text-2xl mb-3">SkipLine</p>
              <p className="text-white/60 text-sm leading-relaxed">
                Skip the wait, not the quality. Order ahead and enjoy your drink when it's ready.
              </p>
            </div>
            <div>
              <p className="text-white/50 text-xs font-bold tracking-widest uppercase mb-4">Quick Links</p>
              <ul className="space-y-3">
                <li><a href="#" className="text-white/80 text-sm font-bold hover:text-white transition-colors">Menu</a></li>
                <li><a href="#" className="text-white/80 text-sm font-bold hover:text-white transition-colors">Track My Order</a></li>
                <li><a href="#" className="text-white/80 text-sm font-bold hover:text-white transition-colors">Sign In</a></li>
                <li><a href="#" className="text-white/80 text-sm font-bold hover:text-white transition-colors">Staff Portal</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/20 pt-6">
            <p className="text-white/50 text-sm">© 2026 SkipLine. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer