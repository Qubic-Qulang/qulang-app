import clsx from 'clsx'

function Card({children, className, onClick}) {

    return (
        <div
            className={clsx('bg-gray-80 border-gray-50 border-[1] bg-black z-50', className)}
            onClick={onClick ? onClick : null}
        >
            {children}
        </div>
    )
}

export default Card
