

function Skeleton() {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-violet-100 dark:border-slate-700 flex flex-col h-full overflow-hidden p-0 w-full animate-pulse">

            {/* Image Skeleton */}
            <div className="h-56 w-full bg-slate-200 dark:bg-slate-700 flex-shrink-0"></div>

            {/* Content Skeleton */}
            <div className="p-5 flex flex-col flex-1 gap-4">
                {/* Subtitle */}
                <div className="h-3 w-1/4 bg-slate-200 dark:bg-slate-700 rounded"></div>

                {/* Title */}
                <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-700 rounded"></div>
                <div className="h-5 w-1/2 bg-slate-200 dark:bg-slate-700 rounded"></div>

                {/* Rating */}
                <div className="h-3 w-1/3 bg-slate-200 dark:bg-slate-700 rounded"></div>

                {/* Price */}
                <div className="h-6 w-1/3 bg-slate-200 dark:bg-slate-700 rounded mt-2"></div>
            </div>

            {/* Button Skeleton */}
            <div className="p-5 pt-0 mt-auto">
                <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-xl"></div>
            </div>

        </div>
    )
}

export default Skeleton
