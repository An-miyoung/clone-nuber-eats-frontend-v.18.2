import React from "react";
import { Link } from "react-router-dom";

interface IRestaurnatProps {
  id: string;
  coverImg: string;
  name: string;
  categoryName?: string;
}

const Restaurant: React.FC<IRestaurnatProps> = ({
  id,
  coverImg,
  name,
  categoryName,
}) => {
  return (
    <Link to={`/restaurant/${id}`}>
      <div className="flex flex-col">
        <div
          style={{ backgroundImage: `url(${coverImg})` }}
          className=" bg-gray-300 py-28 bg-cover bg-center"
        />
        <h3 className=" text-lg font-bold my-2">{name}</h3>
        <span className=" border-t-2 border-gray-400 pt-1 text-sm opacity-50">
          {categoryName}
        </span>
      </div>
    </Link>
  );
};

export default Restaurant;
