import Navbar from '../../../../components/Navbar'
import RegisterForm from '../../../../components/auth/RegisterForm'
import { ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center pt-24 px-4 pb-12">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-[#3D5690] rounded-2xl mb-6 shadow-sm"></div>
          <h1 className="text-5xl font-bold text-[#3D5690] mb-2">SkipLine</h1>
          <p className="text-[#3D5690] text-lg">Create your account to start ordering</p>
        </div>
        
        <RegisterForm />
        
        <div className="flex items-center justify-center gap-3 text-center w-full max-w-lg">
          <a href="/login" className="flex items-center gap-1.5 text-[#3D5690] opacity-90 text-base hover:opacity-100 transition-opacity mt-1">
            Already have an account? <span className="font-bold underline ml-1">Sign in</span> <ArrowRight size={18} />
          </a>
        </div>

      </main>
    </div>
  );
}

export default RegisterPage;