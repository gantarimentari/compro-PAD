import { useEffect, useState } from 'react';
import { addMonthsToDate, formatDateID } from '../reminderVaksinasi.utils';

/**
 * Form hook for marking vaccination as complete
 * Handles:
 * - Actual vaccination date
 * - Performed by doctor/admin
 * - Notes
 * - Next schedule type (automatic, manual, or final)
 */
export default function useActionReminderForm({ isOpen, onClose, onSave, reminder }) {
  const [formData, setFormData] = useState({
    actualVaccinationDate: '',
    performedBy: '',
    notes: '',
    scheduleType: 'final', // 'automatic' | 'manual' | 'final'
    manualNextDate: '',
  });

  const [calculatedNextDate, setCalculatedNextDate] = useState('');

  const toISODate = (dateValue) => {
    if (!dateValue) return null;
    const date = new Date(dateValue);
    if (Number.isNaN(date.getTime())) return null;
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Pre-fill form when modal opens
  useEffect(() => {
    if (isOpen && reminder) {
      // Extract raw date from latestVaccinationDate string (format: "25 Mar 2026")
      const latestDateStr = reminder.latestVaccinationDate;
      let actualDateInput = '';

      if (latestDateStr && latestDateStr !== '-') {
        // Parse Indonesian date format "25 Mar 2026" to YYYY-MM-DD
        const months = {
          'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04', 'May': '05', 'Jun': '06',
          'Jul': '07', 'Aug': '08', 'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12',
        };
        const parts = latestDateStr.split(' ');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = months[parts[1]] || '01';
          const year = parts[2];
          actualDateInput = `${year}-${month}-${day}`;
        }
      }

      setFormData({
        actualVaccinationDate: actualDateInput,
        performedBy: reminder.performedBy ?? '',
        notes: reminder.notes ?? '',
        scheduleType: reminder.scheduleType || 'final',
        manualNextDate: reminder.scheduleType === 'manual' ? toISODate(reminder.nextVaccinationDateRaw) ?? '' : '',
      });

      // Calculate automatic next date
      if (actualDateInput && reminder.vaccineInterval) {
        const nextDate = addMonthsToDate(new Date(actualDateInput), reminder.vaccineInterval);
        if (nextDate) {
          setCalculatedNextDate(formatDateID(nextDate));
        }
      }
    }
  }, [isOpen, reminder]);

  // Handle actual vaccination date change
  const handleActualDateChange = (value) => {
    setFormData(prev => ({ ...prev, actualVaccinationDate: value }));

    // Recalculate automatic next date
    if (value && reminder.vaccineInterval) {
      const nextDate = addMonthsToDate(new Date(value), reminder.vaccineInterval);
      if (nextDate) {
        setCalculatedNextDate(formatDateID(nextDate));
      }
    }
  };

  const handleScheduleTypeChange = (type) => {
    setFormData(prev => ({ ...prev, scheduleType: type }));
  };

  const handleManualDateChange = (value) => {
    setFormData(prev => ({ ...prev, manualNextDate: value }));
  };

  const handlePerformedByChange = (value) => {
    setFormData(prev => ({ ...prev, performedBy: value }));
  };

  const handleNotesChange = (value) => {
    setFormData(prev => ({ ...prev, notes: value }));
  };

  // Determine next vaccination date based on schedule type
  const getFinalNextDate = () => {
    switch (formData.scheduleType) {
      case 'automatic':
        if (!formData.actualVaccinationDate || !reminder?.vaccineInterval) return null;
        return toISODate(addMonthsToDate(new Date(formData.actualVaccinationDate), reminder.vaccineInterval));
      case 'manual':
        return formData.manualNextDate || null;
      case 'final':
        return null; // No more vaccinations needed
      default:
        return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.actualVaccinationDate || !formData.performedBy) {
      alert('Tanggal vaksin dan dokter/admin harus diisi');
      return;
    }

    try {
      const finalNextDate = getFinalNextDate();

      // Call parent's onSave with update payload
      await onSave({
        actualVaccinationDate: formData.actualVaccinationDate,
        performedBy: formData.performedBy,
        notes: formData.notes,
        scheduleType: formData.scheduleType,
        nextVaccinationDate: finalNextDate,
      });

      // Close modal after success
      onClose();
    } catch (error) {
      console.error('Gagal menyimpan vaksinasi:', error);
      alert('Gagal menyimpan vaksinasi');
    }
  };

  return {
    formData,
    calculatedNextDate,
    handleActualDateChange,
    handleScheduleTypeChange,
    handleManualDateChange,
    handlePerformedByChange,
    handleNotesChange,
    handleSubmit,
    finalNextDate: getFinalNextDate(),
  };
}