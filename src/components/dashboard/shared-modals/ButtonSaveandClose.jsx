const ButtonSaveandClose = ({ onClose, isSubmitting = false, buttonLabel = 'Simpan', buttonLabelProcessing = 'Menyimpan...' }) => {
  return (
    <div className="flex justify-end space-x-3 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition duration-150"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-accent-blue-400 text-white rounded-lg hover:bg-accent-blue-500 transition duration-150"
          >
            {isSubmitting ? (buttonLabelProcessing || 'Menyimpan...') : buttonLabel}
          </button>
          </div>
  )};export default ButtonSaveandClose;