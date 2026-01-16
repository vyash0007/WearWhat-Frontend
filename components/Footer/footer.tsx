import { Shirt } from "lucide-react"

export function Footer() {
	return (
		<footer className="bg-gray-900 text-white">
			<div className="container mx-auto px-4 lg:px-8 py-12">
				{/* Top Section: Logo and Navigation */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12 mb-8">
					{/* Logo Section */}
					<div className="lg:col-span-2">
						<div className="flex items-center gap-3 mb-4">
							<div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
								<Shirt className="w-6 h-6 text-white" />
							</div>
							<span className="text-2xl font-bold">
								WearWhat<sup className="text-sm">4</sup>
							</span>
						</div>
					</div>

					{/* Navigation Columns */}
					<div>
						<h3 className="font-bold text-white mb-4">Features</h3>
						<ul className="space-y-3 text-gray-400">
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Style Assistant
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Wardrobe Manager
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Weather Integration
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Outfit Planner
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Mobile App
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold text-white mb-4">Resources</h3>
						<ul className="space-y-3 text-gray-400">
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Help Center
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Blog
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Style Guide
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									API Docs
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold text-white mb-4">Company</h3>
						<ul className="space-y-3 text-gray-400">
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Privacy
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Terms
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Contact
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									FAQ&apos;s
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h3 className="font-bold text-white mb-4">Connect</h3>
						<ul className="space-y-3 text-gray-400">
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Twitter
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									Instagram
								</a>
							</li>
							<li>
								<a href="#" className="hover:text-white transition-colors">
									LinkedIn
								</a>
							</li>
						</ul>
					</div>
				</div>

				{/* Separator */}
				<div className="border-t border-gray-800 my-8"></div>

				{/* Bottom Section: Copyright and Made in India */}
				<div className="flex flex-col md:flex-row justify-between items-center gap-4">
					<p className="text-gray-400 text-sm">
						WearWhat Technology Pvt Ltd. All rights reserved, 2025.
					</p>
					<div className="flex items-center gap-2 text-gray-400 text-sm">
						<span>Made in</span>
						<div className="flex items-center">
							{/* Indian Flag - Tricolor with Ashoka Chakra */}
							<div className="flex flex-col h-4 w-6 rounded-sm overflow-hidden border border-gray-600">
								<div className="h-1/3 bg-[#FF9933]"></div>
								<div className="h-1/3 bg-white flex items-center justify-center relative">
									<div className="w-1.5 h-1.5 border border-[#000080] rounded-full flex items-center justify-center">
										<div className="w-0.5 h-0.5 bg-[#000080] rounded-full"></div>
									</div>
								</div>
								<div className="h-1/3 bg-[#138808]"></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	)
}

