import axios from 'axios';

const API_KEY = 'YOUR_OPENAI_API_KEY';

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

export const getOpenAIResponse = async (prompt : any) => {
  const response = await openai.post('/completions', {
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 100,
  });
  return response.data;
};