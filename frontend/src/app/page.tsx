import Image from "next/image";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#EDEBDF]">
      <main>
        <section className="container mx-auto px-4 py-32">
          <div className="mx-auto max-w-5xl">
            <h1 className="text-center text-6xl font-bold text-[#3D5690] mb-5">
              Your Drink, Ready When You Are
            </h1>
            <p className="text-center text-lg font-medium text-[#3D5690] mb-10">
              Skip the wait, not the quality. Order ahead and pick up your drink exactly when it's ready.
            </p>
            <div className="flex flex-row p-6 bg-[#D9D9D9] rounded-[20px]">
              <div className="flex flex-col w-3/4 mx-auto px-10 py-20">
                <h2 className="text-3xl font-bold text-[#3D5690] mb-3">
                  Why SkipLine?
                </h2>
                <p className="text-[#3D5690] mb-3">
                  SkipLine is a smarter way to get your daily drinks. We use a real-time queue system <br /> so you always know exactly how long your order will take
                  without guessing, waiting in line. Just order, show up, and enjoy.
                </p>
                <button className="text-start bg-[#3D5690] text-[#EDEBDF] rounded-[5px] px-4 py-2 w-fit">
                  Order Now
                </button>
              </div>
              <div className="w-1/4 mx-auto">
                <Image src="/kid-herosection.png" alt="Kid holding a cup" width={200} height={200} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
