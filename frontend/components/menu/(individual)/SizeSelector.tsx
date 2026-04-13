import Image from 'next/image';

interface Size {
  name: string;
  volume: string;
  priceAdd: number;
  imageScale: number;
  icon: string;
}

interface SizeSelectorProps {
  sizes: Size[];
  selectedSize: string;
  onSizeChange: (size: string) => void;
}

export default function SizeSelector({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-bold text-[#3D5690] mb-3">Size</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sizes.map((s) => (
          <button 
            key={s.name}
            onClick={() => onSizeChange(s.name)}
            className={`flex flex-row justify-between items-center p-5 rounded-[16px] transition-all border-2 text-left w-full h-full ${selectedSize === s.name ? 'border-[#3D5690] bg-[#3D5690]/5' : 'border-transparent bg-[#D9D9D9]/80 hover:bg-[#D9D9D9]'}`}
          >
            <div className="flex flex-col items-start h-full justify-between">
              <div className="flex flex-col">
                <span className="font-bold text-[#3D5690] text-lg leading-tight">{s.name}</span>
                <span className="text-[#3D5690]/70 text-sm font-semibold mb-6 mt-1">{s.volume}</span>
              </div>
              <span className="font-bold text-[#3D5690] text-xl mt-auto leading-none">
                + ${s.priceAdd}
              </span>
            </div>

            <div className="flex flex-col justify-end items-center h-full ml-1 min-w-[36px]">
              <Image 
                src={s.icon}
                alt={`${s.name} size indicator`}
                width={s.imageScale}
                height={s.imageScale}
                className="object-contain opacity-80"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
