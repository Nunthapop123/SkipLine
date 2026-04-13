interface AddOn {
  id: string;
  name: string;
  price: number;
}

interface AddOnDisplayProps {
  addOns: AddOn[];
  onEdit: () => void;
  onRemove: (id: string) => void;
}

export default function AddOnDisplay({ addOns, onEdit, onRemove }: AddOnDisplayProps) {
  return (
    <div className="mb-10">
      <div className="w-full flex justify-between items-center border-b-2 border-[#3D5690]/40 pb-3 mb-6 cursor-pointer hover:opacity-70 transition-opacity" onClick={onEdit}>
        <span className="text-[#3D5690] font-bold text-lg">Add On</span>
        <span className="text-[#3D5690] font-bold text-2xl leading-none">+</span>
      </div>
      
      {addOns.length > 0 && (
        <div className="w-full space-y-2.5">
          {addOns.map((addOn) => (
            <div key={addOn.id} className="w-full flex justify-between items-center bg-[#D9D9D9]/85 rounded-lg px-3 py-2.5">
              <div className="flex-1">
                <span className="text-[#3D5690] text-sm font-semibold">{addOn.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#3D5690] text-sm font-semibold">+ ${addOn.price.toFixed(2)}</span>
                <button
                  onClick={() => onRemove(addOn.id)}
                  className="text-[#3D5690]/60 hover:text-[#3D5690] font-bold text-lg transition-colors ml-2"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
