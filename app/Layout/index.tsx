"use client"
import React, { useEffect, useState } from "react";
import gsap from "gsap";
import Content from "./content";
import { data } from "../data";
import Canvas from "./canvas";
import { LoadingAnimation } from "../components";
 interface BannerProps {
  item:any
 }

const Banner = () => {
  const banner = React.useRef<HTMLDivElement>(null); // Specify the correct type here
  const [isLoading, setIsLoading] = useState(true);
  const [condition, setConditon] = useState(false);

  const [activeData, setActiveData] = useState(data[0]);

  const handleSwatchClick = (item:any) => {
    if(activeData.id != item.id){
      setActiveData(item)
    }

  }

  const handleLoading = () => {
    setIsLoading(false);
  
  }

  useEffect(() => {
    gsap.to(banner.current, {
      background: activeData.background,
      ease: 'power3.inOut',
      duration: 0.8,
    });

    gsap.to('.logo', {
      color: activeData.headingColor,
      ease: 'power3.inOut',
      duration: 0.8,
    });

    return () => {};
  }, [activeData]);

  return (
    <div ref={banner} className="w-screen h-screen relative">
      {isLoading ? <LoadingAnimation/>: null}
      <div className="logo absolute my-2 ml-6 text-left text-2xl font-bold tracking-widest md:ml-28 lg:ml-[12vw] lg:my-8">
        JOMISFIT.
      </div>
      <div className="w-full h-full flex justify-between items-center flex-col lg:flex-row-reverse ">
        <Canvas activeData={activeData} swatchData={data} handleSwatchClick={handleSwatchClick} handleLoading={handleLoading} condition={condition} />
        <Content activeData={activeData} condition={condition} setCondition={setConditon}  />
      </div>
    </div>
  );
};

export default Banner;
