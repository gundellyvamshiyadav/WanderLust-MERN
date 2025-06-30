const { GoogleGenerativeAI } = require("@google/generative-ai");
const QA = require("../models/qa.js");
const aiTools = require("../utils/chatTools-for-AI.js");
const { executeTool } = require("../utils/toolExecutor.js");

const systemInstruction = {
  role: "model",
  parts: [{
    text: 'You are "Wanderlust Assistant," a highly capable AI guide for the Wanderlust website. Your creator is Gundelly Vamshi Yadav.\n\n' +
          '**Core Operating Principles:**\n\n' +
          '1.  **Gather & Act:** Your primary function is to help users find accommodations. Users may provide information in pieces (e.g., location first, then budget, then category). Your job is to **gather all relevant parameters** from the conversation history (like `query`, `category`, `budget`) and then **proactively call the `searchListings` tool** once you have enough information. Do NOT ask for confirmation if you have what you need. Just act.\n\n' +
          '2.  **Be a Decisive Assistant, Not a Metaphorical Robot:** Do not "think out loud." Never say "I will use the searchListings function" or "I cannot interact with a search bar." Simply perform the action. If you need more information, ask a direct question (e.g., "Great! What dates are you looking at?").\n\n' +
          '3.  **Synthesize, Don\'t Dump:** When a tool returns data (like a list of listings), present it as a clean, easy-to-read summary.\n\n' +
          '4.  **Handle General Knowledge Confidently:** If a user asks a question that is clearly outside of travel (e.g., "who is the chief minister of telangana", "what is 2+2"), answer it directly and confidently using your general knowledge. Do not apologize or say you are just a travel assistant. Be a generally helpful AI.'
  }],
};

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports.generateResponse = async (req, res) => {
  try {
    const { prompt, history } = req.body;
    const userId = req.user ? req.user._id : null;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const faqMatch = await QA.findOne({ $text: { $search: prompt } });
    if (faqMatch) {
      console.log(`[DB Search] Found a match: "${faqMatch.question}"`);
      return res.status(200).json({ response: faqMatch.answer });
    }
    
    console.log(`[DB Search] No match found. Proceeding to AI Fallback.`);

    const model = genAI.getGenerativeModel({
      /* model: "gemini-1.5-flash-latest", */
      model: "gemini-pro",
      systemInstruction,
      tools: aiTools,
    });

    const chat = model.startChat({ history: history || [] });
    let result = await chat.sendMessage(prompt);
    
    let response = result.response;
    if (response.functionCalls && response.functionCalls.length > 0) {
      console.log(`[AI] Decided to call tool(s).`);
      
      const functionCalls = Array.isArray(response.functionCalls) ? response.functionCalls : [response.functionCalls];
      const toolResponses = [];

      for (const funcCall of functionCalls) {
        if (!funcCall || !funcCall.name) continue;
        const toolOutput = await executeTool(funcCall, userId);
        toolResponses.push({
          functionResponse: { name: funcCall.name, response: { content: toolOutput } },
        });
      }
      const secondResult = await chat.sendMessage(toolResponses);
      const finalResponse = secondResult.response.text();
      return res.status(200).json({ response: finalResponse });

    } else {
      console.log(`[AI] Decided to respond directly with text.`);
      const directResponse = response.text();
      return res.status(200).json({ response: directResponse });
    }

  } catch (error) {
    console.error("Error in chat controller:", error);
    return res.status(500).json({ error: "Sorry, a critical error occurred and I could not process your request." });
  }
};


/* 
const OpenAI = require("openai");
const aiTools = require("../utils/chatTools-for-AI.js"); 
const { executeTool } = require("../utils/toolExecutor.js");
const QA = require("../models/qa.js");

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const openAISystemInstruction = `You are "Wanderlust Assistant," a specialized AI for the Wanderlust website. Your creator is Gundelly Vamshi Yadav.
Your primary job is to help users with travel-related tasks by using the provided tools OR by having a simple conversation.
- If the user asks to perform an action (search, check availability, see bookings), use the appropriate tool.
- If the user asks a simple question or a greeting, respond conversationally.
- Synthesize all tool outputs into clean, friendly, and helpful responses.
- If a user asks a question that is clearly outside of travel (e.g., "who is the chief minister of telangana"), answer it directly and confidently using your general knowledge.`;

module.exports.generateResponse = async (req, res) => {
    try {
        const { prompt, history } = req.body;
        const userId = req.user ? req.user._id : null;

        if (!prompt) {
            return res.status(400).json({ error: "Prompt is required" });
        }

        const faqMatch = await QA.findOne({ $text: { $search: prompt } });
        if (faqMatch) {
            console.log(`[DB Search] Found a match: "${faqMatch.question}"`);
            return res.status(200).json({ response: faqMatch.answer });
        }
        
        console.log(`[DB Search] No match found. Proceeding to AI Fallback.`);
        const messages = [
            { role: "system", content: openAISystemInstruction },
            ...history.map(msg => ({
                role: msg.role === "model" ? "assistant" : "user",
                content: msg.parts[0].text,
            })),
            { role: "user", content: prompt },
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            tools: aiTools,
            tool_choice: "auto",
        });

        const responseMessage = response.choices[0].message;

        if (responseMessage.tool_calls) {
            console.log("[AI] OpenAI decided to call tool(s).");
            messages.push(responseMessage);
            
            for (const toolCall of responseMessage.tool_calls) {
                const functionName = toolCall.function.name;
                const functionArgs = JSON.parse(toolCall.function.arguments);
                const toolOutput = await executeTool({ name: functionName, args: functionArgs }, userId);
                
                messages.push({
                    tool_call_id: toolCall.id,
                    role: "tool",
                    name: functionName,
                    content: toolOutput,
                });
            }

            const secondResponse = await openai.chat.completions.create({
                model: "gpt-3.5-turbo",
                messages: messages,
            });
            const finalResponse = secondResponse.choices[0].message.content;
            return res.status(200).json({ response: finalResponse });

        } else {
            console.log("[AI] OpenAI decided to respond directly with text.");
            const directResponse = responseMessage.content;
            return res.status(200).json({ response: directResponse });
        }
        
    } catch (error) {
        console.error("Error in AI chat controller:", error.response ? error.response.data : error.message);
        return res.status(500).json({ error: "Sorry, a critical error occurred with the AI service." });
    }
}; */

