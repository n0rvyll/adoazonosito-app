export function LogoMonogramAJ({
  className,
  size = 40,
  title = "Adóazonosító jel generátor logó",
  desc = "Kör alakú monogram: A és J betűk, középen ponttal",
}: { className?: string; size?: number; title?: string; desc?: string }) {
  const titleId = "logo-title";
  const descId = "logo-desc";
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      role="img"
      aria-labelledby={`${titleId} ${descId}`}
    >
      <title id={titleId}>{title}</title>
      <desc id={descId}>{desc}</desc>
      <circle cx="32" cy="32" r="30" fill="currentColor" opacity="0.12" />
      <text x="20" y="40" fontFamily="Inter,ui-sans-serif,system-ui" fontWeight="800" fontSize="26" fill="currentColor">A</text>
      <circle cx="32" cy="33" r="2.4" fill="currentColor" />
      <text x="36" y="40" fontFamily="Inter,ui-sans-serif,system-ui" fontWeight="800" fontSize="26" fill="currentColor">J</text>
    </svg>
  );
}
