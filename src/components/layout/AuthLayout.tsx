import { Outlet } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      <div className="hidden lg:flex flex-1 items-center justify-center bg-gradient-to-br from-primary via-primary/90 to-indigo-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-32 right-16 w-96 h-96 rounded-full bg-accent/30 blur-3xl" />
          <div className="absolute top-1/2 left-1/3 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        </div>

        <div className="relative z-10 text-center text-white px-12 max-w-lg">
          <div className="flex items-center justify-center w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm mx-auto mb-8">
            <GraduationCap className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-bold mb-4">EduConnect</h1>
          <p className="text-lg text-white/80 leading-relaxed">
            Üniversite hayatını tek bir platformda keşfet. Akademik destek, sosyal bağlantılar ve
            ekonomik fırsatlar seni bekliyor.
          </p>
          <div className="flex items-center justify-center gap-6 mt-10 text-white/60 text-sm">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">7/24</p>
              <p>AI Asistan</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">500+</p>
              <p>Öğrenci</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">20+</p>
              <p>İndirim</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
