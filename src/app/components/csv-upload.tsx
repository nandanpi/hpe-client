"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import {
  Upload,
  FileUp,
  AlertCircle,
  Check,
  BarChart3,
  Shield,
  ShieldAlert,
} from "lucide-react";
import Papa from "papaparse";
import { useToast } from "../../hooks/use-toast";
import { bulkPredictURLs, bulkPredictURLsCSV } from "../../app/actions";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import { Alert, AlertDescription } from "../../components/ui/alerts";
import { Progress } from "../../components/ui/progress";

type ParsedCSVRow = Record<string, string>;

interface CSVUploadProps {
  onAnalyze: (data: ParsedCSVRow[]) => void;
}

export function CSVUpload({ onAnalyze }: CSVUploadProps) {
  const [csvData, setCsvData] = useState<ParsedCSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const processCSV = useCallback(
    (file: File) => {
      setIsLoading(true);
      setError(null);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data as ParsedCSVRow[];

          if (parsedData.length === 0) {
            setError("The CSV file appears to be empty.");
            toast({
              title: "Error",
              description: "The CSV file appears to be empty.",
              variant: "destructive",
            });
            setIsLoading(false);
            return;
          }

          const headers = parsedData[0] ? Object.keys(parsedData[0]) : [];
          setHeaders(headers);

          setCsvData(parsedData.slice(0, 5));
          setIsLoading(false);
        },
        error: (error) => {
          setError(`Error parsing CSV: ${error.message}`);
          toast({
            title: "Error parsing CSV",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
        },
      });
    },
    [toast],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];

      if (!file) return;

      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        setError("Please upload a valid CSV file.");
        toast({
          title: "Invalid file type",
          description: "Please upload a valid CSV file.",
          variant: "destructive",
        });
        return;
      }

      processCSV(file);
    },
    [processCSV, toast],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
    },
    maxFiles: 1,
  });

  const [analysisResults, setAnalysisResults] = useState<
    { url: string; benign_confidence: number; phishing_confidence: number }[]
  >([]);
  const [csvResults, setCsvResults] = useState<
    { url: string; benign_confidence: number; phishing_confidence: number }[]
  >([]);

  function downloadCSVFromJSON(data: Record<string, any>[], filename: string) {
    if (data.length === 0) return;

    const headers = data[0] ? Object.keys(data[0]) : [];
    const csvRows = [
      headers.join(","),
      ...data.map((row) =>
        headers.map((header) => JSON.stringify(row[header] ?? "")).join(","),
      ),
    ];

    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    URL.revokeObjectURL(url);
  }

  const handleAnalyze = async (data: Record<string, string>[]) => {
    const urls = data
      .map((row) => row.url)
      .filter((url): url is string => url !== undefined);

    setIsLoading(true);

    try {
      const top5Results = await bulkPredictURLs(urls.slice(0, 5));
      setAnalysisResults(top5Results);

      const csvResults = await bulkPredictURLsCSV(urls);

      if (csvResults.length > 0) {
        downloadCSVFromJSON(csvResults, "full_analysis_results.csv");
      }
    } catch (error) {
      console.error("Error during analysis:", error);
    }

    setIsLoading(false);
  };

  // Calculate analysis statistics
  const getAnalysisStats = () => {
    if (analysisResults.length === 0) return null;

    const safeUrls = analysisResults.filter(
      (result) =>
        Number.parseFloat(result.benign_confidence.toString()) >
        Number.parseFloat(result.phishing_confidence.toString()),
    ).length;

    const maliciousUrls = analysisResults.length - safeUrls;
    const safePercentage = (safeUrls / analysisResults.length) * 100;
    const maliciousPercentage = (maliciousUrls / analysisResults.length) * 100;

    return {
      total: analysisResults.length,
      safe: safeUrls,
      malicious: maliciousUrls,
      safePercentage,
      maliciousPercentage,
    };
  };

  const analysisStats = getAnalysisStats();

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">Drop your CSV file here or click to upload.</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drag & Drop Area */}
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"} ${error ? "border-destructive/50" : ""} `}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center space-y-3">
            <Upload
              className={`h-10 w-10 ${isDragActive ? "text-primary" : "text-muted-foreground"}`}
            />
            <div className="space-y-1">
              <p className="text-sm font-medium">
                {isDragActive
                  ? "Drop the CSV file here"
                  : "Drag & drop your CSV file here"}
              </p>
              <p className="text-muted-foreground text-xs">
                or click to browse files
              </p>
            </div>
            <Button variant="secondary" size="sm" className="mt-2">
              <FileUp className="mr-2 h-4 w-4" />
              Upload CSV
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {csvData.length > 0 && headers.length > 0 && (
          <div className="space-y-2">
            {analysisResults.length > 0 && (
              <div className="mt-6 space-y-4">
                {analysisStats && (
                  <Card className="border-t-4 border-t-black bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center text-lg text-gray-800">
                        <BarChart3 className="mr-2 h-5 w-5" />
                        Security Analysis Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Summary Stats */}
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-gray-800">
                            {analysisStats.total}
                          </p>
                          <p className="text-sm text-gray-600">Total URLs</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-gray-800">
                            {analysisStats.safe}
                          </p>
                          <p className="text-sm text-gray-600">Safe URLs</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-2xl font-bold text-gray-800">
                            {analysisStats.malicious}
                          </p>
                          <p className="text-sm text-gray-600">
                            Suspicious URLs
                          </p>
                        </div>
                      </div>

                      {/* Visual Progress Bars */}
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <Shield className="h-4 w-4 text-green-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Safe URLs
                              </span>
                            </div>
                            <span className="text-sm font-bold text-green-600">
                              {analysisStats.safePercentage.toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={analysisStats.safePercentage}
                            className="h-3"
                            indicatorClassName="bg-green-600"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <ShieldAlert className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-gray-700">
                                Suspicious URLs
                              </span>
                            </div>
                            <span className="text-sm font-bold text-red-600">
                              {analysisStats.maliciousPercentage.toFixed(1)}%
                            </span>
                          </div>
                          <Progress
                            value={analysisStats.maliciousPercentage}
                            className="h-3"
                            indicatorClassName="bg-red-600"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>

      {csvData.length > 0 && (
        <CardFooter>
          <Button
            onClick={() => handleAnalyze(csvData)}
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Analyzing..." : "Run Bulk Analysis"}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
