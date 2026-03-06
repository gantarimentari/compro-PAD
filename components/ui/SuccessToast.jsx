'use client';

export default function SuccessToast({ show, message = 'Berhasil menyimpan perubahan' }) {
  if (!show) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-2 bg-green-500 text-white px-5 py-3 rounded-lg shadow-lg text-sm font-medium pointer-events-none">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 00-1.414 0L8 12.586 4.707 9.293a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8a1 1 0 000-1.414z" clipRule="evenodd" />
      </svg>
      {message}
    </div>
  );
}
