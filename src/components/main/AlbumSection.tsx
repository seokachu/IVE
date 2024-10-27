import AlbumList from "@/components/main/AlbumList";

const AlbumSection = () => {
  return (
    <section className="h-screen w-full relative flex items-center justify-center">
      <video
        className="h-screen w-full object-cover absolute"
        src="https://res.cloudinary.com/dknj7kdek/video/upload/v1729011643/1110732_Animation_Blurred_3840x2160_diyuzd.mp4"
        autoPlay
        muted
        loop
      />
      <div className="absolute w-full flex justify-center items-center flex-col lg:gap-[80px] lg:justify-start text-white">
        <h2 className="text-2xl font-bold lg:text-4xl">ALBUM</h2>
        <ul className="px-5 w-full">
          <AlbumList />
        </ul>
      </div>
    </section>
  );
};

export default AlbumSection;
