import React from "react";
import { useNavigate } from "react-router-dom";

interface OopsProps {
  image: string;
  title: string;
  buttonTitle: string;
  buttonLink: string;
}

const Oops: React.FC<OopsProps> = ({
  image,
  title,
  buttonTitle,
  buttonLink,
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <img src={image} alt="Oops" className="max-w-[300px] mb-4" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <button
        className="btnNormal px-6 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
        onClick={() => navigate(buttonLink)}
      >
        {buttonTitle}
      </button>
    </div>
  );
};

export default Oops;
