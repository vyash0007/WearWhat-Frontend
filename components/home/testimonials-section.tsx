"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

interface Testimonial {
	name: string
	role: string
	company: string
	quote: string
	testimonial: string
	avatar: string
}


const testimonials: Testimonial[] = [
	{
		name: "Shubham Choudhay",
		role: "Software Engineer",
		company: "Tech Professional",
		quote: "Game-changer for my daily routine!",
		testimonial: "As a developer, I never had time to think about what to wear. WearWhat's AI suggestions are spot-on for my casual work style. The weather integration is brilliant - I never have to check the forecast separately. My colleagues have noticed I'm dressing better, and it takes me literally 30 seconds to decide my outfit now. Best part? It's completely free!",
		avatar: "/p1.jpg"
	},
	{
		name: "Yash Verma",
		role: "Business Student",
		company: "MBA Candidate",
		quote: "My wardrobe feels brand new!",
		testimonial: "I was wasting money buying new clothes when I had perfectly good ones sitting unused. WearWhat showed me how to mix and match everything I already own. I've discovered at least 20 new outfit combinations from my existing wardrobe. The style suggestions are so on-point, and it's helped me build confidence in my appearance. Perfect for a student on a budget!",
		avatar: "/p2.jpeg"
	},
	{
		name: "Sahil Dawar",
		role: "Product Manager",
		company: "Startup Founder",
		quote: "Professional looks, zero effort!",
		testimonial: "Running a startup means I'm always short on time. WearWhat has been a lifesaver - it suggests outfits that match my meetings and the weather automatically. The AI really understands professional dressing. I've gotten multiple compliments at investor meetings, and I spend maybe 2 minutes on my outfit now instead of 15. This app is a productivity hack!",
		avatar: "/p3.jpeg"
	},
	{
		name: "Kush Munjal",
		role: "Graduate Researcher",
		company: "PhD Student",
		quote: "Finally found my personal style!",
		testimonial: "I used to buy clothes impulsively and then never wear them because I didn't know how to style them. WearWhat helped me understand what actually works for my body type and lifestyle. The outfit planning feature is amazing - I can plan my whole week in advance. It's made me more conscious about my wardrobe and helped me develop a consistent personal style. Highly recommend!",
		avatar: "/p4.jpg"
	}
]

export function TestimonialsSection() {
	const [currentSlide, setCurrentSlide] = useState(0)

	// Group testimonials into pairs
	const testimonialPairs: Testimonial[][] = []
	for (let i = 0; i < testimonials.length; i += 2) {
		testimonialPairs.push([
			testimonials[i],
			testimonials[i + 1] || testimonials[0]
		])
	}

	// Auto-scroll functionality with sliding effect
	useEffect(() => {
		const interval = setInterval(() => {
			setCurrentSlide((prevSlide) => {
				// Move to next slide, loop back to 0 after the last slide
				return (prevSlide + 1) % testimonialPairs.length
			})
		}, 5000) // Change slide every 5 seconds

		return () => clearInterval(interval)
	}, [testimonialPairs.length])

	// Handle manual slide change
	const handleSlideChange = (index: number) => {
		if (index === currentSlide) return
		setCurrentSlide(index)
	}

	return (
		<section className="py-20 px-4 lg:px-8 bg-gray-100 relative overflow-hidden">
			{/* Decorative star graphic */}
			<div 
				className="absolute left-0 top-1/2 -translate-y-1/2 opacity-10"
				style={{
					width: '400px',
					height: '400px',
					background: 'radial-gradient(circle, rgba(255, 183, 77, 0.3) 0%, transparent 70%)',
					borderRadius: '50%',
					transform: 'translateX(-50%)'
				}}
			/>

			<motion.div 
				className="container mx-auto max-w-7xl relative z-10"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
			>
				{/* Large quotation marks */}
				{/* <div className="text-center mb-8">
					<div className="text-8xl md:text-9xl font-serif text-gray-200 leading-none mb-4">
						&ldquo;
					</div>
				</div> */}
				

				{/* Heading */}
				<div className="text-center mb-4">
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-light tracking-wide text-gray-900 mb-3">
						Hear from people who love it
					</h2>
					<p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto font-light tracking-wide">
						From students to professionals, everyone's finding their style with WearWhat
					</p>
				</div>

				{/* Testimonial Cards - Sliding Container */}
				<div className="mt-12 mb-8 relative overflow-hidden py-6">
					<motion.div 
						className="flex"
						animate={{
							x: `-${currentSlide * 100}%`
						}}
						transition={{
							type: "spring",
							stiffness: 300,
							damping: 30
						}}
					>
						{testimonialPairs.map((pair, pairIndex) => (
							<div
								key={pairIndex}
								className="min-w-full grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 px-2"
							>
								{pair.map((testimonial, index) => (
									<div
										key={`${pairIndex}-${index}`}
										className="bg-white rounded-2xl p-8 shadow-md border border-gray-100"
									>
										{/* Company/Name */}
										<div className="mb-6">
											<h3 className="text-xl font-light tracking-wide text-gray-800">
												{testimonial.company}
											</h3>
										</div>

										{/* Quote */}
										<div className="mb-4">
											<p className="text-2xl font-light tracking-wide text-gray-900 leading-tight">
												&ldquo;{testimonial.quote}&rdquo;
											</p>
										</div>

										{/* Testimonial Body */}
										<div className="mb-6">
											<p className="text-base text-gray-600 leading-relaxed font-light tracking-wide">
												{testimonial.testimonial}
											</p>
										</div>

										{/* Reviewer Info */}
										<div className="flex items-center gap-4 pt-4 border-t border-gray-100">
											<div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
												<Image
													src={testimonial.avatar}
													alt={testimonial.name}
													width={48}
													height={48}
													className="w-full h-full object-cover"
												/>
											</div>
											<div>
												<p className="font-light tracking-wide text-gray-900">{testimonial.name}</p>
												<p className="text-sm text-gray-600 font-light tracking-wide">{testimonial.role}</p>
											</div>
										</div>
									</div>
								))}
							</div>
						))}
					</motion.div>
				</div>

				{/* Pagination Dots */}
				<div className="flex justify-center gap-2 mt-8">
					{testimonialPairs.map((_, index) => (
						<button
							key={index}
							onClick={() => handleSlideChange(index)}
							className={`h-2 rounded-full transition-all duration-300 ${
								currentSlide === index
									? 'bg-gray-900 w-8'
									: 'bg-gray-300 w-2 hover:bg-gray-400'
							}`}
							aria-label={`Go to slide ${index + 1}`}
						/>
					))}
				</div>
			</motion.div>
		</section>
	)
}

