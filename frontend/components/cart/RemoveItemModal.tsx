interface RemoveItemModalProps {
  isOpen: boolean;
  itemName: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function RemoveItemModal({ isOpen, itemName, onCancel, onConfirm }: RemoveItemModalProps) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onCancel} />

      <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
        <div className="w-full max-w-lg rounded-2xl bg-[#EDEBDF] p-7 md:p-8 shadow-2xl border border-[#3D5690]/20">
          <h3 className="text-[28px] font-bold text-[#3D5690] mb-4">Remove Item?</h3>
          <p className="text-[#3D5690]/80 text-base mb-7">
            Are you sure you want to remove <span className="font-bold text-[#3D5690]">{itemName}</span> from your cart?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 rounded-lg border-2 border-[#3D5690]/40 text-[#3D5690] font-bold text-base hover:bg-[#D9D9D9]/60 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 rounded-lg bg-[#3D5690] text-[#EDEBDF] font-bold text-base hover:bg-[#2F4477] transition-colors"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
