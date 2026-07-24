/**
 * Minimal inline SVG icon set for the ui/ library.
 *
 * The original Retayl components pulled these from `lucide-react` and the
 * workspace-only `@retayl/icons` package. Neither is a dependency here;
 * rather than adding a new icon library for six glyphs, they're inlined —
 * zero new dependencies, tiny, tree-shakes to nothing unused.
 */
import type { SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base(size: number, props: IconProps) {
  const { size: _s, ...rest } = props;
  return {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    ...rest,
  };
}

export function ChevronDownIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function CloseIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export function InfoIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4M12 8h.01" />
    </svg>
  );
}

export function SearchIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function CheckIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export function WarningIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)}>
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  );
}

export function SpinnerIcon({ size = 16, ...props }: IconProps) {
  return (
    <svg {...base(size, props)} className="ui-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
