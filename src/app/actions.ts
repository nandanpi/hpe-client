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