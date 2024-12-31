"server-only";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function handleApiRequest(
  method,
  endpoint,
  options = {},
  debug = false
) {
  const {
    body,
    token,
    revalidate,
    headerOptions,
    tags,
    cache, // 'force-cache'  'no-store'
  } = options;

  try {
    let headers = {
      ...(token && { Authorization: `Bearer ${token}` }),
    };

    // Only set 'Content-Type' to json if the body is not a FormData object
    if (!(body instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }

    if (headerOptions) {
      headers = { ...headers, ...headerOptions };
    }

    const fetchOptions = {
      method,
      headers,
      ...(body && {
        body: body instanceof FormData ? body : JSON.stringify(body),
      }),
    };

    // Add Next.js specific options when on server
    if (cache) {
      fetchOptions.cache = cache;
    }
    if (revalidate !== undefined) {
      fetchOptions.next = {
        ...fetchOptions.next,
        revalidate,
      };
    }
    if (tags) {
      fetchOptions.next = {
        ...fetchOptions.next,
        tags,
      };
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, fetchOptions);

    if (!response.ok) {
      return {
        data: null,
        error: `Failed with status: ${response.status}`,
        response, // Include the raw response
      };
    }

    // Detect response type based on content type header
    const contentType = response.headers.get("Content-Type");

    let data;
    if (contentType?.includes("application/json")) {
      data = await response.json();
    } else if (contentType?.includes("application/pdf") || contentType?.includes("image/")) {
      data = await response.blob(); // Handles binary data such as PDF or images
    } else {
      data = await response.text(); // Fallback for other text-based responses
    }

    if (debug) console.log("API Response:", data);

    return { data, error: null, response }; // Include raw response object
  } catch (error) {
    console.error(`API Error (${method} ${endpoint}):`, error);
    return {
      data: null,
      error: "An unexpected error occurred",
      response: null,
    };
  }
}


export {
  BASE_URL,
  handleApiRequest,
}