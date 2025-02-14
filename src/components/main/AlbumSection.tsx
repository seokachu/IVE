import AlbumList from "@/components/main/AlbumList";

const AlbumSection = () => {
  return (
    <section
      id="second-section"
      className="h-screen min-h-[100dvh] bg-pink-300 w-full relative flex items-center justify-center"
    >
      <video
        className="h-full w-full object-cover absolute top-0 left-0"
        src="https://res.cloudinary.com/dknj7kdek/video/upload/v1729011643/1110732_Animation_Blurred_3840x2160_diyuzd.mp4"
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
      />
      <div className="min-h-screen relative py-20 w-full flex justify-center items-center flex-col lg:gap-[80px] lg:justify-start text-white">
        <h2 className="text-2xl font-bold lg:text-4xl mb-5">ALBUM</h2>
        <ul className="px-5 w-full min-h-[500px]">
          <AlbumList />
        </ul>
      </div>
    </section>
  );
};

export default AlbumSection;
