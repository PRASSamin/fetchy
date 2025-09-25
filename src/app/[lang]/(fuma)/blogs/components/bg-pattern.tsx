import React from 'react'

const BGPattern = () => {
  return (
    <>
    <div className="absolute top-0 xl:right-1/2 right-0 translate-x-1/2 -z-10 -translate-y-1/2 w-[64rem] h-[64rem] rounded-full bg-purple-500/5  [--mask:radial-gradient(circle_at_center,purple,transparent_69%)] [mask-image:var(--mask)] [webkit-mask-image:var(--mask)] pointer-events-none"></div>
    <div className="fixed top-0 xl:right-1/2 right-0 translate-x-1/2 -z-10 -translate-y-1/2 w-[64rem] h-[64rem] rounded-full bg-purple-500/10  [--mask:radial-gradient(circle_at_center,purple,transparent_69%)] [mask-image:var(--mask)] [webkit-mask-image:var(--mask)] pointer-events-none"></div>
    <div className="absolute top-0 xl:right-1/2 right-0 translate-x-1/2 -z-10 h-[64rem] w-[64rem] opacity-80 [background-size:60px_60px] [background-position:-30px_-30px] [background-image:linear-gradient(90deg,#8884_1px,#0000_0),linear-gradient(#8884_1px,#0000_0)] bg-grid- -translate-y-1/2  [--mask:radial-gradient(circle_at_center_top,purple,transparent)] [mask-image:var(--mask)] [webkit-mask-image:var(--mask)] -skew-20 pointer-events-none"></div>
    </>
  )
}

export default BGPattern
