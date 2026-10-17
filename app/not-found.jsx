import Link from "next/link";
import { MapPinOff } from "lucide-react";

export default function NotFound() {
  return (
    <main id="main" className="shell py-16" tabIndex={-1}>
      <div className="outline-card max-w-lg p-8">
        <MapPinOff size={64} strokeWidth={2} className="mb-8 text-teal" aria-hidden="true" />
        <h1 className="text-3xl font-semibold">Yeh gali abhi khaali hai.</h1>
        <p className="mt-4">We couldn’t find this page. Chaliye, wapas Tech Thela par.</p>
        <Link className="button mt-8" href="/">Wapas chalein</Link>
      </div>
    </main>
  );
}
