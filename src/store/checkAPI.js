// api.js (or wherever you define your Axios instance and API calls)
import axios from "axios";

export const fetchDataFromCacheOrNetwork = async (url) => {
  const cachedResponse = await caches.match(url);

  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await axios.get(url);
    // Clone and store the response in the cache
    const clonedResponse = response.clone();
    const cache = await caches.open(CACHE_NAME);
    cache.put(url, clonedResponse);
    return response;
  } catch (error) {
    console.error("API fetch error:", error);
    throw error; // You might want to handle this error in your Redux logic
  }
};
