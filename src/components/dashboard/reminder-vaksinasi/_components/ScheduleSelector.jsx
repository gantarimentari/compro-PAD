export const ScheduleSelector = ({
  calculatedNextDate,
  formData,
  reminder,
  handleManualDateChange,
  handleScheduleTypeChange,
}) => {
  return (
    <div className="border border-[#E5E7EB] rounded-xl p-4 space-y-4">
      <p className="text-accent-neutral-1000 font-medium text-body-2">Jadwal Vaksinasi Berikutnya</p>

      <div className="flex items-start gap-3">
        <input
          type="radio"
          id="schedule-automatic"
          name="scheduleType"
          value="automatic"
          checked={formData.scheduleType === 'automatic'}
          onChange={(e) => handleScheduleTypeChange(e.target.value)}
          className="mt-1"
        />
        <div className="flex-1">
          <label htmlFor="schedule-automatic" className="text-body-2 font-medium text-accent-neutral-1000 cursor-pointer">
            Otomatis ({reminder.vaccineInterval || 12} bulan dari tanggal aktual)
          </label>
          {formData.scheduleType === 'automatic' && (
            <p className="text-body-2 text-[#008236] text-accent-neutral-700 mt-2 bg-[#F0FDF4] p-2 rounded-lg">
              Jadwal berikutnya: <span className="font-semibold">{calculatedNextDate}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="radio"
          id="schedule-manual"
          name="scheduleType"
          value="manual"
          checked={formData.scheduleType === 'manual'}
          onChange={(e) => handleScheduleTypeChange(e.target.value)}
          className="mt-1"
        />
        <div className="flex-1">
          <label htmlFor="schedule-manual" className="text-body-2 font-medium text-accent-neutral-1000 cursor-pointer">
            Tentukan Manual
          </label>
          {formData.scheduleType === 'manual' && (
            <input
              type="date"
              value={formData.manualNextDate}
              onChange={(e) => handleManualDateChange(e.target.value)}
              className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
              required
            />
          )}
        </div>
      </div>

      <div className="flex items-start gap-3">
        <input
          type="radio"
          id="schedule-final"
          name="scheduleType"
          value="final"
          checked={formData.scheduleType === 'final'}
          onChange={(e) => handleScheduleTypeChange(e.target.value)}
          className="mt-1"
        />
        <label htmlFor="schedule-final" className="text-body-2 font-medium text-accent-neutral-1000 cursor-pointer">
          Setelah selesai vaksinasi ini (tidak perlu booster/lagi)
        </label>
      </div>
    </div>
  );
};