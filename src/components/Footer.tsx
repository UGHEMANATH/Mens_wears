import { Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone } from "lucide-react"

function Footer() {
    return (
        <footer className="bg-violet-950 text-violet-100 py-16 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-black text-white mb-6 tracking-tight">
                            Nova<span className="text-emerald-400">Cart</span>
                        </h3>
                        <p className="text-violet-300 text-sm leading-relaxed mb-6">
                            Your premium destination for modern fashion. Discover the latest trends with unbeatable quality and style, delivered straight to your door.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors duration-300"><Facebook size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors duration-300"><Twitter size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors duration-300"><Instagram size={18} /></a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors duration-300"><Youtube size={18} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-violet-300 hover:text-emerald-400 transition-colors text-sm">About Us</a></li>
                            <li><a href="#" className="text-violet-300 hover:text-emerald-400 transition-colors text-sm">Contact Support</a></li>
                            <li><a href="#" className="text-violet-300 hover:text-emerald-400 transition-colors text-sm">Careers</a></li>
                            <li><a href="#" className="text-violet-300 hover:text-emerald-400 transition-colors text-sm">Store Locator</a></li>
                            <li><a href="#" className="text-violet-300 hover:text-emerald-400 transition-colors text-sm">Track Order</a></li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Customer Service</h4>
                        <ul className="space-y-3">
                            <li><a href="#" className="text-violet-300 hover:text-emerald-400 transition-colors text-sm">Return Policy</a></li>
                            <li><a href="#" className="text-violet-300 hover:text-emerald-400 transition-colors text-sm">Shipping Info</a></li>
                            <li><a href="#" className="text-violet-300 hover:text-emerald-400 transition-colors text-sm">Terms & Conditions</a></li>
                            <li><a href="#" className="text-violet-300 hover:text-emerald-400 transition-colors text-sm">Privacy Policy</a></li>
                            <li><a href="#" className="text-violet-300 hover:text-emerald-400 transition-colors text-sm">FAQ</a></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-bold text-white mb-6 uppercase tracking-wider text-sm">Contact Us</h4>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <MapPin size={20} className="text-emerald-400 shrink-0 mt-1" />
                                <span className="text-violet-300 text-sm">123 Fashion Street, Tech Park, Mumbai, 400001, India</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone size={20} className="text-emerald-400 shrink-0" />
                                <span className="text-violet-300 text-sm">+91 98765 43210</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail size={20} className="text-emerald-400 shrink-0" />
                                <span className="text-violet-300 text-sm">support@novacart.com</span>
                            </li>
                        </ul>
                    </div>

                </div>

                <div className="border-t border-violet-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-violet-400 text-xs">
                        © 2026 NovaCart Inc. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <span className="text-xs font-bold text-violet-400">VISA</span>
                        <span className="text-xs font-bold text-violet-400">MASTERCARD</span>
                        <span className="text-xs font-bold text-violet-400">PAYPAL</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
