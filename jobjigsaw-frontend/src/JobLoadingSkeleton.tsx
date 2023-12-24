

export default function JobLoadingSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-800 rounded-lg p-4 my-4 space-y-4">
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    <div className="space-y-2 mt-2">
                        <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-700 rounded"></div>
                        <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                        <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    )
}

