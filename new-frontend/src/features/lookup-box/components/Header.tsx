import { ArrowLeft } from "lucide-react";


interface HeaderProps {
    handleGoBack: () => void;
    title: string;
}

const Header = ({
    handleGoBack,
    title,
}: HeaderProps) => {

  return (

    <div className="h-[10vh] w-full flex items-center justify-center px-4">
        <div className="flex-[1] w-full max-w-screen-md flex items-center justify-start">
            <button 
            className="mr-6 p-2 rounded-lg font-bold bg-gray-300 mb-3 duration-300 ease-in-out shadow transform transition-all hover:shadow-xl"
            onClick={handleGoBack}
            >
            <ArrowLeft size={30} />
            </button>
            <h1 className="lg:text-2xl text-xl font-bold text-gray-900 tracking-wide text-center mb-8 pt-4">
            {title}
            </h1>
        </div>
    </div>

  );

};

export default Header;
