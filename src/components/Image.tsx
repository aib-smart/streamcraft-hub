import { cn } from "@/lib/utils";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

const Image = ({ className, src, alt, ...props }: ImageProps) => {
  return (
    <img
      className={cn("h-auto max-w-full", className)}
      src={src}
      alt={alt}
      {...props}
    />
  );
};

export default Image;