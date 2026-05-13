import{useState} from "react";
import { ChevronRightIcon } from '@/components/icons';
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="mb-4 p-1 border-2 border-accent-yellow-300 rounded-lg">
      {/* Tombol Pertanyaan */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center p-2 text-left border-2 border-accent-yellow-300 rounded-lg transition-all duration-300 bg-white group  ${
          isOpen ? 'rounded-b-none border-b-1 ' : ''
        }`}
      >
        <span 
        className={`text-accent-neutral-1000 lg:text-body-1 text-sm leading-tight ${
          isOpen ? 'font-semibold' : ''
        }`}>{question}</span>
        <div className={`shrink-0 ml-4 transition-transform duration-300 transform ${isOpen ? 'rotate-90' : ''}`}>
          <ChevronRightIcon color="#FFAB2F"/>
        
        </div>
      </button>
      
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out border-x-2 border-b-2 border-accent-yellow-300 rounded-b-lg  ${
          isOpen ? 'max-h-[500px] opacity-100 p-2' : 'max-h-0 opacity-0 p-0 '
        }`}
      >
        <div className="text-sm text-accent-neutral-1000 leading-relaxed text-body-1 md:text-base">
          {answer}
        </div>
      </div>
    </div>);
};

export default FaqItem;