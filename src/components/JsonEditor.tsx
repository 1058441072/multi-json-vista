import { useState } from "react";
import { ChevronRight, ChevronDown, Edit2, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
interface JsonObject {
  [key: string]: JsonValue;
}
type JsonArray = JsonValue[];

interface JsonEditorProps {
  data: JsonValue;
  path?: string;
  onChange?: (path: string, newValue: JsonValue) => void;
  onDelete?: (path: string) => void;
  searchTerm?: string;
}

export const JsonEditor = ({ 
  data, 
  path = "$", 
  onChange, 
  onDelete,
  searchTerm = ""
}: JsonEditorProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [editing, setEditing] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  const toggleExpand = (nodePath: string) => {
    setExpanded(prev => ({ ...prev, [nodePath]: !prev[nodePath] }));
  };

  const startEdit = (nodePath: string, value: JsonValue) => {
    setEditing(nodePath);
    setEditValue(JSON.stringify(value));
  };

  const saveEdit = (nodePath: string) => {
    try {
      const parsedValue = JSON.parse(editValue);
      onChange?.(nodePath, parsedValue);
      setEditing(null);
      toast.success("Value updated");
    } catch (error) {
      toast.error("Invalid JSON value");
    }
  };

  const copyValue = (value: JsonValue) => {
    navigator.clipboard.writeText(JSON.stringify(value, null, 2));
    toast.success("Copied to clipboard");
  };

  const handleDelete = (nodePath: string) => {
    onDelete?.(nodePath);
    toast.success("Deleted");
  };

  const isHighlighted = (key: string, value: JsonValue): boolean => {
    if (!searchTerm) return false;
    const searchLower = searchTerm.toLowerCase();
    const keyMatch = key.toLowerCase().includes(searchLower);
    const valueMatch = String(value).toLowerCase().includes(searchLower);
    return keyMatch || valueMatch;
  };

  const renderValue = (value: JsonValue, key: string, currentPath: string): JSX.Element => {
    const isExpanded = expanded[currentPath];
    const highlighted = isHighlighted(key, value);
    const isEditing = editing === currentPath;

    if (value === null) {
      return (
        <div className={`flex items-center gap-2 py-1 px-2 rounded ${highlighted ? 'bg-yellow-500/20' : ''}`}>
          <span className="json-key">{key}:</span>
          <span className="json-null">null</span>
          <ActionButtons 
            path={currentPath} 
            value={value}
            onEdit={startEdit}
            onCopy={copyValue}
            onDelete={handleDelete}
          />
        </div>
      );
    }

    if (typeof value === "boolean") {
      return (
        <div className={`flex items-center gap-2 py-1 px-2 rounded ${highlighted ? 'bg-yellow-500/20' : ''}`}>
          <span className="json-key">{key}:</span>
          <span className="json-boolean">{String(value)}</span>
          <ActionButtons 
            path={currentPath} 
            value={value}
            onEdit={startEdit}
            onCopy={copyValue}
            onDelete={handleDelete}
          />
        </div>
      );
    }

    if (typeof value === "number") {
      return (
        <div className={`flex items-center gap-2 py-1 px-2 rounded ${highlighted ? 'bg-yellow-500/20' : ''}`}>
          <span className="json-key">{key}:</span>
          {isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit(currentPath)}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit(currentPath)}
              className="h-6 w-32 text-sm"
              autoFocus
            />
          ) : (
            <span className="json-number">{value}</span>
          )}
          <ActionButtons 
            path={currentPath} 
            value={value}
            onEdit={startEdit}
            onCopy={copyValue}
            onDelete={handleDelete}
          />
        </div>
      );
    }

    if (typeof value === "string") {
      return (
        <div className={`flex items-center gap-2 py-1 px-2 rounded ${highlighted ? 'bg-yellow-500/20' : ''}`}>
          <span className="json-key">{key}:</span>
          {isEditing ? (
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={() => saveEdit(currentPath)}
              onKeyDown={(e) => e.key === 'Enter' && saveEdit(currentPath)}
              className="h-6 flex-1 text-sm"
              autoFocus
            />
          ) : (
            <span className="json-string">"{value}"</span>
          )}
          <ActionButtons 
            path={currentPath} 
            value={value}
            onEdit={startEdit}
            onCopy={copyValue}
            onDelete={handleDelete}
          />
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div>
          <div 
            className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-hover-bg ${highlighted ? 'bg-yellow-500/20' : ''}`}
            onClick={() => toggleExpand(currentPath)}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="json-key">{key}:</span>
            <span className="text-muted-foreground">[{value.length}]</span>
            <ActionButtons 
              path={currentPath} 
              value={value}
              onEdit={startEdit}
              onCopy={copyValue}
              onDelete={handleDelete}
            />
          </div>
          {isExpanded && (
            <div className="ml-6 border-l border-border pl-2">
              {value.map((item, index) => (
                <JsonEditor
                  key={index}
                  data={item}
                  path={`${currentPath}[${index}]`}
                  onChange={onChange}
                  onDelete={onDelete}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    if (typeof value === "object") {
      const entries = Object.entries(value);
      return (
        <div>
          <div 
            className={`flex items-center gap-2 py-1 px-2 rounded cursor-pointer hover:bg-hover-bg ${highlighted ? 'bg-yellow-500/20' : ''}`}
            onClick={() => toggleExpand(currentPath)}
          >
            {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            <span className="json-key">{key}:</span>
            <span className="text-muted-foreground">{`{${entries.length}}`}</span>
            <ActionButtons 
              path={currentPath} 
              value={value}
              onEdit={startEdit}
              onCopy={copyValue}
              onDelete={handleDelete}
            />
          </div>
          {isExpanded && (
            <div className="ml-6 border-l border-border pl-2">
              {entries.map(([objKey, objValue]) => (
                <JsonEditor
                  key={objKey}
                  data={objValue}
                  path={`${currentPath}.${objKey}`}
                  onChange={onChange}
                  onDelete={onDelete}
                  searchTerm={searchTerm}
                />
              ))}
            </div>
          )}
        </div>
      );
    }

    return <div>Unsupported type</div>;
  };

  if (path === "$") {
    if (Array.isArray(data)) {
      return (
        <div className="json-editor">
          {data.map((item, index) => (
            <JsonEditor
              key={index}
              data={item}
              path={`$[${index}]`}
              onChange={onChange}
              onDelete={onDelete}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      );
    }
    if (typeof data === "object" && data !== null) {
      return (
        <div className="json-editor">
          {Object.entries(data).map(([key, value]) => (
            <JsonEditor
              key={key}
              data={value}
              path={`$.${key}`}
              onChange={onChange}
              onDelete={onDelete}
              searchTerm={searchTerm}
            />
          ))}
        </div>
      );
    }
  }

  const pathParts = path.split(/[.[\]]/).filter(Boolean);
  const key = pathParts[pathParts.length - 1] || "root";

  return renderValue(data, key, path);
};

interface ActionButtonsProps {
  path: string;
  value: JsonValue;
  onEdit: (path: string, value: JsonValue) => void;
  onCopy: (value: JsonValue) => void;
  onDelete: (path: string) => void;
}

const ActionButtons = ({ path, value, onEdit, onCopy, onDelete }: ActionButtonsProps) => {
  const isPrimitive = typeof value !== "object" || value === null;

  return (
    <div className="opacity-0 group-hover:opacity-100 flex gap-1 ml-auto">
      {isPrimitive && (
        <Button
          variant="ghost"
          size="sm"
          className="h-6 w-6 p-0"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(path, value);
          }}
        >
          <Edit2 className="h-3 w-3" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0"
        onClick={(e) => {
          e.stopPropagation();
          onCopy(value);
        }}
      >
        <Copy className="h-3 w-3" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-6 w-6 p-0 hover:bg-destructive/20"
        onClick={(e) => {
          e.stopPropagation();
          onDelete(path);
        }}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
    </div>
  );
};
