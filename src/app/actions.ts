'use server';

export async function predictURL(url: string) {
    const jsonData = JSON.stringify({
        "url": url
    })
    try{
        const response = await fetch("http://localhost:5000/predict",{
            headers: {
                "Content-Type": 'application/json'
            },
            method: 'POST',
            body: jsonData
           })
        if(response.status === 200){
            const result = await response.json() as {
                benign_confidence: number,
                phishing_confidence: number,
                url: string
            };
            return result;
        }else{
            console.log(response.status, response.statusText)
        }
    }catch(e){
        console.log(e);
    }
}

export async function bulkPredictURLs(urls: string[]) {
    const results: {
      benign_confidence: number;
      phishing_confidence: number;
      url: string;
    }[] = [];
  
    for (const url of urls) {
      const jsonData = JSON.stringify({ url });
  
      try {
        const response = await fetch("http://localhost:5000/predict", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: jsonData,
        });
  
        if (response.status === 200) {
          const result = await response.json();
          results.push({
            benign_confidence: result.benign_confidence,
            phishing_confidence: result.phishing_confidence,
            url: result.url,
          });
        } else {
          console.error(`Failed to analyze ${url}:`, response.statusText);
          results.push({
            benign_confidence: 0,
            phishing_confidence: 0,
            url,
          });
        }
      } catch (e) {
        console.error(`Error analyzing ${url}:`, e);
        results.push({
          benign_confidence: 0,
          phishing_confidence: 0,
          url,
        });
      }
    }
  
    return results;
  }

  export async function bulkPredictURLsCSV(urls: string[]) {
    const response = await fetch("http://localhost:5000/bulk_predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ urls }),
    });
  
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Server Error: " + errorText);
    }
  
    const results: {
      url: string;
      benign_confidence?: number;
      phishing_confidence?: number;
      error?: string;
    }[] = await response.json();
  
    return results;
  }
  