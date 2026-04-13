interface ProductInfoProps {
  title: string;
  price: number;
  description: string;
}

export default function ProductInfo({ title, price, description }: ProductInfoProps) {
  return (
    <div>
      <div className="flex justify-between items-start mb-6">
        <h1 className="text-[40px] font-bold text-[#3D5690] leading-none">{title}</h1>
        <span className="text-[40px] font-bold text-[#3D5690] leading-none">${price}</span>
      </div>
      
      <p className="text-[#3D5690] text-lg font-semibold leading-relaxed mb-10 max-w-md">
        {description}
      </p>
    </div>
  );
}
