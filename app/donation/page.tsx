import { Button } from "@/components/ui/button";

export default function DonationPage() {
  return (
    <main className="container mx-auto max-w-3xl px-4 py-8 sm:py-10">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Donation</h1>
      <p className="text-sm sm:text-base text-muted-foreground">Support the project to keep improving the learning experience.</p>

      <div className="mt-5">
        <Button asChild size="lg">
          <a
            href="https://www.paypal.com/donate/?hosted_button_id=UPDTVB75S3UBU"
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            Donate via PayPal
          </a>
        </Button>
      </div>
    </main>
  );
}
