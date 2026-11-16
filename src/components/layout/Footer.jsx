import Container from '../ui/Container';
import { LinkedInIcon, WhatsAppIcon } from '../ui/BrandIcons';
import { CONTACT, SITE } from '../../lib/site';

const LINKS = [
  { href: CONTACT.whatsapp, label: `WhatsApp ${CONTACT.whatsappNumber}`, icon: WhatsAppIcon },
  { href: CONTACT.linkedin, label: 'LinkedIn', icon: LinkedInIcon },
];

/** Continua o fechamento escuro da página: mesma cor, separada por um fio. */
export default function Footer() {
  return (
    <footer className="bg-noite text-osso [--accent:var(--brasa)]">
      <Container className="grid gap-x-12 gap-y-10 border-t border-osso/15 py-[clamp(3rem,6vw,5rem)] md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="titulo text-[clamp(2.8rem,7vw,6.5rem)]">
            Felipe <em>Mendes</em>
          </p>
          <p className="mt-5 max-w-[26rem] text-nevoa">
            Landing pages sob medida para quem investe em anúncio. De Uberaba (MG) para todo o Brasil.
          </p>
        </div>

        <ul className="flex flex-col gap-4 self-end md:col-span-4 md:col-start-9">
          {LINKS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 underline decoration-osso/0 decoration-1 underline-offset-[7px] transition-[text-decoration-color] duration-300 hover:decoration-osso"
              >
                <Icon size={17} className="text-brasa" />
                {label}
                <span className="sr-only"> (abre em nova aba)</span>
              </a>
            </li>
          ))}
        </ul>

        <p className="text-[0.95rem] text-nevoa md:col-span-12">
          © {new Date().getFullYear()} {SITE.owner}
        </p>
      </Container>
    </footer>
  );
}
