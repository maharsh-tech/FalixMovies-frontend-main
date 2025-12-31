import React, { useState, useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { FcVlc } from "react-icons/fc";
import { FaPlay, FaCheckCircle, FaAndroid, FaDesktop, FaApple, FaExclamationTriangle } from "react-icons/fa";
import { MdHighQuality, MdSubtitles, MdWarning } from "react-icons/md";
import { BiTime } from "react-icons/bi";
import { IoClose } from "react-icons/io5";

const VlcPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [deviceType, setDeviceType] = useState("desktop"); // "android", "ios", "desktop"

  useEffect(() => {
    // Detect device type
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      setDeviceType("ios");
    } else if (/android/i.test(userAgent)) {
      setDeviceType("android");
    } else {
      setDeviceType("desktop");
    }

    // Check if popup was already shown in this session
    const hasSeenPopup = sessionStorage.getItem("vlcPopupShown");
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem("vlcPopupShown", "true");
    setIsOpen(false);
  };

  // Android-specific features
  const androidFeatures = [
    {
      icon: <MdHighQuality className="text-2xl text-otherColor" />,
      title: "HD Streaming",
      desc: "Stream directly in VLC without downloading",
    },
    {
      icon: <MdSubtitles className="text-2xl text-otherColor" />,
      title: "Subtitle Support",
      desc: "Full support for embedded subtitles",
    },
    {
      icon: <BiTime className="text-2xl text-otherColor" />,
      title: "Background Play",
      desc: "Continue audio when screen is off",
    },
  ];

  // Desktop-specific features
  const desktopFeatures = [
    {
      icon: <MdHighQuality className="text-2xl text-otherColor" />,
      title: "4K Quality Playback",
      desc: "Stream in original quality without compression",
    },
    {
      icon: <MdSubtitles className="text-2xl text-otherColor" />,
      title: "Advanced Subtitles",
      desc: "Load external SRT, ASS, and embedded subs",
    },
    {
      icon: <BiTime className="text-2xl text-otherColor" />,
      title: "Resume Playback",
      desc: "Continue watching from where you left off",
    },
  ];

  const features = deviceType === "android" ? androidFeatures : desktopFeatures;

  // iOS Warning Content
  if (deviceType === "ios") {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        backdrop="blur"
        size="md"
        className="bg-bgColorSecondary/95 text-primaryTextColor mx-4"
        hideCloseButton
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 pb-0">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <FaApple className="text-4xl text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-red-400">
                  iOS Not Supported
                </h3>
                <p className="text-sm text-secondaryTextColor font-normal">
                  We're sorry for the inconvenience
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="py-5">
            {/* Warning Message */}
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <FaExclamationTriangle className="text-red-400 text-xl mt-1 flex-shrink-0" />
                <p className="text-primaryTextColor text-sm leading-relaxed">
                  Unfortunately, this website <span className="text-red-400 font-semibold">does not work on iOS devices</span> (iPhone/iPad). 
                  Apple's restrictions prevent direct video streaming through external players.
                </p>
              </div>
            </div>

            {/* Suggestions */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-secondaryTextColor uppercase tracking-wider">
                What you can do:
              </h4>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-bgColor/50">
                <div className="p-2 bg-bgColor rounded-lg flex-shrink-0">
                  <FaDesktop className="text-xl text-otherColor" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primaryTextColor">
                    Use a PC or Laptop
                  </h4>
                  <p className="text-xs text-secondaryTextColor mt-0.5">
                    Access our full library on Windows, Mac, or Linux
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-bgColor/50">
                <div className="p-2 bg-bgColor rounded-lg flex-shrink-0">
                  <FaAndroid className="text-xl text-green-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primaryTextColor">
                    Use an Android Device
                  </h4>
                  <p className="text-xs text-secondaryTextColor mt-0.5">
                    Full streaming support with VLC or MX Player
                  </p>
                </div>
              </div>
            </div>
          </ModalBody>

          <ModalFooter className="pt-0">
            <Button
              onClick={handleClose}
              className="w-full bg-red-500/80 hover:bg-red-600 text-white font-semibold rounded-xl py-6"
            >
              I Understand
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  // Android Content
  if (deviceType === "android") {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        backdrop="blur"
        size="md"
        className="bg-bgColorSecondary/95 text-primaryTextColor mx-4"
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 pb-0">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/20 rounded-xl">
                <FaAndroid className="text-4xl text-green-400" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primaryTextColor">
                  Android User?
                </h3>
                <p className="text-sm text-secondaryTextColor font-normal">
                  Use VLC for the best experience
                </p>
              </div>
            </div>
          </ModalHeader>

          <ModalBody className="py-5">
            {/* Main Message */}
            <div className="bg-gradient-to-r from-green-500/10 to-otherColor/10 border border-green-500/20 rounded-xl p-4 mb-4">
              <div className="flex items-start gap-3">
                <FcVlc className="text-2xl mt-0.5 flex-shrink-0" />
                <p className="text-primaryTextColor text-sm leading-relaxed">
                  Watch <span className="text-otherColor font-semibold">Movies</span> and{" "}
                  <span className="text-accent font-semibold">Series</span> directly using{" "}
                  <span className="font-bold text-orange-400">VLC Player</span> for smooth, 
                  high-quality streaming on your phone!
                </p>
              </div>
            </div>

            {/* Features Grid */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-bgColor/50 hover:bg-bgColor/80 transition-colors"
                >
                  <div className="p-2 bg-bgColor rounded-lg flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-primaryTextColor flex items-center gap-2">
                      {feature.title}
                      <FaCheckCircle className="text-green-400 text-xs" />
                    </h4>
                    <p className="text-xs text-secondaryTextColor mt-0.5">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Download Link */}
            <div className="mt-4 p-3 bg-bgColor rounded-xl border border-glass">
              <p className="text-xs text-secondaryTextColor mb-2">
                Don't have VLC? Get it free:
              </p>
              <a
                href="https://play.google.com/store/apps/details?id=org.videolan.vlc"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm font-medium"
              >
                <FcVlc className="text-lg" />
                Download VLC from Play Store
              </a>
            </div>
          </ModalBody>

          <ModalFooter className="pt-0">
            <Button
              onClick={handleClose}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl py-6"
            >
              Got it, let's watch!
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }

  // Desktop/PC Content
  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      backdrop="blur"
      size="md"
      className="bg-bgColorSecondary/95 text-primaryTextColor mx-4"
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1 pb-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-bgColor rounded-xl">
              <FaDesktop className="text-4xl text-otherColor" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primaryTextColor">
                Welcome, PC User!
              </h3>
              <p className="text-sm text-secondaryTextColor font-normal">
                Use VLC for the best viewing experience
              </p>
            </div>
          </div>
        </ModalHeader>

        <ModalBody className="py-5">
          {/* Main Message */}
          <div className="bg-gradient-to-r from-otherColor/10 to-accent/10 border border-otherColor/20 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <FcVlc className="text-2xl mt-0.5 flex-shrink-0" />
              <p className="text-primaryTextColor text-sm leading-relaxed">
                For seamless playback of <span className="text-otherColor font-semibold">Movies</span> and{" "}
                <span className="text-accent font-semibold">Series</span>, we recommend{" "}
                <span className="font-bold text-orange-400">VLC Media Player</span>. It provides 
                the best compatibility and streaming quality.
              </p>
            </div>
          </div>

          {/* Features Grid */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-3 rounded-lg bg-bgColor/50 hover:bg-bgColor/80 transition-colors"
              >
                <div className="p-2 bg-bgColor rounded-lg flex-shrink-0">
                  {feature.icon}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-primaryTextColor flex items-center gap-2">
                    {feature.title}
                    <FaCheckCircle className="text-green-400 text-xs" />
                  </h4>
                  <p className="text-xs text-secondaryTextColor mt-0.5">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Download Link */}
          <div className="mt-4 p-3 bg-bgColor rounded-xl border border-glass">
            <p className="text-xs text-secondaryTextColor mb-2">
              Don't have VLC Player?
            </p>
            <a
              href="https://www.videolan.org/vlc/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-otherColor hover:text-primaryBtn transition-colors text-sm font-medium"
            >
              <FcVlc className="text-lg" />
              Download VLC Player (Free)
              <span className="text-xs text-secondaryTextColor">→ videolan.org</span>
            </a>
          </div>
        </ModalBody>

        <ModalFooter className="pt-0">
          <Button
            onClick={handleClose}
            className="w-full bg-primaryBtn hover:bg-primaryBtnHower text-white font-semibold rounded-xl py-6"
          >
            Got it, let's watch!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default VlcPopup;
