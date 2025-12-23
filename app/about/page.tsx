import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Instagram, Github, Mail } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="container mx-auto max-w-4xl px-4 py-10 sm:py-14">
      <div className="mb-6 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">About</h1>
        <p className="text-base sm:text-lg text-muted-foreground mt-3">A short introduction and ways to connect.</p>
      </div>

      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-gradient-to-br from-primary/80 to-emerald-500/70 flex items-center justify-center text-white font-bold text-2xl sm:text-3xl select-none">
            OS
          </div>
          <div>
            <CardTitle className="text-2xl sm:text-3xl">Omran SOLIMAN</CardTitle>
            <p className="text-base text-muted-foreground mt-1">Developer</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-base sm:text-lg leading-relaxed">
            I am a developer focused on building friendly tools and learning experiences. This project aims to make programming more approachable for everyone.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <h2 className="text-lg font-semibold mb-1">Education</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                Université Lumière Lyon 2
              </p>
              <p className="text-sm sm:text-base text-muted-foreground">
                Computer Science
              </p>
            </div>
            <div className="rounded-lg border p-4">
              <h2 className="text-lg font-semibold mb-1">Contact</h2>
              <p className="text-sm sm:text-base text-muted-foreground break-all">omransoliman.tech@gmail.com</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Button asChild variant="outline" size="lg">
              <a
                href="https://www.instagram.com/omrans.soliman97/"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
                aria-label="Instagram @omrans.soliman97"
              >
                <Instagram className="size-4 mr-2" />
                @omrans.soliman97
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a
                href="https://github.com/omransoliman97"
                target="_blank"
                rel="noopener noreferrer"
                className="no-underline"
                aria-label="GitHub profile"
              >
                <Github className="size-4 mr-2" />
                github.com/omransoliman97
              </a>
            </Button>
            <Button asChild size="lg">
              <a
                href="mailto:omransoliman.tech@gmail.com"
                className="no-underline"
                aria-label="Send email"
              >
                <Mail className="size-4 mr-2" />
                Email Me
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
