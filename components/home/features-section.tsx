"use client"

"use client"
import React from "react"
import { motion } from 'framer-motion'
import Image from "next/image"
import { Sparkles } from "lucide-react"
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export function FeaturesSection() {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, amount: 0.3 })

	return (
		<section className="py-20 px-4 lg:px-8 bg-white">
			<div className="container mx-auto max-w-7xl">
				<motion.div
					className="text-center mb-20"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.6 }}
				>
					<h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
						Make the most of the wardrobe you already own
					</h2>
					<p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
						WearWhat helps you turn the pieces you have into more outfits with smart suggestions for your
						schedule, your style, and the season.
					</p>
				</motion.div>

				{/* Section 1: Style Smart */}
				<motion.div
					ref={ref}
					className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24"
					initial={{ opacity: 0, y: 30 }}
					animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
					transition={{ duration: 0.6 }}
				>
					<div className="order-2 lg:order-1">
						<Image
							src="/ChatGPT Image Dec 20, 2025, 12_07_52 AM.png"
							alt="Style Smart"
							width={600}
							height={400}
							className="rounded-2xl w-full h-auto max-w-lg mx-auto"
						/>
					</div>
					<div className="order-1 lg:order-2">
						<h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Style Smarter</h3>
						<ul className="space-y-4">
							{[
								"Smart outfit ideas based on what's already in your wardrobe.",
								"Suggestions that adjust to the weather and your plans for the day.",
								"A simple photobased closet so you can see all your options at a glance.",
								"Color and style combinations that always feel intentional.",
								"Looks for work, campus, weekends, and everything in between."
							].map((text, index) => (
								<li
									key={index}
									className="flex items-start gap-3"
								>
									<Sparkles className="w-5 h-5 text-[#0095da] mt-1 flex-shrink-0" />
									<span className="text-lg text-gray-700">{text}</span>
								</li>
							))}
						</ul>
					</div>
				</motion.div>

				{/* Section 2: Look Better */}
				<motion.div
					className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-24"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
				>
					<div>
						<h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Look PutTogether</h3>
						<ul className="space-y-4">
							{[
								"Step out in outfits that feel considered, not thrown together last minute.",
								"Spend less time deciding what to wear and more time on what matters.",
								"Outfits that match your personality and lifestyle, not a generic template.",
								"Save your favorite combinations so you can revisit them any time.",
								"Recommendations that improve over time as WearWhat learns what you like."
							].map((text, index) => (
								<li
									key={index}
									className="flex items-start gap-3"
								>
									<Sparkles className="w-5 h-5 text-[#0095da] mt-1 flex-shrink-0" />
									<span className="text-lg text-gray-700">{text}</span>
								</li>
							))}
						</ul>
					</div>
					<div>
						<Image
							src="/ChatGPT Image Dec 20, 2025, 12_15_42 AM.png"
							alt="Look Better"
							width={600}
							height={400}
							className="rounded-2xl w-full h-auto max-w-lg mx-auto"
						/>
					</div>
				</motion.div>

				{/* Section 3: Manage Easier */}
				<motion.div
					className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true, amount: 0.3 }}
					transition={{ duration: 0.6 }}
				>
					<div className="order-2 lg:order-1">
						<Image
							src="/ChatGPT Image Dec 20, 2025, 12_20_24 AM.png"
							alt="Manage Easier"
							width={600}
							height={400}
							className="rounded-2xl w-full h-auto max-w-lg mx-auto"
						/>
					</div>
					<div className="order-1 lg:order-2">
						<h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Manage Your Wardrobe</h3>
						<ul className="space-y-4">
							{[
								"Keep every piece in one organized, searchable digital wardrobe.",
								"Add items with photos and details so you always know what you own.",
								"See which pieces you actually wear  and which are just taking up space.",
								"Plan outfits for trips, busy weeks, and special occasions in advance.",
								"Stay on top of laundry days and seasonal refreshes with gentle reminders."
							].map((text, index) => (
								<li
									key={index}
									className="flex items-start gap-3"
								>
									<Sparkles className="w-5 h-5 text-[#0095da] mt-1 flex-shrink-0" />
									<span className="text-lg text-gray-700">{text}</span>
								</li>
							))}
						</ul>
					</div>
				</motion.div>
			</div>
		</section>
	)
}

