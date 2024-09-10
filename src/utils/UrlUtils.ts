
export const getGatewayUrl = (): string => {
  // Access the API Gateway URL from environment variables
  const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

  if (!API_GATEWAY_URL) {
    throw new Error('API_GATEWAY_URL is not defined in environment variables');
  }
  return API_GATEWAY_URL;
};