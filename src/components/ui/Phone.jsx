import { cn } from '../../lib/cn';

/**
 * Celular desenhado em CSS (ver .phone no index.css). A tela é um contêiner
 * de consulta: o conteúdo dimensionado em cqw cresce e encolhe junto.
 * É sempre ilustração; quem usa descreve o conteúdo para leitores de tela.
 */
export default function Phone({ className, screenClassName, children }) {
  return (
    <div aria-hidden="true" className={cn('phone', className)}>
      <div className={cn('phone-screen', screenClassName)}>
        <span className="phone-island" />
        {children}
      </div>
    </div>
  );
}

/** Barra de status: hora à esquerda; sinal, wi-fi e bateria à direita. */
export function StatusBar({ time = '14:16', className }) {
  return (
    <div
      className={cn(
        'relative z-10 flex items-center justify-between px-[8cqw] pt-[4.4cqw] text-[3.9cqw] font-medium',
        className,
      )}
    >
      <span className="tabular-nums">{time}</span>
      <span className="flex items-center gap-[1.4cqw]">
        <span className="flex items-end gap-[0.5cqw]">
          {[1.4, 2, 2.6, 3.2].map((h) => (
            <span key={h} className="w-[0.8cqw] rounded-[0.3cqw] bg-current" style={{ height: `${h}cqw` }} />
          ))}
        </span>
        <span className="relative h-[3.4cqw] w-[6.4cqw] rounded-[1cqw] border-[0.35cqw] border-current/60 p-[0.4cqw]">
          <span className="block h-full w-[78%] rounded-[0.5cqw] bg-current" />
        </span>
      </span>
    </div>
  );
}
