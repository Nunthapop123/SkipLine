import React from 'react';

interface AddOn {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface AddOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDone: (selectedAddOns: AddOn[]) => void;
  selectedAddOns: AddOn[];
  availableAddOns: AddOn[];
}

export default function AddOnModal({ isOpen, onClose, onDone, selectedAddOns, availableAddOns }: AddOnModalProps) {
  const [selections, setSelections] = React.useState<AddOn[]>(selectedAddOns);

  React.useEffect(() => {
    setSelections(selectedAddOns);
  }, [selectedAddOns]);

  const toggleAddOn = (addOn: AddOn) => {
    setSelections((prev) => {
      const isSelected = prev.some((item) => item.id === addOn.id);
      return isSelected
        ? prev.filter((item) => item.id !== addOn.id)
        : [...prev, addOn];
    });
  };

  const handleDone = () => {
    onDone(selections);
    onClose();
  };

  const totalAddOnCost = selections.reduce((sum, item) => sum + item.price, 0);

  if (!isOpen) return null;

  const groupedAddOns = availableAddOns.reduce<Record<string, AddOn[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  const orderedCategories = Object.keys(groupedAddOns).sort();

  const Section = ({ title, items }: { title: string; items: AddOn[] }) => (
    <div>
      <div className="flex items-center gap-4 mb-4">
        <span className="text-lg font-bold text-[#3D5690] whitespace-nowrap">{title}</span>
        <div className="flex-1 h-px bg-[#3D5690] opacity-30" />
      </div>
      <div className="space-y-3">
        {items.map((addOn) => {
          const selected = selections.some((s) => s.id === addOn.id);
          return (
            <button
              key={addOn.id}
              onClick={() => toggleAddOn(addOn)}
              className="w-full flex items-center gap-4 px-4 py-4 rounded-xl hover:bg-[#EDEBDF] transition-colors"
            >
              <div className={`w-7 h-7 rounded-full shrink-0 border-2 transition-all ${
                selected ? 'bg-[#3D5690] border-[#3D5690]' : 'bg-[#EDEBDF] border-[#3D5690]/40'
              }`} />
              <div className="flex-1 text-left">
                <p className="text-[#3D5690] font-semibold text-base">{addOn.name}</p>
              </div>
              <span className="text-[#3D5690] font-semibold text-base shrink-0">
                +${addOn.price.toFixed(2)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-[#EDEBDF] rounded-3xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">

          <div className="px-16 pt-14 pb-2">
            <h2 className="text-4xl font-bold text-[#3D5690]">Add on List</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-16 py-8">
            <div className="bg-[#D9D9D9]/60 rounded-2xl p-8 space-y-8">
              {orderedCategories.length === 0 && (
                <p className="text-[#3D5690] font-semibold">No add-ons available for this menu item.</p>
              )}
              {orderedCategories.map((category) => (
                <Section key={category} title={category} items={groupedAddOns[category]} />
              ))}
            </div>
          </div>

          <div className="px-16 py-8">
            <div className="flex items-center justify-between gap-6">
              <span className="text-[#3D5690] font-bold text-lg">
                Total: <span className="ml-3">+${totalAddOnCost.toFixed(2)}</span>
              </span>
              <div className="flex items-center gap-6">
                <button
                  onClick={onClose}
                  className="text-[#3D5690] font-semibold text-base hover:opacity-70 transition-opacity"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDone}
                  className="px-12 py-3 bg-[#3D5690] text-[#EDEBDF] font-bold text-base rounded-xl hover:bg-[#2F4477] transition-colors"
                >
                  Done
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}