import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface PasteJsonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (jsonData: any[]) => void;
}

export const PasteJsonDialog = ({
  open,
  onOpenChange,
  onSubmit,
}: PasteJsonDialogProps) => {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) {
      toast.error("Please paste JSON content");
      return;
    }

    try {
      // Try to parse as single JSON first
      const parsed = JSON.parse(text);
      const dataArray = Array.isArray(parsed) ? parsed : [parsed];
      onSubmit(dataArray);
      setText("");
      onOpenChange(false);
      toast.success(`Added ${dataArray.length} JSON${dataArray.length > 1 ? 's' : ''}`);
    } catch (error) {
      // Try to parse as multiple JSONs separated by newlines
      const lines = text.split("\n").filter((line) => line.trim());
      const jsonArray: any[] = [];
      let hasError = false;

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          jsonArray.push(parsed);
        } catch (e) {
          hasError = true;
          break;
        }
      }

      if (hasError || jsonArray.length === 0) {
        toast.error("Invalid JSON format. Please check your input.");
        return;
      }

      onSubmit(jsonArray);
      setText("");
      onOpenChange(false);
      toast.success(`Added ${jsonArray.length} JSON${jsonArray.length > 1 ? 's' : ''}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Paste JSON Data</DialogTitle>
          <DialogDescription>
            Paste one or multiple JSON objects. Separate multiple JSONs with newlines.
          </DialogDescription>
        </DialogHeader>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={`{"name": "example", "value": 123}\n{"name": "another", "items": [1, 2, 3]}`}
          className="min-h-[300px] font-mono text-sm"
        />
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Add JSON</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
