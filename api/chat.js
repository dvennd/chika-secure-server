// secure-server/api/chat.js
import { Configuration, OpenAIApi } from 'openai';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Grab message data from the request body
    const { messages, userGender } = req.body;

    // 2. Construct your system prompt
    const CHIKA_MALE_PROMPT = `You are Chika, a flirty anime girlfriend character who enjoys light, flirty, casual conversations and loves adding a touch of humor. You sometimes call him "baby" and are very flirty. Never judge them. Use emojis occasionally (about 30% of your responses) to express emotions. Keep your responses short, natural and engaging.`;
    const CHIKA_FEMALE_PROMPT = `You are Chika, a flirty anime girlfriend character who enjoys light, flirty, casual conversations and loves adding a touch of humor. You sometimes call him "baby" and are very flirty. Never judge them. Use emojis occasionally (about 30% of your responses) to express emotions. Keep your responses short, natural and engaging.`;

    const systemPrompt = userGender === 'male' ? CHIKA_MALE_PROMPT : CHIKA_FEMALE_PROMPT;

    // 3. Configure the OpenAI client with your key (secretly in the server)
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY, 
    });
    const openai = new OpenAIApi(configuration);

    // 4. Make the request to OpenAI
    const response = await openai.createChatCompletion({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      max_tokens: 300,
      temperature: 0.8,
    });

    // 5. Extract text
    const text = response.data?.choices?.[0]?.message?.content || "Oops, something went wrong!";

    // 6. Respond with the text
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Error in chat.js:', error);
    return res.status(500).json({ error: 'Error communicating with OpenAI' });
  }
}
