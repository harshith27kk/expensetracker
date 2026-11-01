/** Format a number as Indian Rupees (₹) — used for display */
export function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(Math.abs(amount));
}

/**
 * Format a raw input string with Indian comma grouping as the user types.
 * e.g. "150000" → "1,50,000"   "1500.5" → "1,500.5"
 * Returns the formatted string, or the original if it can't be parsed.
 */
export function formatInputINR(raw) {
  // Allow only digits and one decimal point
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  const intPart = parts[0];
  const decPart = parts.length > 1 ? '.' + parts[1] : '';

  if (!intPart) return decPart ? '0' + decPart : '';

  // Indian grouping: last 3 digits, then groups of 2
  const lastThree = intPart.slice(-3);
  const rest = intPart.slice(0, -3);
  const formatted =
    rest.length > 0
      ? rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree
      : lastThree;

  return formatted + decPart;
}

/** Strip commas and return a plain numeric string ready for parseFloat */
export function stripCommas(str) {
  return String(str).replace(/,/g, '');
}
