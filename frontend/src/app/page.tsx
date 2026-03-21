export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-olive-50 py-20 md:py-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          {/* Subtle grid pattern or shapes */}
          <svg className="absolute h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leaf-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M20 5 Q 30 5 30 15 Q 30 25 20 25 Q 10 25 10 15 Q 10 5 20 5 Z" fill="none" stroke="currentColor" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leaf-pattern)" />
          </svg>
        </div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center rounded-full border border-olive-200 bg-white/50 px-3 py-1 text-sm text-olive-800 backdrop-blur-sm mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-olive-500 mr-2 animate-pulse"></span>
            Smart Agriculture 2.0
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-olive-900 max-w-4xl mb-6">
            Cultivate the future with <span className="text-transparent bg-clip-text bg-gradient-to-r from-olive-600 to-olive-400">AI & IoT</span>.
          </h1>
          
          <p className="text-lg md:text-xl text-olive-700 max-w-2xl mb-10 leading-relaxed">
            A comprehensive Data Science system designed to monitor, analyze, and optimize crop yields using real-time IoT sensors and advanced AI forecasting.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <button className="rounded-full bg-olive-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-olive-700 hover:-translate-y-0.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600 active:scale-95 duration-200">
              Get Started
            </button>
            <button className="rounded-full bg-white border border-olive-200 px-8 py-3.5 text-base font-semibold text-olive-800 shadow-sm hover:bg-olive-50 hover:-translate-y-0.5 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-olive-600 active:scale-95 duration-200">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-28 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-olive-900 mb-4">Intelligent capabilities for modern farming</h2>
            <p className="text-olive-600 text-lg">Harness the power of data to make informed decisions that reduce waste and boost productivity.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group relative rounded-2xl border border-olive-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-olive-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-olive-50 text-olive-600 group-hover:bg-olive-600 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <h3 className="text-xl font-bold text-olive-900 mb-3">Yield Forecasting</h3>
              <p className="text-olive-600 leading-relaxed">
                Advanced machine learning models analyze historical and real-time data to predict crop yields with unprecedented accuracy.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="group relative rounded-2xl border border-olive-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-olive-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-olive-50 text-olive-600 group-hover:bg-olive-600 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.5 19.5v-15h-11v15z"/><path d="M8.5 7.5h7"/><path d="M8.5 11.5h7"/><path d="M8.5 15.5h7"/></svg>
              </div>
              <h3 className="text-xl font-bold text-olive-900 mb-3">IoT Sensor Integration</h3>
              <p className="text-olive-600 leading-relaxed">
                Seamlessly connect and aggregate data from soil moisture, temperature, and humidity sensors deployed across your fields.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="group relative rounded-2xl border border-olive-100 bg-white p-8 shadow-sm hover:shadow-xl hover:border-olive-200 transition-all duration-300 transform hover:-translate-y-1">
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-olive-50 text-olive-600 group-hover:bg-olive-600 group-hover:text-white transition-colors duration-300">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20"/><path d="m17 12-5 5-5-5"/><path d="m17 12-5-5-5 5"/></svg>
              </div>
              <h3 className="text-xl font-bold text-olive-900 mb-3">Automated Insights</h3>
              <p className="text-olive-600 leading-relaxed">
                Receive proactive alerts and actionable recommendations for irrigation, fertilization, and pest management.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Visual Section */}
      <section className="w-full py-20 bg-olive-900 text-white overflow-hidden relative">
        {/* Abstract shapes for decoration */}
        <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-olive-800 opacity-50 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 rounded-full bg-olive-700 opacity-50 blur-3xl"></div>
        
        <div className="container mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-3xl md:text-5xl font-bold">Data-driven decisions for sustainable growth.</h2>
            <p className="text-olive-200 text-lg max-w-xl">
              Our AI models continuously learn from environmental variables and crop conditions, helping you optimize resources while maximizing the quality and quantity of your harvest.
            </p>
            <ul className="space-y-4 pt-4">
              <li className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-olive-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Reduce water usage by up to 30%</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-olive-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Predict harvest timelines accurately</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-olive-600 flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                </div>
                <span>Identify crop stress before it escalates</span>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 w-full max-w-md relative aspect-square">
            <div className="w-full h-full rounded-3xl bg-olive-800 border border-olive-700 shadow-2xl overflow-hidden relative flex flex-col items-center justify-center">
              {/* Mock Dashboard UI */}
              <div className="absolute top-0 w-full h-12 bg-olive-900 border-b border-olive-700 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-80"></div>
              </div>
              <div className="p-8 w-full h-full mt-12 flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="h-4 w-24 bg-olive-700 rounded animate-pulse"></div>
                  <div className="h-6 w-16 bg-olive-600 rounded-full"></div>
                </div>
                <div className="w-full h-32 bg-olive-700/50 border border-olive-600 rounded-xl relative overflow-hidden flex items-end">
                   {/* Mock Chart Area */}
                   <svg viewBox="0 0 100 40" className="w-full text-olive-400 opacity-80" preserveAspectRatio="none">
                     <path d="M0 40 L0 30 Q 10 20 20 25 T 40 15 T 60 20 T 80 10 T 100 5 L100 40 Z" fill="currentColor" />
                   </svg>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-olive-700/50 border border-olive-600 rounded-xl p-4 flex flex-col justify-between">
                    <div className="h-3 w-16 bg-olive-600 rounded"></div>
                    <div className="h-6 w-20 bg-olive-400 rounded"></div>
                  </div>
                  <div className="h-24 bg-olive-700/50 border border-olive-600 rounded-xl p-4 flex flex-col justify-between">
                    <div className="h-3 w-16 bg-olive-600 rounded"></div>
                    <div className="h-6 w-12 bg-olive-400 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
