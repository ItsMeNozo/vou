import axios from "axios";

const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  throw new Error("API_GATEWAY_URL is not defined in environment variables");
}

export const updateTopPlayersVoucher = async (
  topPlayers: { id: string }[],
  eventId: string,
) => {
  try {
    let response = await axios.get(`${API_GATEWAY_URL}/sale-events/${eventId}`);
    const event = response.data;
    const vouchers = event.vouchers || [];

    let voucherIndex = 0;
    let playerIndex = 0;

    while (voucherIndex < vouchers.length && playerIndex < topPlayers.length) {
      const voucher = vouchers[voucherIndex];

      if (voucher.remainings > 0) {
        response = await axios.get(
          `${API_GATEWAY_URL}/api/user/${topPlayers[playerIndex].id}`,
        );
        const user = response.data.data;

        await axios.post(
          `${API_GATEWAY_URL}/sale-events/${eventId}/vouchers/${voucher.voucherId}/add-to-user`,
          {
            username: user.username,
          },
        );

        voucher.remainings--;
        playerIndex++;
      } else {
        voucherIndex++;
      }
    }

    vouchers.forEach(
      async (voucher: { voucherId: string; remainings: number }) => {
        await axios.patch(
          `${API_GATEWAY_URL}/sale-events/${eventId}/vouchers/${voucher.voucherId}`,
          {
            remainings: voucher.remainings,
          },
        );
      },
    );
  } catch (error) {
    console.error("Error updating top players with vouchers:", error);
    throw error;
  }
};
