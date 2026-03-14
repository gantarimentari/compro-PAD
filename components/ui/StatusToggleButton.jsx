'use client';
export default function StatusToggleButton({ isActive, onClick, label, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className="flex h-10 w-10 items-center justify-center rounded-lg   text-accent-neutral-1000 transition duration-150 hover:bg-accent-neutral-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="5" width="16" height="10" rx="5" stroke="currentColor" strokeWidth="1.8" />
        <circle cx={isActive ? '13' : '7'} cy="10" r="3" fill="currentColor" />
      </svg>
    </button>
  );
}