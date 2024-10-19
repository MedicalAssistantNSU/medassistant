
const LLAMA_API_URL = "https://api.llama-api.com/chat/completions"
const LLAMA_API_TOKEN = "LA-2c655f5d1e084559901a29ce8223a62435a00f86b64243febecd97be5a02549b"

export const getLLamaAnswer = async (msg: string) => {
    const headers = {
        "Content-Type": "application/json",
        "Authorization": 'Bearer ' + LLAMA_API_TOKEN,
        "Access-Control-Allow-Origin": "*"
    }

    try {
        const response = await fetch(LLAMA_API_URL, {
            method: "POST", 
            headers, 
            body: JSON.stringify({
                messages: [{ role: "user", content: "Give me 10 cars"}],
            })
        })

        const data = await response.json()
        console.log(data)
        return data
    } catch (e) {
        console.log(e)
        throw e
    }
    
}