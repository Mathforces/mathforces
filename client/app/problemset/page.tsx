import { Button } from "@/components/ui/button";

export default function LearningDashboard() {
  
  const problems = [
    { title: "Euclidean Theory", solved: "80.67%", diff: "Easy" },
    { title: "Pythagoras Game", solved: "80.23%", diff: "Med." },
    { title: "Newton and rough planes", solved: "97.45%", diff: "Hard" },
    { title: "Einstein fights Newton", solved: "23.56%", diff: "Med." },
    { title: "Einstein the flash", solved: "12.63%", diff: "Easy" },
    { title: "Plank and his constant", solved: "74.05%", diff: "Med." },
    { title: "Gojo's infinity limit", solved: "21.32%", diff: "Hard" },
  ];

  const trendingCompetitions = [
    { name: "Sat", participants: "123" },
    { name: "Kangaroo", participants: "345" },
    { name: "Shabola", participants: "341" },
  ];

  return (
    <main className="max-w-full min-h-screen mt-22 flex px-2">
      <aside className="bg-card px-6 py-7 hidden xl:block">
        <h2 className="text-[20px] font-semibold mb-10">Library</h2>

        <ul className="space-y-5 text-[15px]">
          <li className="flex items-center gap-3 font-medium">
            <span className="w-0.75 h-4 bg-blue-500 rounded-full" />
            Challenges
          </li>
          <li className="pl-6 text-gray-400">Our Courses</li>
        </ul>

        <p className="text-[13px] text-gray-500 mt-12 leading-relaxed">
          Log in to view lists and track study progress
        </p>

        <Button className="mt-4 w-full" link="/sign_in">Log In</Button>
      </aside>

      <section className="flex-1 px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          <div className="bg-linear-to-br from-gray-100 to-gray-200 text-black rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[22px] font-bold">Challenge™</h3>
              <p className="text-[14px] mt-2 text-black/60">
                Turn calculus into gamified progress
              </p>
            </div>
            <button className="mt-6 bg-black text-white px-5 py-3 rounded-xl text-sm w-fit hover:bg-gray-800 transition">
              Start Now
            </button>
          </div>

          <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[22px] font-bold">Linear Algebra</h3>
              <p className="text-[14px] mt-2">30 Days Challenge</p>
            </div>
            <button className="mt-6 bg-white text-blue-600 px-5 py-3 rounded-xl text-sm w-fit hover:bg-gray-100 transition">
              Learn Now
            </button>
          </div>

          <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[22px] font-bold">Top SAT Questions</h3>
              <div className="flex items-center gap-2 mt-2">
                <div className="px-2 py-1 bg-white/20 rounded text-xs font-medium">
                  DAY 30
                </div>
              </div>
            </div>
            <button className="mt-6 bg-white text-orange-600 px-5 py-3 rounded-xl text-sm w-fit hover:bg-gray-100 transition">
              Get Started
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-[18px] font-medium">Search questions</h3>
        </div>

        <div className="space-y-1.5">
          {problems.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-card px-6 py-3.5 rounded-xl hover:bg-background transition-colors"
            >
              <div className="flex items-center gap-6">
                <span className="text-gray-500 w-6">{i + 1}.</span>
                <span className="text-[15px]">{p.title}</span>
              </div>

              <div className="flex items-center gap-6 text-[13px]">
                <span className="text-gray-500">{p.solved}</span>
                <span
                  className={
                    p.diff === "Easy"
                      ? "text-green-400 bg-green-400/10 px-3 py-1 rounded-full"
                      : p.diff === "Med."
                        ? "text-yellow-400 bg-yellow-400/10 px-3 py-1 rounded-full"
                        : "text-red-400 bg-red-400/10 px-3 py-1 rounded-full"
                  }
                >
                  {p.diff}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <aside className="bg-card p-6 hidden xl:block">
        <h3 className="font-semibold mb-4 text-[15px]">Weekly Premium</h3>
        <div className="grid grid-cols-5 gap-2 mb-10">
          {["W1", "W2", "W3", "W4", "W5"].map((w, i) => (
            <div
              key={w}
              className={`p-3 rounded-xl text-center text-sm font-medium
                  ${
                    i === 1
                      ? "bg-blue-600 text-white"
                      : "bg-card "
                  }`}
            >
              {w}
            </div>
          ))}
        </div>

        <div className="text-xs text-gray-500 mb-4">
          <span>0</span>
          <span className="mx-2">•</span>
          <span>Incident</span>
          <span className="mx-2">•</span>
          <span>Rules</span>
        </div>

        <h3 className="font-semibold mb-4 text-[15px]">
          Trending Competitions
        </h3>

        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for competitions..."
              className="w-full bg-background text-sm py-2 px-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-3">
          {trendingCompetitions.map((comp, index) => (
            <div
              key={index}
              className="bg-background p-4 rounded-xl flex justify-between items-center hover:bg-card transition-colors"
            >
              <span className="text-[14px]">{comp.name}</span>
              <span className="font-bold text-[15px]">{comp.participants}</span>
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
