import { cn } from "@/lib/utils";
import { Button } from "./ui/button";

interface ToolbarButtonProps {
    onClick: () => void;
    isActive?: boolean;
    children: React.ReactNode;
    label: string;
}

export default function ToolbarButton({
    onClick,
    isActive,
    children,
    label,
}: ToolbarButtonProps) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            aria-label={label}
            className={cn(
                "h-8 w-8 p-0",
                isActive && "bg-[#bf9f62] text-white ring-1 ring-border hover:bg-[#bf9f62] hover:text-white hover:ring-1 hover:ring-border",
            )}
        >
            {children}
        </Button>
    );
}
