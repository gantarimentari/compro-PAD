'use client';

const FILTER_BUTTONS = [
  { label: 'Semua', value: 'all' },
  { label: '7 Hari Terakhir', value: '7' },
  { label: '14 Hari Terakhir', value: '14' },
  { label: '30 Hari Terakhir', value: '30' },
  { label: '90 Hari Terakhir', value: '90' },
];

const NotificationFilterButton = ({ label, isActive, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`whitespace-nowrap flex-shrink-0 text-accent-neutral-1000 sm:px-6 px-3 sm:py-2.5 py-2 border-[1px] rounded-[8px] sm:text-body-2 text-body-5 transition-all duration-300 shadow-md ${
        isActive
          ? 'bg-accent-yellow-300 border-accent-yellow-400 scale-105'
          : 'bg-accent-neutral-250 border-2 hover:border-accent-neutral-250 hover:bg-accent-yellow-50'
      }`}
    >
      {label}
    </button>
  );
};

export default function NotificationFilterButtons({ activeFilter, onFilterChange }) {
  return (
    <div className="w-full overflow-x-auto sm:py-6 pb-6 pt-4 hide-scrollbar">
      <div className="flex gap-3 justify-center min-w-max px-4">
        {FILTER_BUTTONS.map((button) => (
          <NotificationFilterButton
            key={button.value}
            label={button.label}
            isActive={activeFilter === button.value}
            onClick={() => onFilterChange(button.value)}
          />
        ))}
      </div>
    </div>
  );
}