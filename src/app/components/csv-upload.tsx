"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileUp, AlertCircle, Check } from "lucide-react";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Alert, AlertDescription } from "../../components/ui/alerts";

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

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <CardTitle className="text-xl">CSV Upload</CardTitle>
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
            <div className="flex items-center space-x-2">
              <Check className="h-4 w-4 text-green-500" />
              <h3 className="text-sm font-medium">
                CSV Preview (First 5 rows)
              </h3>
            </div>
            <div className="overflow-x-auto rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHead key={header}>{header}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {csvData.map((row, rowIndex) => (
                    <TableRow key={rowIndex}>
                      {headers.map((header) => (
                        <TableCell key={`${rowIndex}-${header}`}>
                          {row[header]}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <p className="text-muted-foreground text-xs">
              Showing {csvData.length} of {csvData.length} rows
            </p>
            {analysisResults.length > 0 && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center space-x-2">
                  <Check className="h-4 w-4 text-green-500" />
                  <h3 className="text-sm font-medium">Analysis Results</h3>
                </div>
                <div className="overflow-x-auto rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>URL</TableHead>
                        <TableHead>Benign Confidence (%)</TableHead>
                        <TableHead>Phishing Confidence (%)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {analysisResults.map((result, index) => (
                        <TableRow key={index}>
                          <TableCell>{result.url}</TableCell>
                          <TableCell>{result.benign_confidence}</TableCell>
                          <TableCell>{result.phishing_confidence}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
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
            Run Bulk Analysis
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
