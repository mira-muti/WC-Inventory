const LoadingScreen: React.FC = () => (
  <div className="flex flex-col justify-center items-center h-screen w-screen bg-neutral-100 dark:bg-neutral-900">
    <div className="w-12 h-12 border-4 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
    <p className="mt-4 text-xl text-neutral-700 dark:text-neutral-300">
      Loading...
    </p>
  </div>
);

export default LoadingScreen;
