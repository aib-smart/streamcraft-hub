import { useRef } from "react";
import Flowplayer, { useFlowplayer } from "@flowplayer/react-flowplayer";

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer = ({ url }: VideoPlayerProps) => {
  const playerRef = useRef(null);
  const playerApi = useFlowplayer(playerRef);

  // Function to determine if URL is a YouTube link
  const isYouTubeUrl = (url: string): boolean => {
    return url.includes("youtube.com") || url.includes("youtu.be");
  };

  // Extract YouTube video ID
  const getYouTubeEmbedUrl = (url: string): string => {
    let videoId = "";
    if (url.includes("youtube.com/watch")) {
      videoId = new URL(url).searchParams.get("v") || "";
    } else if (url.includes("youtu.be")) {
      videoId = url.split("/").pop() || "";
    }
    return `https://www.youtube.com/embed/${videoId}`;
  };

  if (isYouTubeUrl(url)) {
    return (
      <iframe
        className="w-full aspect-video rounded-lg"
        src={getYouTubeEmbedUrl(url)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <Flowplayer
      ref={playerRef}
      src={url}
      opts={{
        ui: 10,
        asel: true,
        aspectRatio: "16:9",
      }}
      className="w-full rounded-lg overflow-hidden"
    />
  );
};

export default VideoPlayer;