import React from "react";
import {
  Wrench,
  Clock,
  AlertTriangle,
  ArrowRight,
  Facebook,
  Instagram,
  Youtube,
  Twitter,
  MessageCircle,
} from "lucide-react";

const Maintenance = () => {
  const socialLinks = [
    {
      icon: Facebook,
      href: "https://www.facebook.com/aribenchimallu",
      color: "hover:text-blue-500",
      label: "Facebook",
    },
    {
      icon: Instagram,
      href: "https://www.instagram.com/urban_trendz_mudhol/",
      color: "hover:text-pink-500",
      label: "Instagram",
    },
    {
      icon: Youtube,
      href: "https://youtube.com/@urbantrendzmudhol",
      color: "hover:text-red-500",
      label: "YouTube",
    },
    {
      icon: Twitter,
      href: "https://g.co/kgs/noC8dHZ",
      color: "hover:text-blue-400",
      label: "Google Review",
    },
    {
      icon: MessageCircle,
      href: "https://api.whatsapp.com/send/?phone=9538245678&text&type=phone_number&app_absent=0",
      color: "hover:text-green-500",
      label: "WhatsApp",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* Main Icon */}
        <div className="relative mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 md:w-32 md:h-32 bg-orange-500/10 rounded-full border-2 border-orange-500/20 mb-6">
            <Wrench className="w-12 h-12 md:w-16 md:h-16 text-orange-400" />
          </div>

          {/* Animated dots */}
          <div className="absolute -top-2 -right-2">
            <div className="flex space-x-1">
              <div
                className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              ></div>
              <div
                className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
          We'll Be Right
          <span className="block text-orange-400">Back!</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
          We're currently performing scheduled maintenance to improve your
          shopping experience. We'll be back online shortly!
        </p>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12">
          {/* Estimated Time */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
            <Clock className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold text-lg mb-2">
              Estimated Time
            </h3>
            <p className="text-gray-400 text-sm">2-4 hours</p>
          </div>

          {/* Current Status */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
            <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold text-lg mb-2">
              Current Status
            </h3>
            <p className="text-gray-400 text-sm">Upgrading Systems</p>
          </div>

          {/* Progress */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-orange-500/30 transition-all duration-300">
            <div className="w-8 h-8 mx-auto mb-3 relative">
              <div className="w-8 h-8 border-4 border-orange-500/20 border-t-orange-400 rounded-full animate-spin"></div>
            </div>
            <h3 className="text-white font-semibold text-lg mb-2">Progress</h3>
            <p className="text-gray-400 text-sm">65% Complete</p>
          </div>
        </div>

        {/* What's Being Updated */}
        <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
            What We're Improving
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div className="flex items-start space-x-3">
              <ArrowRight className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">Enhanced Performance</h4>
                <p className="text-gray-400 text-sm">
                  Faster page loads and smoother browsing
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <ArrowRight className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">New Features</h4>
                <p className="text-gray-400 text-sm">
                  Exciting updates to improve your experience
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <ArrowRight className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">Security Updates</h4>
                <p className="text-gray-400 text-sm">
                  Enhanced protection for your data
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <ArrowRight className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-white font-medium">Bug Fixes</h4>
                <p className="text-gray-400 text-sm">
                  Resolving issues for better reliability
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="bg-gradient-to-r from-orange-500/10 to-amber-500/10 rounded-2xl p-6 md:p-8 border border-orange-500/20">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
            Stay Connected
          </h3>
          <p className="text-gray-300 mb-6">
            Follow us on social media for real-time updates on our maintenance
            progress
          </p>

          <div className="flex justify-center gap-6">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.href}
                className={`text-gray-400 ${social.color} transition-all duration-300 hover:scale-125 transform hover:-translate-y-1`}
                title={social.label}
              >
                <social.icon className="w-8 h-8" />
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            Thank you for your patience • We appreciate your understanding
          </p>
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
