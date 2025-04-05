'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader } from '@/components'
import { IoMdSearch } from 'react-icons/io'
import { TfiFaceSad } from 'react-icons/tfi'

const Shop = () => {
    const [query, setQuery] = useState('')
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            if (!query) {
                setLoading(false)
                return
            }

            try {
                console.log(query)
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/shop?q=${query}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )

                console.log(res.data)
                setProducts(res.data.data)
            } catch (error) {
                toast.error(error.message, { className: 'toast-error' })
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [query])

    const ProductCard = ({ image, title, link, regular_price, sale_price }) => {
        return (
            <div className="w-full max-w-xs shadow-md rounded-2xl overflow-hidden transition duration-300">
                <a href={link} target="_blank" rel="noopener noreferrer">
                    <img
                        src={`https:${image}`}
                        alt={title}
                        className="w-full h-[14rem] object-contain p-[1rem]"
                    />
                    <div className="px-4 py-3">
                        <h3 className="text-gray-800 font-semibold">{title}</h3>
                        <div className="mt-2 flex items-center gap-2">
                            <p className="line-through text-gray-500">
                                {regular_price}
                            </p>
                            <h3 className="font-bold text-green-600">
                                {sale_price}
                            </h3>
                        </div>
                    </div>
                </a>
            </div>
        )
    }

    const ProductLoader = () => {
        return (
            <div className="w-full max-w-xs shadow-md rounded-2xl overflow-hidden transition duration-300">
                <div className="w-full h-[20rem] bg-gray-200 animate-skeleton"></div>
            </div>
        )
    }

    return (
        <div
            className={`flex flex-col items-center w-full h-full px-[1rem] bg-primary rounded-lg flex-1 ${
                loading ? 'overflow-hidden' : 'overflow-auto'
            }`}
        >
            <div className="w-full bg-primary sticky top-0">
                <div className="flex justify-between items-center gap-[1rem] w-full p-[1rem] border-[2px] border-gray rounded-full bg-primary z-[10000]">
                    <IoMdSearch className="w-[2rem] h-[2rem]" />
                    <input
                        type="text"
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for products..."
                        className="flex-1 w-full text-[1.5rem]"
                    />
                </div>
            </div>
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem] justify-center items-center w-full py-[1rem]">
                    {Array.from({ length: 20 }).map((_, index) => (
                        <ProductLoader key={index} />
                    ))}
                </div>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[1rem] justify-center items-center w-full py-[1.5rem]">
                    {products.map((product) => (
                        <ProductCard
                            key={product.id}
                            image={product.image}
                            title={product.title}
                            link={product.link}
                            regular_price={product.regular_price}
                            sale_price={product.sale_price}
                        />
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-[1.5rem] items-center justify-center w-full h-full text-center">
                    <TfiFaceSad size={40} className="text-gray-500" />
                    <h2 className="text-gray-500 font-secondary font-normal">
                        No products found
                    </h2>
                </div>
            )}
        </div>
    )
}

export default Shop
