type ButtonProps = {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
};

const Button = ({ onClick, children, className }: ButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`text-lg rounded-full text-white border-2 border-gray-400 hover:bg-white hover:text-black transition-all duration-300 px-4 py-1 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
