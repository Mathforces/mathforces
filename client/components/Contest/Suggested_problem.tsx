import { Radical } from "lucide-react";
import Link from "next/link";

const Content = [
  {
    title: "Beginner Problems",
    link: "/contests/beginner-problems",
    description:
      "A collection of problems suitable for beginners to get started with competitive programming.",
  },
  {
    title: "Beginner Problems",
    link: "/contests/beginner-problems",
    description:
      "A collection of problems suitable for beginners to get started with competitive programming.",
  },
  {
    title: "Beginner Problems",
    link: "/contests/beginner-problems",
    description:
      "A collection of problems suitable for beginners to get started with competitive programming.",
  },
];
const Suggested_problem = () => {
  return (
    <section className="w-full md:w-3/4 max-w-xl flex flex-col gap-5 my-5">
      <h4 className="flex items-center gap-2">
        <Radical size={30} strokeWidth={3} className="text-primary" />
        Suggested problem sets
      </h4>
      <div className="flex flex-col gap-5">
        {Content.map((item, i) => (
          <Link
            key={item.title + i}
            href={item.link}
            className="p-6 bg-primary rounded-2xl border border-primary group hover:-translate-y-0.5 hover:bg-transparent duration-100 cursor-pointer"
          >
            <h4 className="text-white group-hover:text-primary text-xl font-semibold mb-2">
              {item.title}
            </h4>
            <p className="text-white/70 group-hover:text-primary/70">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Suggested_problem;
