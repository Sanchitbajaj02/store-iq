import Header from "@/components/home/header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <SidebarProvider defaultOpen={false}>
        <Header />
        <main className="flex-grow pt-16">
          {/* Hero Section */}
          <section className="relative overflow-hidden py-24 lg:py-32">
            {/* Gradient Background */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-50 text-neutral-600 text-xs font-semibold mb-8 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neutral-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-900"></span>
                </span>
                Analyze your store now!
              </div>
              <h1 className="text-heading font-bold tracking-tight mb-6">
                Get premium analysis <br className="hidden lg:block" />{" "}
                with modern tools
              </h1>
              <p className="max-w-2xl mx-auto text-normal text-neutral-400 mb-10 leading-relaxed">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa quis perferendis quos assumenda molestiae, commodi ad dolorem impedit maiores eligendi!
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-8 py-4 border bg-accent hover:bg-accent hover:text-accent-foreground font-semibold rounded-full transition-all shadow flex items-center justify-center gap-2 group"
                >
                  Start your journey
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" className="py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-heading font-bold mb-4">
                  Everything You Need to Scale
                </h2>
                <p className="text-normal text-neutral-400 max-w-2xl mx-auto">
                  Stop juggling multiple tools. Store IQ brings everything under
                  one sleek dashboard.
                </p>
              </div>
            </div>
          </section>
        </main>
      </SidebarProvider>
    </main>
  );
}
