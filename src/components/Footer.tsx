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
                <div className="flex items-center gap-2">
                    <a style={{textDecoration: 'none', color: 'white'}}
                       className="text-12 font-space"
                       target='_blank' rel="noreferrer"
                       href="https://qubic.org/Terms-of-service">
                        Terms of service
                    </a>
                    <span className="text-gray-50">•</span>
                    <a style={{textDecoration: 'none', color: 'white'}}
                       className="text-12 font-space"
                       target='_blank' rel="noreferrer"
                       href="https://qubic.org/Privacy-policy">
                        Privacy Policy
                    </a>
                    <span className="text-gray-50">•</span>
                    <a style={{textDecoration: 'none', color: 'white'}}
                       className="text-12 font-space"
                       target='_blank' rel="noreferrer"
                       href="https://status.qubic.li/">
                        Network Status
                    </a>
                </div>
                <span className='text-gray-50 text-12 cursor-pointer'>
                        Version {pkg.version}
                    </span>
            </div>)
    }
    return null
}