import Image from 'next/image'

const Categories = () => {
  return (
    <section className="container mx-auto px-4 pb-32">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-3xl font-bold text-[#3D5690] mb-3">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 lg:gap-6">
          <div className="flex flex-col items-center bg-[#D9D9D9] rounded-[20px] pt-4 pb-3 px-3 h-[220px] lg:h-[260px]">
            <span className="text-[#3D5690] font-bold text-sm lg:text-base">Hot Coffee</span>
            <div className="flex-1 flex items-end justify-center w-full mt-2">
              <Image src="/hotCoffee.png" alt="Hot Coffee" width={500} height={500} className="max-h-[180px] w-auto object-contain" />
            </div>
          </div>
          <div className="flex flex-col items-center bg-[#D9D9D9] rounded-[20px] pt-4 pb-3 px-3 h-[220px] lg:h-[260px]">
            <span className="text-[#3D5690] font-bold text-md lg:text-base">Ice Coffee</span>
            <div className="flex-1 flex items-end justify-center w-full mt-2">
              <Image src="/iceCoffee.png" alt="Cold Coffee" width={500} height={500} className="max-h-[180px] w-auto object-contain" />
            </div>
          </div>
          <div className="flex flex-col items-center bg-[#D9D9D9] rounded-[20px] pt-4 pb-3 px-3 h-[220px] lg:h-[260px]">
            <span className="text-[#3D5690] font-bold text-md lg:text-base">Tea & Matcha</span>
            <div className="flex-1 flex items-end justify-center w-full mt-2">
              <Image src="/tea.png" alt="Tea & Matcha" width={500} height={500} className="max-h-[180px] w-auto object-contain" />
            </div>
          </div>
          <div className="flex flex-col items-center bg-[#D9D9D9] rounded-[20px] pt-4 pb-3 px-3 h-[220px] lg:h-[260px] text-center">
            <span className="text-[#3D5690] font-bold text-md lg:text-base leading-tight">Frappes & Blended</span>
            <div className="flex-1 flex items-end justify-center w-full mt-2">
              <Image src="/frappes.png" alt="Frappes & Blended" width={500} height={500} className="max-h-[180px] w-auto object-contain" />
            </div>
          </div>
          <div className="flex flex-col items-center bg-[#D9D9D9] rounded-[20px] pt-4 pb-3 px-3 h-[220px] lg:h-[260px] text-center">
            <span className="text-[#3D5690] font-bold text-md lg:text-[15px] leading-tight">Non-Coffee & Refreshers</span>
            <div className="flex-1 flex items-end justify-center w-full mt-2">
              <Image src="/nonCoffee.png" alt="Non-Coffee & Refreshers" width={500} height={500} className="max-h-[180px] w-auto object-contain" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Categories