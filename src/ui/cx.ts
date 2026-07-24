/** Tiny conditional classNames joiner — avoids a `classnames`/`clsx`
 * dependency for a three-line need. Falsy entries (including 0 and '') are
 * dropped, so `someNumber && styles.x` is safe to pass directly. */
export function cx(...classes: Array<string | number | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ');
}
