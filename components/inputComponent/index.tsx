// "use client"

// import { KeyboardEvent, ReactNode } from "react"

// type Props = {
//     value: string,
//     onChange: (value: string) => void
//     type: "text" | "number" | "color" | "email" | "password" | "date"
//     className?: string
//     id: string
//     required?: boolean
//     placeholder?: string
//     readOnly?: boolean
//     children?: ReactNode
//     label?: string
//     onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void
// }

// export const InputComponent = ({ value, onChange, type, className, id, required, placeholder, onKeyUp }: Props) => {
//     return (
//         <input type={type} id={id} value={value} onChange={e => onChange(e.target.value)}
//             className={`text-sm w-full rounded-md p-2 bg-slate-50 border border-secondary focus:border-primary focus:outline-none ${className}`}
//             required={required ? required : false} placeholder={placeholder || ""} onKeyUp={e => {
//                 if (onKeyUp) onKeyUp(e)
//             }} />
//     )
// }

// export const InputGroupComponent = ({ value, onChange, type, className, id, required, placeholder, children, label, onKeyUp, readOnly }: Props) => {
//     return (
//         <div className="w-full flex flex-col gap-1 my-2">
//             <strong className="text-xs font-bold text-slate-500">{label}{required == true ? <sup className="text-red-600">*&#41;</sup> : <></>}</strong>
//             <div className="w-full flex items-center gap-1 bg-white border-slate-500 rounded-md border">
//                 {
//                     children ?
//                         <div className="">
//                             {children}
//                         </div> : <div className=""></div>
//                 }
//                 <input type={type} id={id} value={value} onChange={e => onChange(e.target.value)}
//                     className={`text-sm w-full rounded-r-md p-2 bg-white  focus:outline-none ${className}`}
//                     required={required ? required : false} placeholder={placeholder || ""}
//                     readOnly={readOnly ? readOnly : false} onKeyUp={e => {
//                         if (onKeyUp) onKeyUp(e)
//                     }} />
//             </div>
//         </div>

//     )
// }

// export const TextGroupComponent = ({ value, onChange, className, id, required, placeholder, label }: Props) => {
//     return (
//         <div className="w-full flex flex-col gap-1 my-2">
//             <strong className="text-xs font-bold text-slate-500">
//                 {label}
//                 {required == true ? <sup className="text-red-600">*&#41;</sup> : <></>}
//             </strong>
//             <div className="w-full flex items-center gap-1 bg-white border-slate-500 rounded-md border">
//                 <textarea id={id} value={value} cols={10} rows={3} onChange={e => onChange(e.target.value)}
//                     className={`text-sm w-full rounded-md p-2 bg-white  focus:outline-none ${className}`}
//                     required={required ? required : false} placeholder={placeholder || ""} />
//             </div>
//         </div>

//     )
// }

"use client"

import { KeyboardEvent, ReactNode } from "react"

type Props = {
    value: string,
    onChange: (value: string) => void
    type: "text" | "number" | "color" | "email" | "password" | "date" | "datetime-local" | "time"
    className?: string
    id: string
    required?: boolean
    placeholder?: string
    readOnly?: boolean
    disabled?: boolean
    children?: ReactNode
    label?: string
    onKeyUp?: (event: KeyboardEvent<HTMLInputElement>) => void
}

export const InputComponent = ({ value, onChange, type, className, id, required, placeholder, onKeyUp }: Props) => {
    return (
        <input type={type} id={id} value={value} onChange={e => onChange(e.target.value)}
            className={`text-sm w-full rounded-md p-2 bg-slate-50 border border-secondary focus:border-primary focus:outline-none ${className}`}
            required={required ? required : false} placeholder={placeholder || ""} onKeyUp={e => {
                if (onKeyUp) onKeyUp(e)
            }} />
    )
}

export const InputGroupComponent = ({ value, onChange, type, className, id, required, placeholder, children, label, onKeyUp, readOnly, disabled }: Props) => {
    return (
        <div className={`w-full flex flex-col gap-1 my-2 ${disabled ? 'opacity-60' : ''}`}>
            <strong className="text-xs font-bold text-slate-500">{label}{required == true ? <sup className="text-red-600">*&#41;</sup> : <></>}</strong>
            <div className={`w-full flex items-center gap-1 bg-white border-slate-500 rounded-md border ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}`}>
                {
                    children ?
                        <div className="">
                            {children}
                        </div> : <div className=""></div>
                }
                <input type={type} id={id} value={value} onChange={e => onChange(e.target.value)}
                    className={`text-sm w-full rounded-r-md p-2 bg-white focus:outline-none ${className} ${disabled ? 'bg-gray-50 cursor-not-allowed text-gray-500' : ''}`}
                    required={required ? required : false} placeholder={placeholder || ""}
                    readOnly={readOnly ? readOnly : false} disabled={disabled}
                    onKeyUp={e => {
                        if (onKeyUp) onKeyUp(e)
                    }} />
            </div>
        </div>

    )
}

export const TextGroupComponent = ({ value, onChange, className, id, required, placeholder, label }: Props) => {
    return (
        <div className="w-full flex flex-col gap-1 my-2">
            <strong className="text-xs font-bold text-slate-500">
                {label}
                {required == true ? <sup className="text-red-600">*&#41;</sup> : <></>}
            </strong>
            <div className="w-full flex items-center gap-1 bg-white border-slate-500 rounded-md border">
                <textarea id={id} value={value} cols={10} rows={3} onChange={e => onChange(e.target.value)}
                    className={`text-sm w-full rounded-md p-2 bg-white  focus:outline-none ${className}`}
                    required={required ? required : false} placeholder={placeholder || ""} />
            </div>
        </div>

    )
}
