const API_URL = '/api/gemini';

async function api<T>(action: string, body: Record<string, any>): Promise<T> {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, ...body })
    });
    if (!res.ok) {
        throw new Error(`API error: ${res.statusText}`);
    }
    const json = await res.json();
    if (!json.success) {
        throw new Error(`API error: ${json.message}`);
    }
    return json.data;
}

/**
 * Improves a specific text segment (like a bullet point) using Gemini.
 */
export const improveText = async (text: string, context: string): Promise<string> => {
    try {
        return await api('improveText', { text, context });
    } catch (error) {
        console.error("Error enhancing text with Gemini:", error);
        return text;
    }
};

/**
 * Generates a summary or specific resume section content.
 */
export const generateContent = async (topic: string): Promise<string> => {
    try {
        return await api('generateContent', { topic });
    } catch (error) {
        console.error("Error generating content:", error);
        return "";
    }
};