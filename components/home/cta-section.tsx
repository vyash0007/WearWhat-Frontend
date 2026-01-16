'use client'

import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export function CTASection() {
	return (
		<section className="py-24 px-4 lg:px-8 bg-white relative overflow-hidden">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<motion.div 
					className="absolute -top-40 -right-40 w-80 h-80 rounded-full blur-3xl opacity-20"
					style={{ background: 'radial-gradient(circle, #0095da 0%, transparent 70%)' }}
					animate={{
						scale: [1, 1.2, 1],
						opacity: [0.2, 0.3, 0.2],
					}}
					transition={{
						duration: 8,
						repeat: Infinity,
						ease: "easeInOut"
					}}
				/>
				<motion.div 
					className="absolute -bottom-40 -left-40 w-80 h-80 rounded-full blur-3xl opacity-20"
					style={{ background: 'radial-gradient(circle, #FF6B9D 0%, transparent 70%)' }}
					animate={{
						scale: [1, 1.3, 1],
						opacity: [0.2, 0.3, 0.2],
					}}
					transition={{
						duration: 10,
						repeat: Infinity,
						ease: "easeInOut",
						delay: 1
					}}
				/>
			</div>

			<motion.div 
				className="container mx-auto max-w-5xl relative z-10"
				initial={{ opacity: 0, y: 30 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.6 }}
			>
				<div className="text-center">
					{/* Main heading */}
					<h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
						Ready to never wonder
						<br />
						<span className="bg-gradient-to-r from-[#0095da] to-[#FF6B9D] bg-clip-text text-transparent">
							what to wear again?
						</span>
					</h2>

					{/* Subtitle */}
					<p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
						Join thousands who've ditched the morning outfit stress. 
						<br className="hidden md:block" />
						Your style journey starts in 30 seconds.
					</p>

					{/* CTA Button */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
							<Button 
								className="group bg-gray-900 text-white hover:bg-gray-800 px-8 py-6 text-lg font-semibold rounded-xl shadow-xl hover:shadow-2xl transition-all"
							>
								Get started free
								<ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
							</Button>
						</motion.div>
						<motion.a
							href="/how-it-works"
							className="px-8 py-6 text-lg font-semibold rounded-xl border-2 border-gray-300 hover:border-gray-400 bg-white hover:bg-gray-50 transition-all text-gray-900"
							whileHover={{ scale: 1.05 }}
							whileTap={{ scale: 0.95 }}
						>
							See how it works
						</motion.a>
					</div>
				</div>
			</motion.div>
		</section>
	)
}

