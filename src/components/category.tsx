import React from "react";
import { Link } from "react-router-dom";

interface ICategoryProps {
  id: string;
  coverImg: string;
  name: string;
  slug: string;
}

const Category: React.FC<ICategoryProps> = ({ id, coverImg, name, slug }) => {
  return (
    <Link to={`/category/${slug}`} key={id}>
      <div
        key={id}
        className=" w-16 md:w-20 flex flex-col group justify-center items-center cursor-pointer"
      >
        <div
          style={{ backgroundImage: `url(${coverImg})` }}
          className=" w-10 h-10 md:w-16 md:h-16 rounded-full bg-cover group-hover:bg-gray-300"
        />
        <span className=" text-sm text-center font-medium mt-1">{name}</span>
      </div>
    </Link>
  );
};

export default Category;
