import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-background border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-16">
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="relative w-8 h-9 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Image
                  src="/logo-light.png"
                  alt="RentNest Logo"
                  width={36}
                  height={36}
                  className="w-auto h-8 object-contain dark:hidden"
                />
                <Image
                  src="/logo-dark.png"
                  alt="RentNest Logo"
                  width={36}
                  height={36}
                  className="w-auto h-8 object-contain hidden dark:block"
                />
              </div>
              <span className="text-xl font-bold font-outfit text-foreground tracking-tight">
                RentNest
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Modern property rentals for everyone. Find your perfect home or
              manage your properties with ease.
            </p>
            <div className="flex gap-3 pt-2"></div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {["Home", "Properties", "About Us", "Contact"].map((link) => (
                <li key={link}>
                  <Link
                    href={link === "Home" ? "/" : `/${link.toLowerCase()}`}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-3">
              {[
                "Help Center",
                "Safety Information",
                "Cancellation Options",
                "Report an Issue",
              ].map((link) => (
                <li key={link}>
                  <Link
                    href="#"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Subscribe for latest properties and deals.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 text-sm rounded-xl border border-border bg-muted/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all">
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RentNest. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="#"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
