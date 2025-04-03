function ArticlesSkeleton() {
    return (
        <div>
            <div className="flex flex-col gap-[1rem] w-full py-[1rem]">
                <div className="w-[15rem] flex h-[2.5rem] animate-skeleton rounded-xl"></div>
                <div className="flex flex-col gap-[1rem] w-full">
                    <div className="w-full h-[22rem] animate-skeleton rounded-xl"></div>
                    <div className="w-full h-[22rem] animate-skeleton rounded-xl"></div>
                    <div className="w-full h-[22rem] animate-skeleton rounded-xl"></div>
                    <div className="w-full h-[22rem] animate-skeleton rounded-xl"></div>
                    <div className="w-full h-[22rem] animate-skeleton rounded-xl"></div>
                    <div className="w-full h-[22rem] animate-skeleton rounded-xl"></div>
                    <div className="w-full h-[22rem] animate-skeleton rounded-xl"></div>
                </div>
            </div>
        </div>
    )
}

export default ArticlesSkeleton
