function FormCard({
    title,
    children,
    currentPage,
    totalPages,
    onBack,
    onNext,
    showBack = true,
    showNext = true
}) {

    return (
        <div className="w-full max-w-xl mx-auto border rounded-lg p-6 min-h-[500px] flex flex-col">

            <div className="mb-6">
                <h2 className="text-2xl font-semibold">{title}</h2>

                <div className="text-sm mt-1">
                    Step {currentPage} of {totalPages}
                </div>
            </div>

            <div className="flex-1">
                {children}
            </div>

            <div className="flex justify-between mt-6">
                {showBack
                    ? <button onClick={onBack}>Back</button>
                    : <div />
                }

                {showNext &&
                    <button onClick={onNext}>Next</button>
                }
            </div>

        </div>
    );
}

export default FormCard;