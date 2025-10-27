import { Button } from "@/components/ui/button";

export default function ContactPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Contact</h1>
      <p className="text-sm sm:text-base text-muted-foreground mb-4">Have questions or feedback? Reach me by email.</p>

      <div className="flex items-center gap-3">
        <Button asChild size="lg">
          <a href="mailto:omransoliman.tech@gmail.com" className="no-underline">Email Me</a>
        </Button>
        <span className="text-sm sm:text-base text-muted-foreground break-all">omransoliman.tech@gmail.com</span>
      </div>
    </main>
  );
}
