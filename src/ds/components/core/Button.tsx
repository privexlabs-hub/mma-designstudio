'use client';
import { useState, type CSSProperties, type MouseEventHandler, type ReactNode } from 'react';
import { Icon } from './Icon';

const SIZES = { sm: { h: 'var(--btn-h-sm)', px: 16, fs: 14, ic: 16 }, md: { h: 'var(--btn-h-md)', px: 22, fs: 16, ic: 18 }, lg: { h: 'var(--btn-h-lg)', px: 30, fs: 17, ic: 20 } };
const V = {
  primary: { bg: 'var(--action-primary)', hv: 'var(--action-primary-hover)', ac: 'var(--action-primary-active)', fg: '#fff', bd: 'transparent' },
  secondary: { bg: 'var(--cocoa-800)', hv: 'var(--cocoa-900)', ac: 'var(--cocoa-950)', fg: 'var(--cream-50)', bd: 'transparent' },
  outline: { bg: 'transparent', hv: 'var(--cream-200)', ac: 'var(--cream-300)', fg: 'var(--cocoa-800)', bd: 'var(--cocoa-800)' },
  ghost: { bg: 'transparent', hv: 'var(--icing-50)', ac: 'var(--icing-100)', fg: 'var(--icing-700)', bd: 'transparent' },
  gold: { bg: 'var(--gold-500)', hv: 'var(--gold-400)', ac: 'var(--gold-600)', fg: 'var(--cocoa-900)', bd: 'transparent' },
};
export type ButtonVariant = keyof typeof V;

export interface ButtonProps {
  variant?: ButtonVariant; size?: keyof typeof SIZES; icon?: string; iconRight?: string; fullWidth?: boolean; disabled?: boolean;
  onClick?: MouseEventHandler<HTMLElement>; href?: string; download?: string | boolean; type?: 'button' | 'submit' | 'reset'; children?: ReactNode; style?: CSSProperties;
}

/** Pill button. Hover one step darker, press darker + scale .97, disabled cream-200 / cocoa-500. */
export function Button({ variant = 'primary', size = 'md', icon, iconRight, fullWidth, disabled, onClick, href, download, type = 'button', children, style }: ButtonProps) {
  const [hover, setHover] = useState(false);
  const [press, setPress] = useState(false);
  const v = V[variant] || V.primary, s = SIZES[size] || SIZES.md;
  const css: CSSProperties = {
    display: fullWidth ? 'flex' : 'inline-flex', width: fullWidth ? '100%' : undefined, alignItems: 'center', justifyContent: 'center', gap: 8, height: s.h, padding: '0 ' + s.px + 'px',
    borderRadius: 'var(--radius-pill)', border: '2px solid ' + v.bd, background: disabled ? 'var(--cream-200)' : press ? v.ac : hover ? v.hv : v.bg, color: disabled ? 'var(--cocoa-500)' : v.fg,
    fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: s.fs, letterSpacing: 'var(--tracking-button)', textDecoration: 'none', whiteSpace: 'nowrap', cursor: disabled ? 'not-allowed' : 'pointer',
    transform: press && !disabled ? 'scale(.97)' : 'none', transition: 'background var(--dur-base) var(--ease-soft), transform var(--dur-fast) var(--ease-out)', boxSizing: 'border-box', ...style,
  };
  const ev = {
    onClick: disabled ? undefined : onClick,
    onMouseEnter: () => setHover(true), onMouseLeave: () => { setHover(false); setPress(false); },
    onMouseDown: () => setPress(true), onMouseUp: () => setPress(false),
  };
  const inner = <>{icon && <Icon name={icon} size={s.ic} />}{children}{iconRight && <Icon name={iconRight} size={s.ic} />}</>;
  return href
    ? <a href={href} download={download} aria-disabled={disabled || undefined} {...ev} style={css}>{inner}</a>
    : <button type={type} disabled={disabled} {...ev} style={css}>{inner}</button>;
}
