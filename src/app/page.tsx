'use client'
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { predictURL } from "./actions";
import { CSVUpload } from "./components/csv-upload";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");
  const [data, setData] = useState<{
                benign_confidence: number,
                phishing_confidence: number,
                url: string
  }>();
  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center mt-8">
        <Card className=" w-[75%] mx-5">
          <CardHeader>
            <CardTitle>
              URL Malicious Meter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input value={url} onChange={(e) => {setUrl(e.target.value)}} placeholder="Enter URL here"/>
          </CardContent>
          <CardFooter>
            <Button
          
              onClick={async () => {
                setIsLoading(true);
                const resp =await  predictURL(url);
                setData(resp);
              }}
            >
              Test URL
            </Button>
          </CardFooter>
        </Card>
        {
          data && (
            <Card className="w-[75%]">
              <CardHeader>
                <CardTitle>Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p><strong>Benign Confidence:</strong> <span>{data.benign_confidence}</span></p>
                  <p><strong>Phishing Confidence:</strong> <span>{data.phishing_confidence}</span></p>
                </div>
              </CardContent>
            </Card>
          )
        }
      </div>
      <div>
        <CSVUpload onAnalyze={function (data: { [x: string]: string; }[]): void {
          throw new Error("Function not implemented.");
        } }/>
      </div>
    </>
  );
}
