import React from "react";

interface ICategoryProps {
  id: string;
  coverImg: string;
  name: string;
}

const Category: React.FC<ICategoryProps> = ({ id, coverImg, name }) => {
  return (
    <div
      key={id}
      className=" w-20 flex flex-col group justify-center items-center cursor-pointer "
    >
      <div
        style={{ backgroundImage: `url(${coverImg})` }}
        className="w-16 h-16 rounded-full bg-cover group-hover:bg-gray-300"
      />
      <span className=" text-sm text-center font-medium mt-1">{name}</span>
    </div>
  );
};

export default Category;
