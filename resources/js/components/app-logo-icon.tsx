import type { ImgHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function AppLogoIcon({
    className,
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/images/logo_uca.png"
            alt="Logo UCA"
            className={cn("h-10 w-10 object-contain", className)}
            {...props}
        />
    );
}