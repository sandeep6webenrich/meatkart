'use client'

import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="tw-flex tw-min-h-[400px] tw-flex-col tw-items-center tw-justify-center tw-gap-4 tw-p-4">
            <h2 className="tw-text-2xl tw-font-bold">Something went wrong!</h2>
            <p className="tw-text-gray-600">
                {error.message || 'An unexpected error occurred while loading this page.'}
            </p>
            <button
                className="tw-rounded-md tw-bg-brand-red tw-px-4 tw-py-2 tw-text-white hover:tw-bg-red-700 tw-transition-colors"
                onClick={
                    // Attempt to recover by trying to re-render the segment
                    () => reset()
                }
            >
                Try again
            </button>
        </div>
    )
}
