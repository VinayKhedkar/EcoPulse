'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Loader } from '@/components'

const Shop = () => {
	const [querry, setQuerry] = useState('')
	const [products, setProducts] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchProducts = async () => {
			setLoading(true)
			if (!querry) {
				setLoading(false)
				return
			}

			try {
				console.log(querry)
				const res = await axios.get(
					`${process.env.NEXT_PUBLIC_API_URL}/api/shop?q=${querry}`,
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
	}, [querry])

	const ProductCard = ({ image, title, link, regular_price, sale_price }) => {
		return (
			<div className='w-full max-w-xs bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition duration-300'>
				<a href={link} target='_blank' rel='noopener noreferrer'>
					<img
						src={`https:${image}`}
						alt={title}
						className='w-full h-56 object-contain p-4 bg-gray-100'
					/>
					<div className='px-4 py-3'>
						<h3 className='text-md font-semibold text-gray-800'>
							{title}
						</h3>
						<div className='mt-2 flex items-center gap-2'>
							<span className='text-sm line-through text-gray-500'>
								{regular_price}
							</span>
							<span className='text-lg font-bold text-green-600'>
								{sale_price}
							</span>
						</div>
					</div>
				</a>
			</div>
		)
	}

	return (
		<div className='flex flex-col items-center justify-center w-full h-screen bg-primary'>
			<div className='flex flex-col items-center justify-center w-full max-w-2xl p-4 bg-white shadow-md rounded-lg'>
				<h1 className='text-2xl font-bold text-gray-800 mb-4'>Shop</h1>
				<input
					type='text'
					value={querry}
					onChange={(e) => setQuerry(e.target.value)}
					placeholder='Search for products...'
					className='w-full p-2 border border-gray-300 rounded-md mb-4'
				/>
				<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
					{loading ? (
						<Loader />
					) : products.length > 0 ? (
						products.map((product) => (
							<ProductCard
								key={product.id}
								image={product.image}
								title={product.title}
								link={product.link}
								regular_price={product.regular_price}
								sale_price={product.sale_price}
							/>
						))
					) : (
						<p className='text-gray-500'>No products found</p>
					)}
				</div>
			</div>
		</div>
	)
}

export default Shop
