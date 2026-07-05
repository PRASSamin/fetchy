import React from "react";
import { Loader } from "lucide-react";
import { cn } from "@/utils";
import * as RadixImage from "@radix-ui/react-avatar";

const BetterVersion = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixImage.Root>
>(({ className, ...props }, ref) => (
  <RadixImage.Root
    ref={ref}
    className={cn(
      "relative w-full h-full inline-flex items-center justify-center overflow-hidden rounded align-middle",
      className
    )}
    {...props}
  />
));
BetterVersion.displayName = RadixImage.Root.displayName;

const Image = React.forwardRef<
  HTMLImageElement,
  React.ComponentPropsWithoutRef<typeof RadixImage.Image>
>(({ className, ...props }, ref) => (
  <RadixImage.Image
    ref={ref}
    className={cn("size-full rounded-[inherit] object-cover", className)}
    {...props}
  />
));
Image.displayName = RadixImage.Image.displayName;

const Fallback = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof RadixImage.Fallback>
>(({ className, ...props }, ref) => (
  <RadixImage.Fallback
    ref={ref}
    className={cn("flex h-full w-full items-center justify-center", className)}
    {...props}
  >
    <Loader className="h-4 w-4 animate-spin" />
  </RadixImage.Fallback>
));
Fallback.displayName = RadixImage.Fallback.displayName;

const BetterImage = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Image> & {
    delay?: number;
  }
>(({ src, alt, className, delay, ...props }, ref) => {
  return (
    <BetterVersion ref={ref}>
      <Image src={src} alt={alt} className={className} {...props} />
      <Fallback delayMs={delay} />
    </BetterVersion>
  );
});
BetterImage.displayName = "BetterImage";

export { BetterVersion, Image, Fallback, BetterImage };
