import Counter from '../motion/Counter';
import Reveal from '../motion/Reveal';
import { Container } from '../ui/Section';

const STATS = [
  { value: 7, unit: 'dias', label: 'até publicar' },
  { value: 1, unit: 'página', label: 'um só objetivo' },
  { value: 100, unit: '%', label: 'sob medida' },
  { value: 30, unit: 'dias', label: 'de ajustes inclusos' },
];

export default function Stats() {
  return (
    <div className="border-y border-hairline">
      <Container className="grid grid-cols-2 px-0 lg:grid-cols-4">
        {STATS.map((stat, index) => (
          <Reveal
            key={stat.label}
            delay={index * 0.08}
            className={[
              'border-hairline px-5 py-[2.125rem] text-center transition-colors duration-400 ease-smooth hover:bg-surface',
              index % 2 === 1 ? 'border-l' : '',
              index >= 2 ? 'border-t lg:border-t-0' : '',
              index === 2 ? 'lg:border-l' : '',
              index === 3 ? 'lg:border-l' : '',
            ].join(' ')}
          >
            <p className="m-0 text-[clamp(1.7rem,3.6vw,2.5rem)] font-semibold leading-none tracking-[-0.04em] tabular-nums">
              <Counter to={stat.value} />
              <small className="ml-px text-[0.5em] font-medium text-accent">{stat.unit}</small>
            </p>
            <p className="eyebrow m-0 mt-2.5 text-faint">{stat.label}</p>
          </Reveal>
        ))}
      </Container>
    </div>
  );
}
