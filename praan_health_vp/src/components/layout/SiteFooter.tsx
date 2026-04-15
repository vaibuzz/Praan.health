import Link from "next/link";
import { Container } from "@/components/ui/container";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-ink/10 bg-ivory-warm/60">
      <Container className="py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="Praan Health"
              className="h-10 w-auto object-contain"
            />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-muted-ink">
              Premium longevity care for parents — doctor-led, family-visible,
              results-driven.
            </p>
          </div>

          <FooterColumn
            title="Programs"
            items={[
              { label: "Diabetes Reversal", href: "#programs" },
              { label: "Knee & Back Pain", href: "#programs" },
              { label: "Strength 50+", href: "#programs" },
              { label: "Longevity", href: "#programs" },
            ]}
          />

          <FooterColumn
            title="Company"
            items={[
              { label: "How it works", href: "#how-it-works" },
              { label: "Doctors", href: "#trust" },
              { label: "Results", href: "#metrics" },
              { label: "Careers", href: "#" },
            ]}
          />

          <FooterColumn
            title="Contact"
            items={[
              { label: site.email, href: `mailto:${site.email}` },
              { label: site.phone, href: `tel:${site.phone.replace(/\s/g, "")}` },
              { label: "WhatsApp us", href: "#" },
            ]}
          />
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-ink/10 pt-6 text-sm text-muted-ink md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} Praan Health. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-ink">Privacy</Link>
            <Link href="#" className="hover:text-ink">Terms</Link>
            <Link href="#" className="hover:text-ink">Medical disclaimer</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/60">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5">
        {items.map((it) => (
          <li key={it.label}>
            <Link
              href={it.href}
              className="text-[15px] text-ink/80 hover:text-brand transition-colors"
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
