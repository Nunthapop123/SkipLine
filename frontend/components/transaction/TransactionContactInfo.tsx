"use client";

type TransactionContactInfoProps = {
  name: string;
  email: string;
  phone: string;
  onNameChange: (value: string) => void;
};

export default function TransactionContactInfo({
  name,
  email,
  phone,
  onNameChange,
}: TransactionContactInfoProps) {
  return (
    <section>
      <h2 className="mt-10 text-[#3D5690] text-2xl font-bold leading-none md:text-2xl">Contract information</h2>
      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-[#3D5690] text-base font-bold leading-none md:text-lg">Name *</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className="h-13 w-full rounded-xl border-0 bg-[#D9D9D9] px-4.5 text-[#3D5690] placeholder:text-[#3D5690]/60 focus:outline-none md:h-12"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[#3D5690] text-base font-bold leading-none md:text-lg">E-mail</label>
            <input
              type="email"
              placeholder="Enter your e-mail"
              value={email}
              readOnly
              className="h-13 w-full rounded-xl border-0 bg-[#D9D9D9] px-4.5 text-[#3D5690] placeholder:text-[#3D5690]/60 opacity-85 focus:outline-none md:h-12"
            />
          </div>
          <div>
            <label className="mb-2 block text-[#3D5690] text-base font-bold leading-none md:text-lg">Phone number</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              value={phone}
              readOnly
              className="h-13 w-full rounded-xl border-0 bg-[#D9D9D9] px-4.5 text-[#3D5690] placeholder:text-[#3D5690]/60 opacity-85 focus:outline-none md:h-12"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
