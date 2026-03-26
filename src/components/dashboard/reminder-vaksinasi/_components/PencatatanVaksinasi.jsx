export const PencatatanVaksinasi = ({formData, handleActualDateChange, handlePerformedByChange,handleNotesChange })=>{
 return(
  <> {/* Actual Vaccination Date */}
          <div>
            <label className="block text-h-8 font-bold text-accent-neutral-1000">
              Tanggal Vaksin Aktual
            </label>
            <input
              type="date"
              value={formData.actualVaccinationDate}
              onChange={(e) => handleActualDateChange(e.target.value)}
              className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2"
              required
            />
          </div>

          {/* Performed By */}
          <div>
            <label className='block text-h-8 font-bold text-accent-neutral-1000'>
              Dilakukan oleh (Dokter/Admin)
            </label>
            <input
              className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
              type='text'
              placeholder='masukkan nama dokter/admin'
              value={formData.performedBy}
              onChange={(e) => handlePerformedByChange(e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-h-8 font-bold text-accent-neutral-1000">
              Catatan Vaksinasi
            </label>
            <textarea
              placeholder="Kondisi hewan, reaksi vaksin, dll..."
              className="w-full bg-accent-neutral-200 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
              value={formData.notes}
              onChange={(e) => handleNotesChange(e.target.value)}
            />
          </div>
  </>
 )
}