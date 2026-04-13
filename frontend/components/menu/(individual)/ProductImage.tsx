import Image from 'next/image';

interface ProductImageProps {
  image: string;
  title: string;
}

export default function ProductImage({ image, title }: ProductImageProps) {
  return (
    <div className="w-full lg:w-5/12 flex-shrink-0">
      <div className="w-full bg-[#D9D9D9]/80 rounded-[32px] aspect-square flex items-center justify-center p-12 shadow-sm border border-[#3D5690]/5 relative overflow-hidden">
        <Image 
          src={image} 
          alt={title} 
          fill
          className="object-contain p-6 drop-shadow-xl" 
        />
      </div>
    </div>
  );
}
