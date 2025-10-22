import { Upload, FileJson, Download, Search, Code2, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ToolbarProps {
  onFileUpload: (files: FileList) => void;
  onPasteJson: () => void;
  onLoadFromBackend: () => void;
  onExportAll: () => void;
  onFormatAll: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  jsonCount: number;
}

export const Toolbar = ({
  onFileUpload,
  onPasteJson,
  onLoadFromBackend,
  onExportAll,
  onFormatAll,
  searchTerm,
  onSearchChange,
  jsonCount,
}: ToolbarProps) => {
  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onFileUpload(e.target.files);
    }
  };

  return (
    <div className="bg-toolbar-bg border-b border-border p-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Upload Button */}
        <label htmlFor="file-upload">
          <Button variant="secondary" size="sm" className="cursor-pointer" asChild>
            <span>
              <Upload className="h-4 w-4 mr-2" />
              Upload JSON
            </span>
          </Button>
          <input
            id="file-upload"
            type="file"
            accept=".json"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </label>

        {/* Paste Button */}
        <Button variant="secondary" size="sm" onClick={onPasteJson}>
          <FileJson className="h-4 w-4 mr-2" />
          Paste JSON
        </Button>

        {/* Load from Backend Button */}
        <Button variant="secondary" size="sm" onClick={onLoadFromBackend}>
          <Database className="h-4 w-4 mr-2" />
          Load from Backend
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Format Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onFormatAll}
          disabled={jsonCount === 0}
        >
          <Code2 className="h-4 w-4 mr-2" />
          Format
        </Button>

        {/* Export All Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onExportAll}
          disabled={jsonCount === 0}
        >
          <Download className="h-4 w-4 mr-2" />
          Export All
        </Button>

        {/* Divider */}
        <div className="h-6 w-px bg-border" />

        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search keys or values..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-9"
          />
        </div>

        {/* JSON Count Badge */}
        <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
          <FileJson className="h-4 w-4" />
          <span>{jsonCount} JSON{jsonCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  );
};
