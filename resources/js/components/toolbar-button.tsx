import { cn } from '@/lib/utils';
import { Button } from './ui/button';

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
                'h-8 w-8 p-0',
                isActive && 'text-foreground ring-border ring-1',
            )}
        >
            {children}
        </Button>
    );
}
