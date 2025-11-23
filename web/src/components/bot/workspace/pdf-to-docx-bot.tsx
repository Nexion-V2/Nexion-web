"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Upload,
  Download,
  Loader2,
  AlertCircle,
  FileText,
  Check,
  CheckLine,
  CheckCheck,
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export function PdfToDocxBot() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [converted, setConverted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file type
    if (selectedFile.type !== "application/pdf") {
      setError("Please upload a PDF file");
      return;
    }

    // Validate file size (max 50MB)
    if (selectedFile.size > 50 * 1024 * 1024) {
      setError("File size must be less than 50MB");
      return;
    }

    setError(null);
    setFile(selectedFile);
    setConverted(false);
  };

  const handleConvert = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bot/pdf-to-docx`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // include cookies
        }
      );
      console.log(response.data);

      setConverted(true);

      toast.success("PDF converted to DOCX successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to convert PDF";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!file) return;

    // In production, this would download the actual converted file from your API
    const link = document.createElement("a");
    const docName = file.name.replace(".pdf", ".docx");
    link.download = docName;

    // Create a dummy blob for demo
    const blob = new Blob(["[DOCX content would be here]"], {
      type: "text/plain",
    });
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="p-8 max-w-2xl mx-auto h-full flex flex-col">
      <div className="flex flex-col gap-6 flex-1">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-foreground">Upload PDF</h3>

          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/50 p-12 group"
          >
            <Upload className="w-16 h-16 text-muted-foreground group-hover:text-primary mb-4 transition-colors" />
            <p className="text-lg font-medium text-foreground">
              Click to upload PDF
            </p>
            <p className="text-sm text-muted-foreground">or drag and drop</p>
            <p className="text-xs text-muted-foreground mt-2">
              PDF files up to 50MB
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>

        {error && (
          <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {file && (
          <div className="border border-border rounded-lg p-4 bg-card">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-primary" />
              <div className="flex-1">
                <p className="font-medium text-foreground">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            {!converted ? (
              <div className="w-full flex gap-3 mt-2">
                <Button
                  onClick={handleConvert}
                  disabled={loading}
                  size="lg"
                  className="flex-1 rounded text-sm"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? "Converting..." : "Convert to DOCX"}
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setFile(null);
                    setError(null);
                    fileInputRef.current!.value = "";
                  }}
                  disabled={loading}
                  className="hover:bg-muted/60 rounded text-sm text-muted-foreground"
                >
                  Reset
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                  <CheckCheck size={20} />
                  Conversion complete!
                </div>
                <div className="w-full flex gap-3 mt-2">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="flex-1 rounded text-sm"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download DOCX
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setFile(null);
                      setError(null);
                      fileInputRef.current!.value = "";
                    }}
                    disabled={loading}
                    className="hover:bg-muted/60 rounded text-sm text-muted-foreground"
                  >
                    Reset
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {!file && (
          <div className="text-center text-muted-foreground py-12">
            <p>No file selected yet</p>
            <p className="text-sm">Upload a PDF file to get started</p>
          </div>
        )}
      </div>
    </div>
  );
}
