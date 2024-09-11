// src/api/apiService.ts
import axios from "axios";
// Access the API Gateway URL from environment variables
const API_GATEWAY_URL  = import.meta.env.VITE_API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  throw new Error("API_GATEWAY_URL is not defined in environment variables");
}

// Get vouchers of a given event
export const getVouchersOfEvent = async (eventId: string) => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/sale-events/${eventId}/vouchers`);
    console.log("Vouchers for event", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers for event", error);
    throw error;
  }
};

// Get vouchers of a given event
export const getVouchersOfUser = async (username: string) => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/sale-events/any/vouchers/user/${username}`);
    console.log("Vouchers for event", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching vouchers for event", error);
    throw error;
  }
};

// Get voucher details by ID
export const getVoucherDetails = async (eventId: string, voucherId: string) => {
  try {
    const response = await axios.get(`${API_GATEWAY_URL}/sale-events/${eventId}/vouchers/${voucherId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching voucher details", error);
    throw error;
  }
};
