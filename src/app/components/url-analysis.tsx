"use client";

import { useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { predictURL } from "../actions";
import { ConfidencePieChart } from "../components/confidencepiechart";
import { AlertCircle, CheckCircle, Shield } from "lucide-react";

function UrlAnalysis() {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [data, setData] = useState<{
    benign_confidence: number;
    phishing_confidence: number;
    url: string;
  }>();

  const handleScan = async () => {
    setIsLoading(true);
    try {
      const resp = await predictURL(url);
      setData(resp);
    } catch (error) {
      console.error("Error scanning URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!data) return "bg-gray-100";
    return data.benign_confidence > data.phishing_confidence
      ? "bg-green-50"
      : "bg-red-50";
  };

  const getStatusText = () => {
    if (!data) return "";
    return data.benign_confidence > data.phishing_confidence
      ? "This URL appears to be safe"
      : "This URL may be suspicious";
  };

  const getStatusIcon = () => {
    if (!data) return null;
    return data.benign_confidence > data.phishing_confidence ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <AlertCircle className="h-5 w-5 text-red-500" />
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
        Real-Time URL Risk Assessment
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Left Section */}
        <Card className="h-full w-full border-t-4 border-t-black shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center text-gray-800">
              <Shield className="mr-2" /> URL Analysis
            </CardTitle>
            <CardDescription>
              Enter a URL to check if it&apos;s safe or potentially malicious
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="border-indigo-200 focus:border-indigo-500"
              />

              {data && (
                <div className={`rounded-lg p-4 ${getStatusColor()} mt-4`}>
                  <div className="flex items-center">
                    {getStatusIcon()}
                    <span className="ml-2 font-medium">{getStatusText()}</span>
                  </div>
                </div>
              )}

              {data && (
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Safe Score:</span>
                    <div className="flex items-center">
                      <div className="mr-2 h-2.5 w-32 rounded-full bg-gray-200">
                        <div
                          className="h-2.5 rounded-full bg-green-500"
                          style={{ width: `${data.benign_confidence * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {(data.benign_confidence * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium">Risk Score:</span>
                    <div className="flex items-center">
                      <div className="mr-2 h-2.5 w-32 rounded-full bg-gray-200">
                        <div
                          className="h-2.5 rounded-full bg-red-500"
                          style={{
                            width: `${data.phishing_confidence * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {(data.phishing_confidence * 100).toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleScan}
              disabled={isLoading || url.length === 0}
              className="w-full bg-gray-800 text-white hover:bg-black"
            >
              {isLoading ? "Scanning..." : "Analyze URL"}
            </Button>
          </CardFooter>
        </Card>

        {/* Right Section */}
        <Card className="h-full w-full border-t-4 border-t-black shadow-md">
          <CardHeader>
            <CardTitle className="text-shadow-gray-500">
              Security Assessment
            </CardTitle>
            <CardDescription>
              Visual representation of the URL security analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {data ? (
              <ConfidencePieChart
                benign={data.benign_confidence}
                phishing={data.phishing_confidence}
              />
            ) : (
              <div className="flex h-[300px] flex-col items-center justify-center text-center text-gray-500">
                <Shield className="mb-4 h-16 w-16 text-gray-800" />
                <p className="text-lg font-medium text-gray-800">No data to display</p>
                <p className="text-sm text-gray-800">
                  Enter a URL and click Analyze to see results
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default UrlAnalysis;
