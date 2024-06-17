import { CgSpinner } from "react-icons/cg";

const Loader = () => {
  return (
    <div className="animate-spin  flex items-center justify-center text-blue-600 font-bold">
      <CgSpinner className="h-20 w-20" />
    </div>
  );
};

export default Loader;
