"use client"

import { ReactNode } from "react"

type Props = {
    value: string
    onChange: (value: string) => void
    className?: string
    id: string
    required?: boolean
    children: ReactNode
    label?: string
}

const Select = ({ value, onChange, className, id, required, children, label }: Props) => {
    return (
        <div className="flex flex-col my-2 gap-1">
            {
                label ?
                    <strong className="text-xs font-bold text-slate-500">
                        {label}
                        {required == true ? <sup className="text-red-600">*&#41;</sup> : <></>}
                    </strong> :
                    <></>
            }
            <select id={id} value={value} onChange={e => onChange(e.target.value)}
                required={required || false}
                className={`w-full rounded-md px-4 py-2 text-sm bg-slate-50 border-slate-500 border focus:outline-none appearance-none ${className}`}>
                {children}
            </select>
        </div>
    )
}
export default Select
