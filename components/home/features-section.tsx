"use client"
import { motion } from 'framer-motion'
import Image from "next/image"

const images = [
	"/heroimg1.png",
	"/heroimg2.png",
	"/heroimg3.png",
	"/heroimg4.png",
]

export function FeaturesSection() {
	return (
		<section className="py-24 mt-12 bg-gray-100">
			<div className="px-8 lg:px-12 max-w-6xl mx-auto">
				<motion.div
					className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
				>
					{/* Left - Text Content */}
					<div>
						<h2 className="text-5xl md:text-6xl lg:text-7xl font-md text-black leading-tight mb-8" >
							your closet,<br />reimagined
						</h2>
						<p className="text-lg md:text-xl text-gray-500 leading-relaxed" style={{ fontFamily: 'var(--font-poppins)' }}>
							organize your clothes effortlessly and dress smarter every day: get AI-powered outfit suggestions, weather-based recommendations, and discover new ways to style what you already own.
						</p>
					</div>

					{/* Right - 2x2 Image Grid */}
					<div className="grid grid-cols-2 gap-6">
						{images.map((src, index) => (
							<div
								key={index}
								className="aspect-square overflow-hidden bg-white shadow-md"
							>
								<Image
									src={src}
									alt={`Feature ${index + 1}`}
									width={300}
									height={300}
									className="w-full h-full object-contain"
								/>
							</div>
						))}
					</div>
				</motion.div>
			</div>
		</section>
	)
}
