type ProgressStepperProps = {
  status: string;
};

export default function ProgressStepper({ status }: ProgressStepperProps) {
  const s = status?.toUpperCase();

  const getCompletedStepCount = (value?: string) => {
    if (!value) return 1;
    if (value === "CONFIRMED") return 1;
    if (value === "PREPARING") return 2;
    if (value === "READY" || value === "READY_TO_PICK_UP" || value === "READY_FOR_PICKUP") return 3;
    if (value === "COMPLETED") return 3;
    return 1;
  };

  const completedCount = getCompletedStepCount(s);

  const steps = [
    { n: 1, label: "Confirmed" },
    { n: 2, label: "Preparing" },
    { n: 3, label: "Ready to pick up" },
  ];

  return (
    <div className="mb-8 flex justify-center">
      <div className="flex items-start">
        {steps.map((step, idx) => {
          const completed = step.n <= completedCount;
          const inactive = step.n > completedCount;

          return (
            <div key={step.n} className="flex items-start">
              <div className="flex w-36 shrink-0 flex-col items-center gap-3 sm:w-48">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full text-base font-bold
                    ${completed ? "bg-[#3D5690] text-white" : ""}
                    ${inactive ? "border-2 border-[#3D5690]/30 bg-[#EDEBDF] text-[#3D5690]/40" : ""}
                  `}
                >
                  {completed ? (
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
                    ${step.n < completedCount ? "bg-[#3D5690]" : "bg-[#3D5690]/35"}
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
