import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full border-t border-olive-100 bg-olive-50 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tighter text-olive-900">
                AgriSmart AI
              </span>
            </div>
            <p className="text-olive-700 max-w-xs text-sm leading-relaxed">
              Empowering agriculture with IoT and Artificial Intelligence to maximize crop yields, sustainably and intelligently.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-olive-900 uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2">
              <li><Link href="#overview" className="text-sm text-olive-600 hover:text-olive-900 transition-colors">System Overview</Link></li>
              <li><Link href="#iot" className="text-sm text-olive-600 hover:text-olive-900 transition-colors">IoT Integration</Link></li>
              <li><Link href="#analytics" className="text-sm text-olive-600 hover:text-olive-900 transition-colors">Data Analytics</Link></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-olive-900 uppercase tracking-wider">Company</h4>
            <ul className="space-y-2">
              <li><Link href="#about" className="text-sm text-olive-600 hover:text-olive-900 transition-colors">About Us</Link></li>
              <li><Link href="#contact" className="text-sm text-olive-600 hover:text-olive-900 transition-colors">Contact</Link></li>
              <li><Link href="#privacy" className="text-sm text-olive-600 hover:text-olive-900 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-olive-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-olive-500">
            © {new Date().getFullYear()} AgriSmart AI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
