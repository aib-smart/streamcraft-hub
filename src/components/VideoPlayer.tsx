interface VideoPlayerProps {
  url: string;
}

const VideoPlayer = ({ url }: VideoPlayerProps) => {
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

  // Function to determine if URL is an HLS stream
  const isHLSStream = (url: string): boolean => {
    return url.toLowerCase().endsWith('.m3u8');
  };

  // Function to determine if URL is an embedded player
  const isEmbeddedPlayer = (url: string): boolean => {
    return url.includes("embed") || url.includes(".php");
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

  if (isEmbeddedPlayer(url)) {
    return (
      <iframe
        className="w-full aspect-video rounded-lg"
        src={url}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  if (isHLSStream(url)) {
    // Using JWPlayer's free HLS player service which has better compatibility
    return (
      <iframe
        className="w-full aspect-video rounded-lg"
        src={`https://cdn.jwplayer.com/players/default-mediaplayer.html?file=${encodeURIComponent(url)}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  // For regular video files (MP4, AVI, etc.)
  return (
    <video
      className="w-full aspect-video rounded-lg"
      controls
      playsInline
    >
      <source src={url} type="video/mp4" />
      <source src={url} type="video/webm" />
      <source src={url} type="video/avi" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;