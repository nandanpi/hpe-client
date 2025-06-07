"use client";
import { bulkPredictURLs } from "../../app/actions";
import { CSVUpload } from "./csv-upload";

export default function CSVUploadDemo() {
  const handleAnalyze = async (data: Record<string, string>[]) => {
    const urls = data
      .map((row) => row.url)
      .filter((url): url is string => url !== undefined);
    const results = await bulkPredictURLs(urls);
    console.log("Analysis Results:", results);
    //  update table/chart for later here
  };

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <h1 className="mb-6 text-2xl font-bold">CSV Data Analysis</h1>
      <CSVUpload onAnalyze={handleAnalyze} />
    </div>
  );
}
