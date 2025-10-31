import { cn } from "@/app/lib/utils"

interface Props {
    children: React.ReactNode
    className?: string
}

export default function Container({children, className=""} : Props) {
    return (
        <div className={cn("mx-auto max-w-[400px]", className)}>
            {children}
        </div>
    )
}