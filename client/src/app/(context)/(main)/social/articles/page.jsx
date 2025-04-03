'use client'
import { ArticleCard, ArticlesSkeleton } from '@/components'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

export default function Page() {
    const [articles, setArticles] = useState([])
    const [loading, setLoading] = useState(true)
    const [page, setPage] = useState(1)
    const router = useRouter()
    const { query } = router
    const params = new URLSearchParams(query)
    params.set('page', page)

    const nextPage = () => {
        setPage((prev) => prev + 1)
    }

    const prevPage = () => {
        if (page > 1) {
            setPage((prev) => prev - 1)
        }
    }

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/articles?page=${page}`
                )

                const data = await response.json()

                if (!response.ok) {
                    throw new Error(data.message)
                }

                setArticles(data.data)
                setLoading(false)
            } catch (error) {
                toast.error(error.message, {
                    className: 'toast-error',
                })
            }
        }

        fetchArticles()
    }, [])
    return (
        <div className="flex flex-col gap-[1rem] w-full py-[1rem]">
            {loading ? (
                <ArticlesSkeleton />
            ) : (
                <>
                    <h2>Latest Articles</h2>
                    <div className="flex flex-col gap-[1rem] w-full">
                        {articles?.map((article, index) => (
                            <ArticleCard
                                key={index}
                                title={article.title}
                                image={article.image}
                                url={article.link}
                                description={article.description}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
