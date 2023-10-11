import React from "react";
function Hero() {
  return (
    <section className="relative isolate mx-auto w-full py-12 mt-0 grid min-h-min place-items-center pb-8 pt-10 xl:pt-0">
      <div className="grid w-full max-w-[50rem] gap-4 px-4 pt-5 text-center xl:pt-20">
        <h1 className="font-headline text-4.5xl mx-auto w-2/3 font-semibold lg:w-auto">
          <span
            data-br=":r2:"
            data-brr={1}
            style={{
              display: "inline-block",
              verticalAlign: "top",
              textDecoration: "inherit",
              textWrap: "balance"
            }}
          >
            Find your happy place.
          </span>
        </h1>
        <p className="px-4 text-sm font-normal text-white">

          <span
            data-br=":r3:"
            data-brr={1}
            style={{
              display: "inline-block",
              verticalAlign: "top",
              textDecoration: "inherit",
              textWrap: "balance"
            }}
          >
            Découvrez des bons plans pour voyager à des prix fous!
          </span>
        </p>
      </div>


      <div className="flex items-center -space-x-2 mb-10">
        <img src="https://randomuser.me/api/portraits/women/79.jpg" className="w-7 h-7 rounded-full border-2 border-white" />
        <img src="https://api.uifaces.co/our-content/donated/xZ4wg2Xj.jpg" className="w-7 h-7 rounded-full border-2 border-white" />
        <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=a72ca28288878f8404a795f39642a46f" className="w-7 h-7 rounded-full border-2 border-white" />
        <img src="https://randomuser.me/api/portraits/men/86.jpg" className="w-7 h-7 rounded-full border-2 border-white" />
        <img src="https://images.unsplash.com/photo-1510227272981-87123e259b17?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=3759e09a5b9fbe53088b23c615b6312e" className="w-7 h-7 rounded-full border-2 border-white" />
        <p className="text-sm text-white font-medium translate-x-5">
          Rejoignez 5.000+ voyageurs
        </p>
      </div>
  
        <div className="flex h-12 flex-col items-center justify-center">
         
            <div className="mt-10 btn btn-md pointer-events-none absolute z-50 bg-transparent text-white opacity-100">
             
              <span className="bg-yellow-100 text-yellow-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">Nouveau</span>
              <span className="whitespace-nowrap font-medium">
                Découvrez notre Bot Whatsapp pour ne manquer aucune alerte
              </span>
            </div>
$        </div>
      <div className="after:bg-video-mask absolute inset-0 isolate -z-10 after:absolute after:inset-0">
        <video
          preload="none"
          width="100%"
          height="100%"
          loop=""
          playsInline=""
          className="min-w-[90vw] lg:min-w-[50vw] absolute left-0 top-0 -z-10 h-full w-full object-cover"
          id="heroVideo"
          poster="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAoHBwgHBgoIFAgLFQoLDhgQDhUVFRUNGg4NHSsZGBYVIh4aHysjGh0oHSEWJDUlKC0vMjIyGSI4PTcwPCsxMi8BCgsLDg0OHBAOHC8cFhwvLy8vLy87Ly8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vLy8vL//AABEIAA4AGAMBIgACEQEDEQH/xAAYAAACAwAAAAAAAAAAAAAAAAAABwIFBv/EAB0QAAAGAwEAAAAAAAAAAAAAAAABAgMFEQQhQRL/xAAWAQEBAQAAAAAAAAAAAAAAAAACAwH/xAAXEQADAQAAAAAAAAAAAAAAAAAAAhIB/9oADAMBAAIRAxEAPwBZokGvVWJ40ohvLLfRRAI6URhUZODfhc9DrSTvgBmIDIWllO+ABsnqqf/Z"
        >
          <source
            src="https://wander.sfo3.cdn.digitaloceanspaces.com/landing-hero-wander-hudson-woods.webm"
            type="video/webm"
          />
          <source
            src="https://wander.sfo3.cdn.digitaloceanspaces.com/landing-hero-wander-hudson-woods.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </section>

  );
}

export default Hero;
