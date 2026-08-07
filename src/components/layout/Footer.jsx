import { Container } from '../ui/Section';
import { Wordmark } from './Header';
import { LinkedInIcon, WhatsAppIcon } from '../ui/BrandIcons';
import { CONTACT, SITE } from '../../lib/site';

const SOCIALS = [
  { href: CONTACT.whatsapp, label: 'WhatsApp', icon: WhatsAppIcon },
  { href: CONTACT.linkedin, label: 'LinkedIn', icon: LinkedInIcon },
];

export default function Footer() {
  return (
    <footer className="mt-[clamp(4rem,8vw,6.5rem)] border-t border-hairline py-[2.875rem] pb-14">
      <Container className="flex flex-wrap items-center justify-between gap-5">
        <Wordmark />

        <p className="m-0 text-[0.85rem] text-faint">
          © {new Date().getFullYear()} {SITE.owner}
        </p>

        <ul className="m-0 flex list-none gap-2 p-0">
          {SOCIALS.map(({ href, label, icon: Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="grid size-[38px] place-items-center rounded-xl border border-line text-muted transition-[color,border-color,transform] duration-500 ease-out-soft hover:-translate-y-[3px] hover:border-accent-line hover:text-accent"
              >
                <Icon size={16} />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}
