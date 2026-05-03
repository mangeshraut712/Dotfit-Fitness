import { Dumbbell, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 flex items-center justify-center mx-auto mb-6">
          <Dumbbell className="w-8 h-8 text-primary" />
        </div>
        <div className="text-8xl font-black text-gray-100 leading-none mb-2 select-none">
          404
        </div>
        <h1 className="text-2xl font-black uppercase tracking-wider text-gray-900 mb-3">
          Page Not Found
        </h1>
        <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
          The page you're looking for doesn't exist. Head back to the main site to explore our programs, pricing, and team.
        </p>
        <a
          href="/"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-black uppercase tracking-widest text-xs px-6 py-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dotfit Fitness
        </a>
        <div className="mt-10 text-xs font-bold text-gray-300 uppercase tracking-widest">
          Dotfit Fitness · Baner, Pune
        </div>
      </div>
    </div>
  );
}
