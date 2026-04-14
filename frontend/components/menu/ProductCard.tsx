import Image from 'next/image';

interface ProductCardProps {
  title: string;
  price: string;
  imageSrc: string;
  description?: string;
}

const ProductCard = ({ title, price, imageSrc, description }: ProductCardProps) => {
  return (
    <div className="bg-[#D9D9D9] rounded-2xl p-5 flex flex-col items-center shadow-sm w-full min-h-96">
      <div className="w-full flex justify-center mb-6 mt-4">
        <Image 
          src={imageSrc} 
          alt={title} 
          width={192} 
          height={192} 
          className="object-contain h-48 w-48 drop-shadow-md" 
        />
      </div>
      <div className="w-full flex flex-col items-start px-2 mt-auto">
        <h3 className="text-[#3D5690] font-bold text-xl leading-tight">{title}</h3>
        <p className="text-[#3D5690]/70 text-xs font-semibold mt-2 mb-5 leading-tight">
          {description || 'No description available.'}
        </p>
        <div className="w-full flex justify-between items-center gap-4">
          <span className="text-[#3D5690] font-bold text-xl">${price}</span>
          <button className="bg-[#3D5690] text-[#EDEBDF] font-bold text-sm px-6 py-2 rounded-lg hover:bg-opacity-90 transition-all focus:outline-none shadow-sm">
            View
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
