type ProgressStepperProps = {
  status: string;
};

export default function ProgressStepper({ status }: ProgressStepperProps) {
  const s = status?.toUpperCase();
  const current = s === "CONFIRMED" ? 1 : s === "PREPARING" ? 2 : 3;

  const steps = [
    { n: 1, label: "Confirmed" },
    { n: 2, label: "Preparing" },
    { n: 3, label: "Ready to pick up" },
  ];

  return (
    <div className="mb-8 flex justify-center">
      <div className="flex items-start">
        {steps.map((step, idx) => {
          const done = step.n < current;
          const active = step.n === current;
          const inactive = step.n > current;

          return (
            <div key={step.n} className="flex items-start">
              <div className="flex w-36 shrink-0 flex-col items-center gap-3 sm:w-48">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold
                    ${done ? "bg-[#3D5690] text-white" : ""}
                    ${active ? "border-2 border-[#3D5690] bg-[#EDEBDF] text-[#3D5690]" : ""}
                    ${inactive ? "border-2 border-[#3D5690]/30 bg-[#EDEBDF] text-[#3D5690]/40" : ""}
                  `}
                >
                  {done ? (
                    <svg viewBox="0 0 16 16" fill="none" className="h-5 w-5">
                      <path
                        d="M3 8l3.5 3.5L13 5"
                        stroke="white"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    step.n
                  )}
                </div>
                <p
                  className={`whitespace-nowrap text-center text-sm font-semibold
                    ${inactive ? "text-[#3D5690]/40" : "text-[#3D5690]"}
                  `}
                >
                  {step.label}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`mx-0.5 mt-[1.4rem] h-0.5 w-28 sm:mx-1 sm:w-44
                    ${step.n < current ? "bg-[#3D5690]" : "bg-[#3D5690]/35"}
                  `}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
