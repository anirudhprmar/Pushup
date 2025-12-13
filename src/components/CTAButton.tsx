import { Button } from "~/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTAButton({text}:{text:string}) {
  return (
      <Button
        className="group relative rounded-xl px-4 py-6 text-xl font-semibold text-white transition-all duration-300 bg-linear-to-b from-[#6366f1] to-[#4338ca] shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.4),inset_0px_-2px_0px_0px_rgba(0,0,0,0.2),0px_0px_0px_1px_#3730a3,0px_10px_20px_-5px_rgba(67,56,202,0.4)] hover:scale-[1.03] hover:shadow-[inset_0px_1px_1px_0px_rgba(255,255,255,0.5),inset_0px_-2px_0px_0px_rgba(0,0,0,0.2),0px_0px_0px_1px_#3730a3,0px_15px_30px_-5px_rgba(67,56,202,0.6)] 
        active:scale-[0.98] 
        active:shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.2),inset_0px_-1px_0px_0px_rgba(0,0,0,0.2),0px_0px_0px_1px_#3730a3,0px_5px_10px_-5px_rgba(67,56,202,0.4)]"
      >
        <span className="relative z-10 flex items-center gap-2 drop-shadow-md text-sm">
          {text}
          <ArrowRight className="h-6 w-6 stroke-[2.5px] transition-transform duration-300 group-hover:translate-x-1" />
        </span>
      </Button>
  )
}