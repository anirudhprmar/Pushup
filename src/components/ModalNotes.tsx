"use client"

import { useState } from "react"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Textarea } from "~/components/ui/textarea"

interface ModalNotesProps {
  isOpen: boolean
  onClose: () => void
  onSave: (notes: string) => void
  title?: string
  description?: string
}

export function ModalNotes({ 
  isOpen, 
  onClose, 
  onSave, 
  title = "Add a reflection", 
  description = "How did it go? Capturing your thoughts helps you stay consistent."
}: ModalNotesProps) {
  const [notes, setNotes] = useState("")

  const handleSave = () => {
    onSave(notes)
    setNotes("")
    onClose()
  }

  const handleSkip = () => {
    onSave("")
    setNotes("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            placeholder="Write something about your progress..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[120px] resize-none focus-visible:ring-primary/50"
            autoFocus
          />
        </div>

        <DialogFooter className="flex flex-row items-center justify-end gap-2">
          <Button 
            variant="ghost" 
            onClick={handleSkip}
            className="text-muted-foreground hover:text-foreground"
          >
            Skip for now
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95"
          >
            Save Note
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
