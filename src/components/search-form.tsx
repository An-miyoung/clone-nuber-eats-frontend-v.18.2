import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";

interface ISearchProps {
  searchTerm: string;
}

const SearchForm = () => {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<ISearchProps>();

  const onSubmit: SubmitHandler<ISearchProps> = (data) => {
    const { searchTerm } = data;
    navigate(`/search?term=${searchTerm}`);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" w-full bg-black py-10 md:py-40 flex items-center justify-center"
      >
        <input
          {...register("searchTerm", { required: true, min: 3 })}
          type="search"
          placeholder="검색..."
          className="input h-9 w-1/2 md:w-3/12 border-0 rounded"
        />
      </form>
    </div>
  );
};

export default SearchForm;
