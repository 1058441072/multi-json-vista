import { FileJson, Upload, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onUploadClick: () => void;
  onPasteClick: () => void;
}

export const EmptyState = ({ onUploadClick, onPasteClick }: EmptyStateProps) => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center max-w-md space-y-6">
        <div className="flex justify-center">
          <div className="p-6 bg-secondary rounded-full">
            <FileJson className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">Multi-JSON Visual Editor</h2>
          <p className="text-muted-foreground">
            Upload, paste, or drag JSON files to start editing
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onUploadClick} size="lg" className="gap-2">
            <Upload className="h-5 w-5" />
            Upload JSON Files
          </Button>
          <Button onClick={onPasteClick} variant="secondary" size="lg" className="gap-2">
            <Clipboard className="h-5 w-5" />
            Paste JSON
          </Button>
        </div>

        <div className="pt-4 text-sm text-muted-foreground">
          <p>Supports multiple JSON files with automatic layout</p>
          <p className="text-xs mt-2">Features: Real-time editing • Search • Export • Format</p>
        </div>
      </div>
    </div>
  );
};
