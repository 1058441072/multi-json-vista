import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, Trash2, FileJson } from "lucide-react";
import { JsonEditor } from "./JsonEditor";
import { toast } from "sonner";

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

export interface JsonData {
  id: string;
  name: string;
  data: JsonValue;
}

interface JsonViewerProps {
  jsonData: JsonData;
  onUpdate: (id: string, newData: JsonValue) => void;
  onDelete: (id: string) => void;
  searchTerm?: string;
}

export const JsonViewer = ({ jsonData, onUpdate, onDelete, searchTerm }: JsonViewerProps) => {
  const [localData, setLocalData] = useState<JsonValue>(jsonData.data);

  const handleChange = (path: string, newValue: JsonValue) => {
    // Simple implementation - in production, use proper path-based updates
    console.log("Update path:", path, "New value:", newValue);
    onUpdate(jsonData.id, localData);
  };

  const handleDeleteNode = (path: string) => {
    console.log("Delete path:", path);
    // Implement delete logic here
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(localData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${jsonData.name}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success(`Exported ${jsonData.name}`);
  };

  const getJsonStats = () => {
    const str = JSON.stringify(localData);
    const size = new Blob([str]).size;
    const nodeCount = str.split(/[{[\]},:]/).length;
    return {
      size: (size / 1024).toFixed(2) + " KB",
      nodes: nodeCount,
    };
  };

  const stats = getJsonStats();

  return (
    <Card className="flex flex-col h-full bg-card border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-toolbar-bg">
        <div className="flex items-center gap-2">
          <FileJson className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold text-sm">{jsonData.name}</h3>
            <p className="text-xs text-muted-foreground">
              {stats.size} • {stats.nodes} nodes
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            title="Export JSON"
          >
            <Download className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(jsonData.id)}
            className="hover:bg-destructive/20 hover:text-destructive"
            title="Remove JSON"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 bg-editor-bg">
        <div className="group">
          <JsonEditor
            data={localData}
            onChange={handleChange}
            onDelete={handleDeleteNode}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    </Card>
  );
};
