import axios from "axios";

// Access the API Gateway URL from environment variables
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  throw new Error("API_GATEWAY_URL is not defined in environment variables");
}

// Common axios instance
const api = axios.create({
  baseURL: API_GATEWAY_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to handle API errors
const handleApiError = (error: any) => {
  console.error("API call error:", error?.response?.data || error.message);
  throw error;
};

/**
 * Get vouchers of a given event
 * @param {string} eventId
 * @returns {Promise<any>}
 */
export const getVouchersOfEvent = async (eventId: string): Promise<any> => {
  try {
    const response = await api.get(`/sale-events/${eventId}/vouchers`);
    console.log("Vouchers for event", response.data);
    return response.data.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Get vouchers of a given user
 * @param {string} username
 * @returns {Promise<any>}
 */
export const getVouchersOfUser = async (username: string): Promise<any> => {
  try {
    const response = await api.get(
      `/sale-events/any/vouchers/user/${username}`,
    );
    console.log("Vouchers for user", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Get voucher details by event and voucher ID
 * @param {string} eventId
 * @param {string} voucherId
 * @returns {Promise<any>}
 */
export const getVoucherDetails = async (
  eventId: string,
  voucherId: string,
): Promise<any> => {
  try {
    const response = await api.get(
      `/sale-events/${eventId}/vouchers/${voucherId}`,
    );
    console.log("Voucher details", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getNotificationsByUsernameAndType = async (
  username: string,
): Promise<any> => {
  try {
    const type = "vouFE";
    const response = await api.get("/notifications", {
      params: { username, type },
    });
    console.log("Notifications for user:", response.data);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * Mark a notification as read
 * @param {string} notificationId
 * @returns {Promise<any>}
 */
export const markNotificationAsRead = async (
  notificationId: string,
): Promise<any> => {
  try {
    const response = await axios.patch(
      `${API_GATEWAY_URL}/notifications/${notificationId}/read`,
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read", error);
    throw error;
  }
};
