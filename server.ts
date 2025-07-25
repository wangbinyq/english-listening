import { serve } from "bun";

interface KekenetRequest {
  Method: string;
  Params: {
    id: number;
  };
  Token: string;
  Terminal: string;
  Version: string;
  UID: number;
  AppFlag: string;
  Sign: string;
  ApVersionCode: number;
}

interface KekenetContentItem {
  en: string;
}

interface KekenetData {
  playurl: string;
  content: KekenetContentItem[];
}

interface KekenetResponse {
  Data: KekenetData;
}

// Fetch content from the kekenet API
const fetchKekenetContent = async (id: string): Promise<KekenetResponse> => {
  try {
    const requestData: KekenetRequest = {
      "Method": "v9_news_getcontent",
      "Params": {
        "id": parseInt(id)
      },
      "Token": "",
      "Terminal": "11",
      "Version": "4.0",
      "UID": 0,
      "AppFlag": "18",
      "Sign": "",
      "ApVersionCode": 1
    };

    // Convert request data to URL encoded format
    const requestBody = `Request=${encodeURIComponent(JSON.stringify(requestData))}`;

    const response = await fetch('https://mob2015.kekenet.com/keke/mobile/index.php', {
      method: 'POST',
      headers: {
        "content-type": "application/x-www-form-urlencoded",
      },
      body: requestBody
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: KekenetResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching kekenet content:", error);
    throw error;
  }
};

// Extract audio URL and text from kekenet data
const extractContentFromData = (data: KekenetResponse): { audioUrl: string; originalText: string } => {
  if (!data || !data.Data) {
    throw new Error('Invalid data structure');
  }

  const audioUrl = data.Data.playurl ? `https://k7.kekenet.com/${data.Data.playurl}` : '';

  if (!data.Data.content || !Array.isArray(data.Data.content)) {
    throw new Error('No content found');
  }

  // Extract English text from content array
  const originalText = data.Data.content.map((item: KekenetContentItem) => item.en || '').join(' ');

  return {
    audioUrl,
    originalText
  };
};

serve({
  port: 3001,
  async fetch(req) {
    const url = new URL(req.url);

    // Handle /api/fetch endpoint
    if (url.pathname === "/api/fetch" && req.method === "GET") {
      const targetUrl = url.searchParams.get("url");

      if (!targetUrl) {
        return new Response(
          JSON.stringify({ error: "Missing 'url' parameter" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      try {
        // Extract ID from URL (assuming format like https://www.kekenet.com/broadcast/202503/704573.shtml)
        const urlObj = new URL(targetUrl);
        const pathParts = urlObj.pathname.split('/');
        const id = pathParts[pathParts.length - 1].replace('.shtml', '');

        if (!id) {
          throw new Error('Could not extract ID from URL');
        }

        // Fetch data from kekenet API
        const data = await fetchKekenetContent(id);

        // Extract audio URL and text
        const { audioUrl, originalText } = extractContentFromData(data);

        return new Response(
          JSON.stringify({ audioUrl, originalText }),
          {
            headers: { "Content-Type": "application/json" },
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Failed to fetch content", details: (error as Error).message }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Default response for other routes
    return new Response("Bun server is running! Use /api/fetch?url={url} to fetch content.", {
      headers: { "Content-Type": "text/plain" },
    });
  },
});

console.log("Bun server running on http://localhost:3001");