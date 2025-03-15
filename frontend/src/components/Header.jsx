import React from "react";

const Header = ({ text1 }) => {
  return (
    <header className="w-full py-4 flex  items-center justify-center mb-5">
      <h1 className="text-3xl font-bold">{text1}</h1>
    </header>
  );
};

export default Header;
