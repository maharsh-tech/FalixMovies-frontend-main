import React, { useEffect } from "react";
import SEO from "../components/SEO";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Tutorial() {
  const SITENAME = import.meta.env.VITE_SITENAME;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <ToastContainer style={{ fontSize: "0.8rem" }} />
      <SEO
        title={`${SITENAME} - Tutorial`}
        description={`${SITENAME} tutorials: Android and Desktop guides.`}
        name={SITENAME}
        type="text/html"
      />

      <div className="space-y-6">
        <div
          className="max-w-6xl mx-auto px-4 md:px-0"
          style={{ color: "rgb(77, 178, 255)" }}
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tutorials</h1>
          <p className="text-lg md:text-xl mb-6">
            Follow these short guides for Android and Desktop usage.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Android Tutorial</h2>
              <div className="bg-bgColor/10 rounded-lg overflow-hidden">
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    title="Android Tutorial"
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/3fumBcKC6RE"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl md:text-3xl font-semibold mb-4">Desktop Tutorial</h2>
              <div className="bg-bgColor/10 rounded-lg overflow-hidden">
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    title="Desktop Tutorial"
                    className="absolute top-0 left-0 w-full h-full"
                    src="https://www.youtube.com/embed/2Vv-BfVoq4g"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
