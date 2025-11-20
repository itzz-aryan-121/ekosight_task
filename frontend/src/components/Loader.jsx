const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
      <div className="text-center space-y-6">
        {/* Animated Spinner */}
        <div className="relative mx-auto w-20 h-20">
          <div className="absolute inset-0 border-4 border-yellow-500/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-yellow-500 rounded-full animate-spin"></div>
          <div className="absolute inset-2 border-4 border-yellow-500/10 rounded-full"></div>
          <div className="absolute inset-2 border-4 border-transparent border-r-yellow-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
        </div>
        
        {/* Message */}
        <div className="space-y-2">
          <p className="text-xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,215,0,0.5)]">
            {message}
          </p>
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

