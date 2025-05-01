import React from "react";

interface HeaderProps {
  name: string;
}

const Header: React.FC<HeaderProps> = ({ name }) => {
  return (
    <header className="flex gap-10 justify-between items-center mt-6 w-full">
      <div className="flex gap-3 self-stretch pr-14 my-auto min-w-60 w-[286px]">
        <div className="flex gap-2.5 justify-center items-center px-2 my-auto w-12 h-12 rounded-3xl bg-zinc-300 min-h-12">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/325e4ad6fc39f50c722d6e48e055e22056e46741?placeholderIfAbsent=true&apiKey=21f0d2bdb9a14271bd5d002b9ab383d8"
            className="object-contain self-stretch my-auto aspect-square w-[34px]"
            alt="User avatar"
          />
        </div>
        <div className="flex flex-col justify-center font-medium">
          <p className="text-sm tracking-normal text-slate-500">Welcome,</p>
          <h1 className="text-xl tracking-tight leading-8 text-black">
            {name}
          </h1>
        </div>
      </div>
      <button
        className="flex shrink-0 self-stretch my-auto h-[22px] w-[22px]"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-full h-full text-slate-500"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
        </svg>
      </button>
    </header>
  );
};

export default Header;
