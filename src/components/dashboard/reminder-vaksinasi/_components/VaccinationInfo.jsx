export const VaccinationInfo = ({reminder})=>{
  return(
  <div className='bg-[#F9FAFB] rounded-lg p-4 grid grid-cols-2 gap-4'>
          <div>
            <p className="text-body-2 text-accent-neutral-800">Hewan</p>
            <p className="text-body-2 font-semibold text-accent-neutral-1000">{reminder.petName}</p>
          </div>
          <div>
            <p className="text-body-2 text-accent-neutral-800">Pemilik</p>
            <p className="text-body-2 font-semibold text-accent-neutral-1000">{reminder.ownerName}</p>
          </div>

          <div>
            <p className="text-body-2 text-accent-neutral-800">Jenis Vaksin</p>
            <p className="text-body-2 font-semibold text-accent-neutral-1000">{reminder.vaccinationType}</p>
          </div>
          <div>
            <p className="text-body-2 text-accent-neutral-800">Jadwal Semula</p>
            <p className="text-body-2 font-semibold text-accent-neutral-1000">{reminder.nextVaccinationDate}</p>
          </div>
        </div>)
}