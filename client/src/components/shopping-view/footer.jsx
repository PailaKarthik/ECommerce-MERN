import React from 'react';
import { 
  Facebook, 
  Instagram, 
  Youtube, 
  Twitter,
  MessageCircle,
  Mail,
  Phone,
  MapPin 
} from 'lucide-react';

const ShoppingFooter = () => {
  const socialLinks = [
    { 
      icon: Facebook, 
      href: "#", 
      color: "hover:text-blue-500",
      label: "Facebook" 
    },
    { 
      icon: Instagram, 
      href: "#", 
      color: "hover:text-pink-500",
      label: "Instagram" 
    },
    { 
      icon: Youtube, 
      href: "#", 
      color: "hover:text-red-500",
      label: "YouTube" 
    },
    { 
      icon: Twitter, 
      href: "#", 
      color: "hover:text-blue-400",
      label: "Twitter" 
    },
    { 
      icon: MessageCircle, 
      href: "#", 
      color: "hover:text-green-500",
      label: "WhatsApp" 
    },
  ];

  return (
    <footer className="bg-gray-800 text-gray-300 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold mb-6">Contact Info</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block">Phone:</span>
                  <span className="text-gray-300">8971749741</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block">Email:</span>
                  <span className="text-gray-300">support@ka53mensclub.com</span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <span className="text-gray-400 block">Address:</span>
                  <span className="text-gray-300">
                    5TH CROSS, sri chaitanya school backgate krpuram, Krishna Nagar Main Road, kr puram, Bengaluru, Karnataka 560036
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-4 border-t border-gray-800">
              <h4 className="text-white font-medium mb-2">WORKING HOURS:</h4>
              <p className="text-gray-300">Mon - Sun / 9:00 AM - 22:00 PM</p>
            </div>
          </div>

          {/* My Account Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold mb-6">My Account</h3>
            
            <div className="space-y-3">
              <a 
                href="/auth/login" 
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform"
              >
                → Log In
              </a>
              <a 
                href="/auth/register" 
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform"
              >
                → Register
              </a>
              <a 
                href="/shop/account" 
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform"
              >
                → Track your order
              </a>
            </div>
          </div>

          {/* More Info Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold mb-6">More Info</h3>
            
            <div className="space-y-3">
              <a 
                href="/shop/about/terms-of-service" 
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform"
              >
                → Terms Of Service
              </a>
              <a 
                href="/shop/about/privacy-policy" 
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform"
              >
                → Privacy Policy
              </a>
              <a 
                href="/shop/about/shipping-policy" 
                className="block text-gray-300 hover:text-orange-400 transition-colors duration-200 hover:translate-x-1 transform"
              >
                → Shipping Policy
              </a>
            </div>
          </div>

          {/* Connect With Us Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-semibold mb-6">Connect With Us</h3>
            
            <p className="text-gray-400 text-sm mb-6">
              Follow us on social media for latest updates, offers, and fashion trends!
            </p>
            
            <div className="space-y-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`flex items-center gap-3 text-gray-300 ${social.color} transition-all duration-300 hover:translate-x-2 transform group`}
                >
                  <social.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="text-sm font-medium">{social.label}</span>
                </a>
              ))}
            </div>

            {/* Social Media Icons Row */}
            <div className="flex gap-4 mt-6 pt-4 border-t border-gray-800">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`text-gray-400 ${social.color} transition-all duration-300 hover:scale-125 transform hover:-translate-y-1`}
                  title={social.label}
                >
                  <social.icon className="w-6 h-6" />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        {/* Bottom Copyright Section */}
        <div className="border-t border-gray-700 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Urban Trendz. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="/shop/about/terms-of-service" className="text-gray-400 hover:text-orange-400 transition-colors">
                Terms
              </a>
              <a href="/shop/about/privacy-policy" className="text-gray-400 hover:text-orange-400 transition-colors">
                Privacy
              </a>
              <a href="/shop/about/shipping-policy" className="text-gray-400 hover:text-orange-400 transition-colors">
                Shipping
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default ShoppingFooter;