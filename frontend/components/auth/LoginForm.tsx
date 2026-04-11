const LoginForm = () => {
  return (
    <div className="w-full max-w-lg bg-[#D9D9D9] rounded-3xl p-10 mb-8 shadow-sm">
      <h2 className="text-3xl font-bold text-[#3D5690] mb-3">Welcome back</h2>
      <p className="text-[#3D5690] text-base mb-8">Sign in to order ahead and skip the queue.</p>
      
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">Email or Username</label>
          <input type="text" placeholder="Email or Username" className="w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] focus:outline-none transition-all placeholder:text-[#3D5690]/60" />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-[#3D5690] font-semibold text-sm ml-1">Password</label>
          <input type="password" placeholder="Password" className="w-full bg-[#EDEBDF] text-[#3D5690] rounded-xl px-5 py-3.5 text-base font-medium border-2 border-transparent hover:border-[#3D5690]/50 focus:border-[#3D5690] focus:outline-none transition-all placeholder:text-[#3D5690]/60" />
        </div>
        
        <button className="w-full bg-[#3D5690] text-[#EDEBDF] rounded-xl py-3.5 text-base mt-2 font-bold hover:bg-[#2F4477] hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200">Sign in</button>
        
        <div className="text-center mt-3">
          <p className="text-[#3D5690] text-sm hidden sm:block">
            By continuing you agree to SkipLine&apos;s <a href="#" className="underline hover:opacity-80">Terms</a> and <a href="#" className="underline hover:opacity-80">Privacy Policy</a>
          </p>
          <p className="text-[#3D5690] text-xs sm:hidden">
            By continuing you agree to SkipLine&apos;s <br /><a href="#" className="underline hover:opacity-80">Terms</a> and <a href="#" className="underline hover:opacity-80">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;