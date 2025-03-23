import Link from "next/link";
import pkg from '../../package.json'

export default function Footer() {
    const pathname = ""

    if (pathname.indexOf('/bet/') === -1) {
        return (
            <div
                className="mt-auto px-5 bg-black sm:px-20 md:px-100 py-16 flex flex-col sm:flex-row items-center sm:justify-between sm:items-end gap-10">
                <div className="flex gap-2">

                    <span className="text-gray-5000 text-12 font-space text-gray-500">
                        powered by
                    </span>
                    <img src="logo_text_short.svg" alt="qubic logo"/>

                </div>
                <span className="text-gray-50 text-12 font-space pl-10">
                        {'\u00A9'} {new Date().getFullYear()} QuLang
                    </span>
                <span className='text-gray-50 text-12 cursor-pointer'>
                        Version {pkg.version}
                    </span>
            </div>)
    }
    return null
}