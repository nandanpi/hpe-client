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
  