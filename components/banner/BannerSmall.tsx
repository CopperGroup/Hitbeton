import Image from "next/image"

const BannerSmall = () => {
  return (
    <article className="w-full h-72 relative rounded-3xl overflow-hidden">
      <div className="w-full h-full" style={{ backgroundImage: `url(/assets/3.jpg)`, backgroundSize: 'cover', backgroundPosition: 'center' } }></div>
      <div className="absolute inset-0 bg-black/30 z-10" />
      <div className="absolute inset-0 flex flex-col justify-center items-center z-20">
        <h1 className="text-[56px] font-semibold text-white mb-2 tracking-wide max-[440px]:text-[48px] max-[370px]:text-[40px]">
          @HitBeton
        </h1>
        <p className="text-base-regular text-white/80 text-center px-4">Crafting concrete masterpieces</p>
        <div className="mt-4">
          <span className="text-small-semibold text-white border border-white/30 backdrop-blur-sm px-6 py-2 rounded-full">
            Follow Us
          </span>
        </div>
      </div>
    </article>
  )
}

export default BannerSmall

