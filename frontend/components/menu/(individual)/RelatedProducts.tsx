import Image from 'next/image';

export default function RelatedProducts() {
  return (
    <div className="mt-32 w-[100vw] relative left-[50%] right-[50%] -ml-[50vw] -mr-[50vw]">
      
      <div className="mx-auto max-w-6xl px-4 flex flex-col">
         <h2 className="text-3xl font-bold text-[#3D5690] pl-2 mb-8">Related Products</h2>
      </div>
      
      <div className="w-full bg-[#D9D9D9]/50 py-16 border-y border-[#3D5690]/5">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex flex-col items-center group cursor-pointer">
                <div className="w-56 h-56 relative mb-6">
                  <Image 
                    src="/iceCoffee.png" 
                    alt="Ice Coffee Preview" 
                    fill 
                    className="object-contain drop-shadow-md group-hover:scale-105 transition-transform duration-300 p-2"
                  />
                </div>
                <h3 className="text-[#3D5690] font-bold text-xl mb-1.5">Ice Coffee</h3>
                <p className="text-[#3D5690] font-bold text-base opacity-80">$19.99</p>
              </div>
            ))}

          </div>
        </div>
      </div>

    </div>
  );
}
