export const COUPLE = {
  groom: 'Dananjaya',
  bride: 'Piyumi',
} as const;

export const GUEST_PREFIXES = ['Mr.', 'Mrs.', 'Miss', 'Mr. & Mrs.', 'Family', 'Dear'] as const;

export type GuestPrefix = (typeof GUEST_PREFIXES)[number];

// "Family" becomes a suffix and "Dear" is dropped, because the message greeting already starts with "Dear".
export const formatDisplayName = (prefix: string, name: string) => {
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (!trimmed) return '';
  if (prefix === 'Family') return `${trimmed} and Family`;
  if (!prefix || prefix === 'Dear') return trimmed;
  return `${prefix} ${trimmed}`;
};

export const buildInviteLink = (origin: string, displayName: string) =>
  `${origin}/${encodeURIComponent(displayName)}`;

export const buildInviteMessage = (displayName: string, link: string) => `Dear ${displayName} ❤️

With joyful hearts, we warmly invite you to celebrate one of the most special days of our lives as we begin our journey together.

Please view our wedding invitation and all the event details through the link below 🌐:

${link}

Your presence would truly mean the world to us, and we would be honored to celebrate this beautiful moment together.

With love,
❤️ ${COUPLE.bride} & ${COUPLE.groom}`;

// Reads the guest from /{displayName}, falling back to the older ?title=&name= links.
export const getInviteeFromLocation = (location: Location = window.location) => {
  const segment = location.pathname.replace(/^\/+|\/+$/g, '');
  if (segment && segment.toLowerCase() !== 'admin' && !segment.includes('/')) {
    try {
      return decodeURIComponent(segment).trim();
    } catch {
      return '';
    }
  }

  const params = new URLSearchParams(location.search);
  return formatDisplayName(params.get('title') || '', params.get('name') || '');
};
