import React, { forwardRef, useImperativeHandle, useState } from 'react';
import { formatQubicAmount } from '../util';

interface InputNumbersProps {
    id: string;
    labelComponent: React.ReactNode;
    placeholder: string;
    minLimit?: number;
    maxLimit?: number;
    onChange: (value: string) => void;
}

export interface InputNumbersRef {
    validate: () => boolean;
}

const InputNumbers = forwardRef<InputNumbersRef, InputNumbersProps>(({
                                                                         id,
                                                                         labelComponent,
                                                                         placeholder,
                                                                         minLimit = 0,
                                                                         maxLimit = Infinity,
                                                                         onChange,
                                                                     }, ref) => {
    const [value, setValue] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        const regEx = /^[0-9]*$/;

        if (regEx.test(newValue)) {
            setValue(newValue);
            onChange(newValue);

            if (newValue === '') {
                setError('');
            } else {
                const numericValue = Number(newValue);
                if (numericValue < minLimit) {
                    setError(`Value must be greater than or equal to ${formatQubicAmount(minLimit)}`);
                } else if (numericValue > maxLimit) {
                    setError(`Value must be less than or equal to ${formatQubicAmount(maxLimit)}`);
                } else {
                    setError('');
                }
            }
        } else {
            setError('Invalid input');
        }
    };

    useImperativeHandle(ref, () => ({
        validate: () => {
            if (value === '') {
                setError('This field is required');
                return false;
            }
            const numericValue = Number(value);
            if (numericValue < minLimit) {
                setError(`Value must be greater than or equal to ${formatQubicAmount(minLimit)}`);
                return false;
            }
            if (numericValue > maxLimit) {
                setError(`Value must be less than or equal to ${formatQubicAmount(maxLimit)}`);
                return false;
            }
            setError('');
            return true;
        }
    }));

    return (
        <div>
            {labelComponent}
            <input
                id={id}
                type="text"
                className={`w-full p-4 bg-gray-80 border border-gray-70 text-white placeholder-gray-500 ${error && 'border-red-500'}`}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
            />
            {error && <p className="text-red-500 text-right">{error}</p>}
        </div>
    );
});

export default InputNumbers;
