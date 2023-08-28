import React from 'react'
import { SingleSwatchWrapper } from '../components';
type SwatchProps = {
  activeData: any,
  swatchData: any,
  handleSwatchClick: any
  condition:any
}

const SwatchWrapper = ({activeData,swatchData, condition, handleSwatchClick}:SwatchProps) => {

  const handleSwatchClicked = (item:any) => {
    if(condition) return
    handleSwatchClick(item)

  }
  return (
    <div className='h-fit absolute z-20 w-full bottom-0 flex justify-center gap-8 mb-2 lg:w-fit lg:inset-y-[40%] lg:right-20 lg:flex-col'>
      
      {swatchData.map((item:any) => (
        <SingleSwatchWrapper key={item.id} item={item} handleClick= {handleSwatchClicked} activeId= {activeData.id}/>
      ))}
    </div>
  )
}

export default SwatchWrapper