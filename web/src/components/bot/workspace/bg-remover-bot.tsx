"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Compare } from "@/components/ui/compare";
import { Upload, Download, Loader2, AlertCircle, Wand2 } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";

export function BgRemoverBot() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<{
    original: string | null;
    processed: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // handle file select
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (!selectedFile.type.startsWith("image/")) {
      setError("Please upload an image file (JPG, PNG, etc.)");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    setError(null);
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
      setProcessedImage(null);
    };
    reader.readAsDataURL(selectedFile);
  };

  // actual background removal
  const handleRemoveBackground = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/bot/bg-remove`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true, // include cookies
        }
      );

      console.log(response.data);

      setProcessedImage(response.data.imageUrl); // url string
      toast.success("Background removed successfully!");
    } catch (err: any) {
      const message =
        err.response?.data?.error || err.message || "Failed to process image";
      setError(message);
      // Error toast with custom styling
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  // download result
  const handleDownload = async () => {
    if (!processedImage?.processed) return;

    setDownloadLoading(true);

    try {
      const response = await fetch(processedImage.processed!);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `Nexion-${Date.now()}.png`;
      link.click();

      window.URL.revokeObjectURL(url);
    } catch (err) {
      toast.error("Failed to download image");
    } finally {
      setDownloadLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
        {/* Left Side */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-foreground">
            Upload Image
          </h3>

          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-contain rounded-lg border border-border bg-muted/50"
            />
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-muted/50 group"
            >
              <Upload className="w-12 h-12 text-muted-foreground group-hover:text-primary mb-2 transition-colors" />
              <p className="text-sm font-medium text-foreground">
                Click to upload
              </p>
              <p className="text-xs text-muted-foreground">or drag and drop</p>
              <p className="text-xs text-muted-foreground mt-2">
                PNG, JPG up to 10MB
              </p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          {file && (
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground">
                Selected: {file.name}
              </p>
              <p className="text-xs">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          )}

          {error && (
            <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {preview && (
            <div className="w-full flex gap-3 mt-2">
              <Button
                onClick={handleRemoveBackground}
                disabled={loading}
                size="lg"
                className="flex-1 rounded text-sm"
              >
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {loading ? "Processing..." : "Remove Background"}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                  setProcessedImage(null);
                  setError(null);
                  fileInputRef.current!.value = "";
                }}
                disabled={loading}
                className="hover:bg-muted/60 rounded text-sm text-muted-foreground"
              >
                Reset
              </Button>
            </div>
          )}
        </div>

        {/* Right Side */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-foreground">Preview</h3>

          <div className="flex-1 border border-border rounded-lg overflow-hidden bg-muted/50 flex items-center justify-center">
            {processedImage ? (
              <Compare
                firstImage={processedImage?.original || ""}
                secondImage={processedImage?.processed || ""}
                firstImageClassName="w-full h-full object-contain"
                secondImageClassname="w-full h-full object-contain"
                className="h-full w-full rounded-[22px] md:rounded-lg"
                slideMode="hover"
                autoplay={true}
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <div className="flex items-center justify-center mb-6 p-4 rounded-full bg-primary/10 border border-primary/30">
                  <Wand2 className="w-10 h-10 text-primary animate-pulse" />
                </div>
                <p className="text-lg font-semibold text-foreground/80 tracking-tight mb-2">
                  Ready for Processing
                </p>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Select or drag an image into the area on the left, and the
                  processed result will appear here instantly.
                </p>
              </div>
            )}
          </div>

          {processedImage && (
            <Button
              onClick={handleDownload}
              variant="outline"
              size="lg"
              className="w-full bg-transparent rounded mt-2"
              disabled={downloadLoading}
            >
              {downloadLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {downloadLoading ? "Downloading..." : "Download Image"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
