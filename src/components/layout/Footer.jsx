import Container from '../ui/Container';
import { LinkedInIcon, WhatsAppIcon } from '../ui/BrandIcons';
import { CONTACT, SITE } from '../../lib/site';

const LINKS = [
  { href: CONTACT.linkedin, label: 'LinkedIn', icon: LinkedInIcon },
  { href: CONTACT.whatsapp, label: `WhatsApp ${CONTACT.whatsappNumber}`, icon: WhatsAppIcon },
];

/** Continua o fechamento escuro da página: mesma cor, separada por um fio. */
export default function Footer() {
  return (
    <footer className="bg-tinta text-papel [--accent:var(--marca)]">
      <Container className="grid gap-x-12 gap-y-10 border-t border-papel/15 py-[clamp(3rem,6vw,5rem)] md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="titulo text-[clamp(2.8rem,7vw,6.5rem)]">Felipe Mendes</p>
          <p className="mt-5 max-w-[26rem] text-bruma">
            {SITE.role}. {SITE.city} ({SITE.state}).
          </p>
        </div>

        <ul className="flex flex-col gap-4 self-end md:col-span-4 md:col-start-9">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 underline decoration-papel/0 decoration-1 underline-offset-[7px] transition-[text-decoration-color] duration-300 hover:decoration-papel"
              >
                <Icon size={17} className="text-marca" />
                {label}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-[0.95rem] text-bruma md:col-span-12">
          © {new Date().getFullYear()} {SITE.owner}. Site feito com React e GSAP.
        </p>
      </Container>
    </footer>
  );
}
