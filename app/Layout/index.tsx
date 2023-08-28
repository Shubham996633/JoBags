"use client"
import React, { useState } from "react";
import gsap from "gsap";
import Content from "./content";
import { data } from "../data";
import Canvas from "./canvas";

const Banner = () => {
  const banner = React.useRef<HTMLDivElement>(null); // Specify the correct type here

  const [activeData, setActiveData] = useState(data[0]);

  return (
    <div ref={banner} className="w-screen h-screen relative">
      <div className="logo absolute my-2 ml-6 text-left text-2xl font-bold tracking-widest md:ml-28 lg:ml-[12vw] lg:my-8">
        JOMISFIT.
      </div>
      <div className="w-full h-full flex justify-between items-center flex-col lg:flex-row-reverse">
        <Canvas activeData={activeData} swatchData={data} />
        <Content activeData={activeData} />
      </div>
    </div>
  );
};

export default Banner;
