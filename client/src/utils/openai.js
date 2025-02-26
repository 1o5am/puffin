const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const API_ENDPOINT = 'https://api.openai.com/v1/chat/completions';

const getPromptForPage = (page, data) => {
  // Safely stringify the data
  let stringifiedData;
  try {
    stringifiedData = JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2);
  } catch (e) {
    console.error('Error stringifying data:', e);
    stringifiedData = '{}';
  }

  const basePrompt = `You are a JSON generator. Respond ONLY with valid JSON. 
  IMPORTANT RULES:
  1. Use ONLY double quotes, not single quotes
  2. Ensure all JSON keys and values are properly quoted
  3. Do not include any text outside the JSON object
  4. Keep insights specific and under 100 characters each
  
  Data to analyze: ${stringifiedData}\n\n`;

  switch (page) {
    case 'dashboard':
      return basePrompt + `Return JSON in this exact format:
      {
        "spendingPatterns": {
          "mtd": "insight about month-to-date spending patterns",
          "trends": "key trends identified"
        },
        "budgetStatus": {
          "overall": "overall budget status",
          "details": "specific details about budget performance"
        },
        "goalsProgress": {
          "overall": "overall goals progress status",
          "byGoal": [
            {
              "name": "goal name",
              "status": "good/needs improvement/concerning",
              "detail": "specific insight about this goal"
            }
          ]
        }
      }`;

    case 'transactions':
      return basePrompt + `Return JSON in this exact format:
      {
        "daily": {
          "yesterday": "insight about yesterday's spending",
          "weekToDate": "insight about week to date spending",
          "monthToDate": "insight about month to date spending"
        },
        "categories": {
          "topSpending": "top spending category insight",
          "unusual": "any unusual spending patterns",
          "improving": "categories showing improvement"
        },
        "recommendations": [
          "specific, actionable recommendation",
          "another recommendation"
        ]
      }`;

    case 'goals':
      return basePrompt + `Return JSON in this exact format:
      {
        "achievement": {
          "overall": "overall achievement status",
          "timeframe": "timeframe-specific insights"
        },
        "redFlags": [
          "specific red flag or concern",
          "another red flag if any"
        ],
        "strengths": [
          "what's working well",
          "another strength if any"
        ],
        "recommendations": [
          "specific recommendation for faster achievement",
          "another recommendation"
        ]
      }`;

    case 'budgets':
      return basePrompt + `Return JSON in this exact format:
      {
        "monthlyPacing": {
          "overall": "overall budget pacing status",
          "byCategory": [
            {
              "category": "category name",
              "status": "status insight"
            }
          ]
        },
        "alerts": [
          "specific alert or concern for remaining days",
          "another alert if any"
        ],
        "recommendations": [
          "specific recommendation for staying under budget",
          "trade-off suggestion for reducing expenses"
        ]
      }`;

    default:
      throw new Error('Invalid page type for insights');
  }
};

export const generateInsights = async (page, data) => {
  try {
    const prompt = getPromptForPage(page, data);
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{
          role: "user",
          content: prompt
        }],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`Failed to fetch insights: ${errorData}`);
    }

    const result = await response.json();
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error('Unexpected API response format:', result);
      throw new Error('Invalid response format from API');
    }

    const content = result.choices[0].message.content;
    
    try {
      // Clean the response
      let cleanContent = content.trim();
      
      // Remove any markdown code block indicators and 'json' text
      cleanContent = cleanContent.replace(/```json\n?/g, '');
      cleanContent = cleanContent.replace(/```\n?/g, '');
      cleanContent = cleanContent.replace(/^json\n?/g, '');
      
      // Remove any trailing dots or commas
      cleanContent = cleanContent.replace(/\.+$/g, '');
      cleanContent = cleanContent.replace(/,+$/g, '');
      
      // Ensure the content starts with {
      cleanContent = cleanContent.substring(cleanContent.indexOf('{'));
      
      // Remove any text after the last }
      const lastBrace = cleanContent.lastIndexOf('}');
      if (lastBrace !== -1) {
        cleanContent = cleanContent.substring(0, lastBrace + 1);
      }

      cleanContent = cleanContent.trim();

      // Parse the cleaned content
      const parsedContent = JSON.parse(cleanContent);
      
      // Validate the structure based on the page type
      if (!parsedContent || typeof parsedContent !== 'object') {
        throw new Error('Invalid JSON structure');
      }

      return parsedContent;
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      console.error('Original content:', content);
      console.error('Cleaned content:', cleanContent);
      
      // Return a more user-friendly error structure
      return {
        error: 'Unable to generate insights at this time',
        errorDetails: parseError.message,
        timestamp: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error generating insights:', error);
    return {
      error: error.message || 'Unable to generate insights',
      timestamp: new Date().toISOString()
    };
  }
};