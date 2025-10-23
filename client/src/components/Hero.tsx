import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Clean_Zimbabwe_city_street_hero_9ef106d6.png";

export default function Hero() {
  return (
    <section className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/60" />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
          Build a Cleaner Community
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Report local issues, track their progress, and work together to improve your neighborhood. Your voice matters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/submit">
            <Button size="lg" className="w-full sm:w-auto" data-testid="button-submit-report">
              Submit a Report
            </Button>
          </Link>
          <Link href="/reports">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto backdrop-blur-sm bg-white/10 text-white border-white/30 hover:bg-white/20"
              data-testid="button-view-reports"
            >
              View Reports
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
