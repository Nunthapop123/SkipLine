"use client";

export default function TransactionContactInfo() {
  return (
    <section>
      <h2 className="mt-10 text-[#3D5690] text-2xl font-bold leading-none md:text-2xl">Contract information</h2>
      <div className="mt-5 space-y-4">
        <div>
          <label className="mb-2 block text-[#3D5690] text-base font-bold leading-none md:text-lg">Name *</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="h-12 w-full rounded-xl border-0 bg-[#D9D9D9] px-4 text-[#3D5690] placeholder:text-[#3D5690]/60 focus:outline-none md:h-10"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-[#3D5690] text-base font-bold leading-none md:text-lg">E-mail *</label>
            <input
              type="email"
              placeholder="Enter your e-mail"
              className="h-12 w-full rounded-xl border-0 bg-[#D9D9D9] px-4 text-[#3D5690] placeholder:text-[#3D5690]/60 focus:outline-none md:h-10"
            />
          </div>
          <div>
            <label className="mb-2 block text-[#3D5690] text-base font-bold leading-none md:text-lg">Phone number *</label>
            <input
              type="tel"
              placeholder="Enter your phone number"
              className="h-12 w-full rounded-xl border-0 bg-[#D9D9D9] px-4 text-[#3D5690] placeholder:text-[#3D5690]/60 focus:outline-none md:h-10"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
