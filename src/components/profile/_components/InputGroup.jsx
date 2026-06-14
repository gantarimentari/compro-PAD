// import { ModalDashedBorder } from "@/components/ui/frame/garisputus";

import { ModalDashedBorder } from "../_ui/ModalDashedBorder";


export const InputGroup = ({label, name, value, placeholder, isEditing, readOnly, onChange, error, type = 'text'})=> (
<div>
        <label className="block sm:text-h-7 text-body-1 font-medium text-accent-neutral-1000 mb-2">
            {label}
        </label>
        {isEditing && !readOnly ? (
            <>
                <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300 p-1">
                    <ModalDashedBorder className="absolute inset-0 w-full h-full z-0 pointer-events-none p-1" />
                    <input 
                        type={type}
                        name={name}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        className="relative pl-4 z-10 sm:text-h-7 text-body-1 font-medium text-accent-neutral-1000 w-full p-3 bg-transparent rounded-lg focus:outline-none"
                    />
                </div>
                {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
            </>
        ) : (
            <div className="relative bg-white rounded-lg border-2 border-accent-yellow-300">
                <ModalDashedBorder className="absolute inset-0 pointer-events-none rounded-lg p-1" />
                <div className={`relative z-10 w-full pl-6 p-3 sm:text-h-7 text-body-1 font-medium ${readOnly ? 'text-gray-500' : 'text-accent-neutral-1000'}`}>
                    {type === 'password' ? '••••••••' : value}
                </div>
            </div>
        )}
    </div>
);