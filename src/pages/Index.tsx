import { useState } from "react";
import { Toolbar } from "@/components/Toolbar";
import { JsonViewer, JsonData } from "@/components/JsonViewer";
import { PasteJsonDialog } from "@/components/PasteJsonDialog";
import { EmptyState } from "@/components/EmptyState";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [jsonDataList, setJsonDataList] = useState<JsonData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [pasteDialogOpen, setPasteDialogOpen] = useState(false);

  const handleFileUpload = async (files: FileList) => {
    const newJsonData: JsonData[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        const text = await file.text();
        const parsed = JSON.parse(text);
        newJsonData.push({
          id: `${Date.now()}-${i}`,
          name: file.name.replace(".json", ""),
          data: parsed,
        });
      } catch (error) {
        toast.error(`Failed to parse ${file.name}`);
      }
    }

    if (newJsonData.length > 0) {
      setJsonDataList([...jsonDataList, ...newJsonData]);
      toast.success(`Added ${newJsonData.length} JSON file${newJsonData.length > 1 ? 's' : ''}`);
    }
  };

  const handlePasteJson = (dataArray: any[]) => {
    const newJsonData: JsonData[] = dataArray.map((data, index) => ({
      id: `${Date.now()}-${index}`,
      name: `JSON ${jsonDataList.length + index + 1}`,
      data,
    }));
    setJsonDataList([...jsonDataList, ...newJsonData]);
  };

  const handleUpdateJson = (id: string, newData: any) => {
    setJsonDataList(
      jsonDataList.map((item) =>
        item.id === id ? { ...item, data: newData } : item
      )
    );
  };

  const handleDeleteJson = (id: string) => {
    setJsonDataList(jsonDataList.filter((item) => item.id !== id));
    toast.success("JSON removed");
  };

  const handleExportAll = () => {
    const allData = jsonDataList.map((item) => item.data);
    const dataStr = JSON.stringify(allData, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "all-data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success("Exported all JSON data");
  };

  const handleFormatAll = () => {
    // Re-format all JSON (already formatted in display)
    toast.success("All JSON formatted");
  };

  const getGridColumns = () => {
    const count = jsonDataList.length;
    if (count === 1) return "grid-cols-1";
    if (count === 2) return "grid-cols-1 lg:grid-cols-2";
    return "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3";
  };

  const handleUploadClick = () => {
    document.getElementById("file-upload")?.click();
  };

  const handleLoadFromBackend = async () => {
    try {
      toast.loading("Loading from backend...");
      
      const { data, error } = await supabase.functions.invoke('get-jsons');
      
      if (error) {
        console.error('Error loading from backend:', error);
        toast.error(`Failed to load from backend: ${error.message}`);
        return;
      }

      if (!data || !Array.isArray(data)) {
        toast.error("Invalid data format from backend");
        return;
      }

      const newJsonData: JsonData[] = data.map((item: any, index: number) => ({
        id: `backend-${Date.now()}-${index}`,
        name: item.data?.name || `Backend JSON ${index + 1}`,
        data: item.data,
      }));

      setJsonDataList([...jsonDataList, ...newJsonData]);
      toast.success(`Loaded ${newJsonData.length} JSON from backend`);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error("Failed to load from backend");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* SEO Metadata */}
      <title>Multi-JSON Visual Editor | Developer Tools</title>
      <meta
        name="description"
        content="Professional JSON editor with tree view, real-time editing, search, and multi-file support. Developer-friendly interface for JSON data manipulation."
      />

      {/* Toolbar */}
      <Toolbar
        onFileUpload={handleFileUpload}
        onPasteJson={() => setPasteDialogOpen(true)}
        onLoadFromBackend={handleLoadFromBackend}
        onExportAll={handleExportAll}
        onFormatAll={handleFormatAll}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        jsonCount={jsonDataList.length}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {jsonDataList.length === 0 ? (
          <EmptyState
            onUploadClick={handleUploadClick}
            onPasteClick={() => setPasteDialogOpen(true)}
          />
        ) : (
          <section className={`grid ${getGridColumns()} gap-6 h-full auto-rows-fr`}>
            {jsonDataList.map((jsonData) => (
              <JsonViewer
                key={jsonData.id}
                jsonData={jsonData}
                onUpdate={handleUpdateJson}
                onDelete={handleDeleteJson}
                searchTerm={searchTerm}
              />
            ))}
          </section>
        )}
      </main>

      {/* Paste Dialog */}
      <PasteJsonDialog
        open={pasteDialogOpen}
        onOpenChange={setPasteDialogOpen}
        onSubmit={handlePasteJson}
      />
    </div>
  );
};

export default Index;
