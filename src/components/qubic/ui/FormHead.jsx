import React from 'react'

const FormHead = ({onBack, title}) => {
    return (
        <div className="flex items-center space-x-2 mb-4">
            <button onClick={onBack} className="text-white">
                <p className='cursor-pointer'>Back</p>
            </button>
            <h1 className="text-white text-[25px] font-semibold">{title}</h1>
        </div>
    )
}

export default FormHead
