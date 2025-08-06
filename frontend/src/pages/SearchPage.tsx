import Oops from "../components/Oops";
import imgOops from "../Images/oops2.png";

const SearchPage = () => {
  return (
    <>
      <div className="div flex items-center pr-5 pt-4 justify-end">
        <div className="inputBox !w-[400px] !p-[5px]">
          <input type="text" placeholder="Search Notes" />
        </div>
      </div>
      <div className="gridItems gridOne"></div>
      <Oops
        image={imgOops}
        title={"No Search Results Found For hacking"}
        buttonTitle={"Go Back"}
        buttonLink={"/"}
      ></Oops>
    </>
  );
};

export default SearchPage;
