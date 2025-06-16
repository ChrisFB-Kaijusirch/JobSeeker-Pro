/**
 * Creates a URL for the specified page name
 * @param pageName The name of the page to create a URL for
 * @returns The URL path for the specified page
 */
export function createPageUrl(pageName: string): string {
  const routes: Record<string, string> = {
    Dashboard: "/",
    Upload: "/upload",
    Applications: "/applications",
    Preferences: "/preferences"
  };
  
  return routes[pageName] || "/";
}

/**
 * Formats a date to a readable string
 * @param date The date to format
 * @returns Formatted date string
 */
export function formatDate(date: Date | string): string {
  if (!date) return '';
  
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Truncates text to a specified length
 * @param text The text to truncate
 * @param maxLength Maximum length before truncation
 * @returns Truncated text with ellipsis if needed
 */
export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}