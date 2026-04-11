import React from 'react'

const RegisterForm = () => {
  return (
    <div className="w-full max-w-lg bg-[#D9D9D9] rounded-3xl p-10 mb-8 shadow-sm">
      <h2 className="text-3xl font-bold text-[#3D5690] mb-3">Create your account</h2>
      <p className="text-[#3D5690] text-base mb-8">Fill in your details to get started</p>
      
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">Name</label>
          <input type="text" placeholder="Enter your name (John Doe)" className="w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] focus:outline-none transition-all placeholder:text-[#3D5690]/60" />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">Email</label>
          <input type="email" placeholder="Enter your email (e.g. johndoe@hotmail.com)" className="w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] focus:outline-none transition-all placeholder:text-[#3D5690]/60" />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">Phone number (optional)</label>
          <input type="text" placeholder="Enter your phone number (e.g. 0123456789)" className="w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] focus:outline-none transition-all placeholder:text-[#3D5690]/60" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">Password</label>
          <input type="password" placeholder="Enter your password" className="w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] focus:outline-none transition-all placeholder:text-[#3D5690]/60" />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">Confirm Password</label>
          <input type="password" placeholder="Confirm your password" className="w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] focus:outline-none transition-all placeholder:text-[#3D5690]/60" />
        </div>  
        
        <button className="w-full bg-[#3D5690] text-[#EDEBDF] rounded-xl py-3.5 text-base mt-2 font-bold hover:bg-[#2F4477] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">Sign up</button>
        
        <div className="text-center mt-3">
          <p className="text-[#3D5690] text-sm hidden sm:block">
            By creating an account you agree to SkipLine <a href="#" className="underline hover:opacity-80">Terms of Service</a> and <a href="#" className="underline hover:opacity-80">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterForm