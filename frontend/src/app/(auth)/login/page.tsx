import Navbar from '../../../../components/Navbar'
import LoginForm from '../../../../components/auth/LoginForm'
import { ArrowRight } from 'lucide-react';

const LoginPage = () => {
  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center pt-24 px-4 pb-12">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-[#3D5690] rounded-2xl mb-6 shadow-sm"></div>
          <h1 className="text-5xl font-bold text-[#3D5690] mb-2">SkipLine</h1>
          <p className="text-[#3D5690] text-lg">Skip the queue, enjoy your coffee</p>
        </div>
        
        <LoginForm />
        
        <div className="flex flex-col items-center justify-center gap-3 text-center w-full max-w-lg">
          <p className="text-base text-[#3D5690]">
            Don't have an account? <a href="/register" className="font-bold hover:underline">Sign up</a>
          </p>
          <a href="/register" className="flex items-center gap-1 text-[#3D5690] opacity-70 text-base hover:opacity-100 transition-opacity mt-1">
            Staff Login <ArrowRight size={18} />
          </a>
        </div>

      </main>
    </div>
  );
}

export default LoginPage;