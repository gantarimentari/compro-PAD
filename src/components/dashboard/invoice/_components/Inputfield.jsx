const InputField = ({
    label,
    type = "text",
    value, 
    onChange,
    placeholder,
    required = false,
    options = []
})=>{
    return(
      <>
      <div>
        <label className="block text-h-8 font-bold text-accent-neutral-1000">{label}</label>

        {type === 'select' ? (
          <select
          value={value}
          onChange={onChange}
          className="whitespace-normal w-full bg-accent-neutral-275 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
          
          
        >
          <option value="">
            {isLoadingOptions ? 'Memuat data ...' : 'Pilih nama hewan'}
          </option>
          {hewanOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.name}
            </option>
          ))}
        </select>
        ):(
          <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="whitespace-normal w-full bg-accent-neutral-275 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 text-body-2 placeholder:text-accent-neutral-800"
        />
        )}
        
      </div>
      </>
    )
}

export default InputField;