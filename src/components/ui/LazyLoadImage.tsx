import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

type Props = {
  alt: string;
  src: string;
  className?: string;
};

export default function LazyLoadImageRC({ alt, src, className }: Props) {
  return (
    <LazyLoadImage
      alt={alt}
      src={src}
      effect="blur"
      // wrapperClassName passes your layout classes directly to the component wrapper element
      wrapperClassName={className}
      wrapperProps={{
        style: { transitionDelay: "1s" },
      }}
      className="w-full h-full object-cover"
    />
  );
}
