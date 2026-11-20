import type { ReactNode, SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;

function Base({ children, ...p }: P & { children: ReactNode }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...p}>
      {children}
    </svg>
  );
}

export const HomeIcon = (p: P) => <Base {...p}><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></Base>;
export const CommunityIcon = (p: P) => <Base {...p}><circle cx="9" cy="8" r="3.2" /><path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /><circle cx="17.5" cy="9" r="2.4" /><path d="M16.2 14.2c3 .3 5.3 2.5 5.3 5.3" /></Base>;
export const MinistryIcon = (p: P) => <Base {...p}><path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v13c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-13c-4.5 0-6.5.5-8 2Z" /><path d="M12 6.5v13" /></Base>;
export const ProductivityIcon = (p: P) => <Base {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Base>;
export const AiIcon = (p: P) => <Base {...p}><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4L12 3Z" /><path d="M18 15l.9 2.1L21 18l-2.1.9L18 21l-.9-2.1L15 18l2.1-.9L18 15Z" /></Base>;
export const SettingsIcon = (p: P) => <Base {...p}><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1Z" /></Base>;
export const PlusIcon = (p: P) => <Base {...p}><path d="M12 5v14M5 12h14" /></Base>;
export const SunIcon = (p: P) => <Base {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" /></Base>;
export const MoonIcon = (p: P) => <Base {...p}><path d="M21 12.8A8.5 8.5 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" /></Base>;
export const SearchIcon = (p: P) => <Base {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.2-3.2" /></Base>;
export const ChevronRightIcon = (p: P) => <Base {...p}><path d="m9 6 6 6-6 6" /></Base>;
export const ChevronLeftIcon = (p: P) => <Base {...p}><path d="m15 6-6 6 6 6" /></Base>;
export const CheckIcon = (p: P) => <Base {...p}><path d="m5 12 5 5L20 7" /></Base>;
export const XIcon = (p: P) => <Base {...p}><path d="M6 6l12 12M18 6 6 18" /></Base>;
export const AlertIcon = (p: P) => <Base {...p}><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16.5h.01" /></Base>;
export const ShareIcon = (p: P) => <Base {...p}><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M12 16V3" /><path d="m7 8 5-5 5 5" /></Base>;
export const DownloadIcon = (p: P) => <Base {...p}><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7" /><path d="M12 3v13" /><path d="m7 11 5 5 5-5" /></Base>;
export const TrashIcon = (p: P) => <Base {...p}><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></Base>;
export const SendIcon = (p: P) => <Base {...p}><path d="m4 12 16-8-6 16-3-6-7-2Z" /></Base>;
export const PlayIcon = (p: P) => <Base {...p}><path d="m8 5 11 7-11 7V5Z" /></Base>;
export const ShieldIcon = (p: P) => <Base {...p}><path d="M12 3l8 3v6c0 4.5-3.2 8-8 9-4.8-1-8-4.5-8-9V6l8-3Z" /></Base>;
export const ClockIcon = (p: P) => <Base {...p}><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></Base>;
export const TargetIcon = (p: P) => <Base {...p}><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="4.5" /><circle cx="12" cy="12" r="1.2" /></Base>;
export const ArrowRightIcon = (p: P) => <Base {...p}><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></Base>;
export const PauseIcon = (p: P) => <Base {...p}><path d="M9 5v14M15 5v14" /></Base>;
export const BookIcon = (p: P) => <Base {...p}><path d="M12 6.5C10.5 5 8.5 4.5 4 4.5v13c4.5 0 6.5.5 8 2 1.5-1.5 3.5-2 8-2v-13c-4.5 0-6.5.5-8 2Z" /><path d="M12 6.5v13" /></Base>;
export const Sparkle = (p: P) => <Base {...p}><path d="M12 3l1.8 4.6L18.5 9l-4.7 1.4L12 15l-1.8-4.6L5.5 9l4.7-1.4L12 3Z" /></Base>;
