interface SweetnessSelectorProps {
  levels: string[];
  selectedLevel: string;
  onLevelChange: (level: string) => void;
}

export default function SweetnessSelector({ levels, selectedLevel, onLevelChange }: SweetnessSelectorProps) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-bold text-[#3D5690] mb-3">Sweetness</h3>
      <div className="flex flex-wrap gap-2.5">
        {levels.map((lvl) => (
          <button 
            key={lvl}
            onClick={() => onLevelChange(lvl)}
            className={`px-5 py-3 rounded-xl text-base transition-all border-2 font-bold ${selectedLevel === lvl ? 'border-[#3D5690] bg-[#3D5690]/5 text-[#3D5690]' : 'border-transparent bg-[#D9D9D9]/80 text-[#3D5690] hover:bg-[#D9D9D9]'}`}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
}
