import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { auth } from "@/config/firebaseConfig";

import { Progress } from "@/components/ui/progress";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import Event from "@/models/event";
import "./EventDetails.css";
import { useNavigate } from "react-router-dom";

// Access the API Gateway URL from environment variables
const API_GATEWAY_URL = import.meta.env.VITE_API_GATEWAY_URL;

if (!API_GATEWAY_URL) {
  throw new Error("API_GATEWAY_URL is not defined in environment variables");
}

const EventDetails: React.FC = () => {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event>();
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `${API_GATEWAY_URL}/sale-events/${eventId}`,
        );
        setEvent(response.data);
      } catch (err) {
        console.log("Failed to fetch events");
      }
    };

    const fetchUser = () => {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          try {
            const response = await axios.get(
              `${API_GATEWAY_URL}/api/user/${user.uid}`,
            );
            const userData = response.data.data;
            const favorites = userData.favorites || [];
            if (favorites.includes(eventId)) {
              setIsFavorite(true);
            }
          } catch (err) {
            console.log("Failed to check favorite status");
          }
        }
      });
    };

    fetchEvent();
    fetchUser();
  }, []);

  const handleFavorite = () => {
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const response = await axios.get(
            `${API_GATEWAY_URL}/api/user/${user.uid}`,
          );
          const userData = response.data.data;
          const favorites = userData.favorites || [];
          let updatedFavorites = [...favorites];
          if (isFavorite) {
            updatedFavorites = favorites.filter(
              (favId: string) => favId !== eventId,
            );
            setIsFavorite(false);
          } else {
            updatedFavorites.push(eventId);
            setIsFavorite(true);
          }
          await axios.put(`${API_GATEWAY_URL}/api/user/${user.uid}`, {
            favorites: updatedFavorites,
          });
        } catch (err) {
          console.log("Failed to update favorite status");
        }
      }
    });
  };

  const handleSelectVoucher = (voucher: any) => {
    navigate(`/voucher-details`, {
      state: { voucherDetails: voucher, saleEvent: event },
    });
  };

  return (
    <>
      {event && (
        <div className="mb-16 p-4">
          <div className="text-left">
            <span className="text-left text-3xl font-bold ">Event Details</span>
          </div>
          <div className="aspect-w-16 aspect-h-9 my-4">
            <img
              src={event.imgUrl}
              alt={event.eventName}
              className="object-cover rounded-md"
            />
          </div>
          <div className="text-left flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-medium">{event.eventName}</div>
              <div className="">{event.description}</div>
            </div>
            <div>
              The campaign is run by
              <span className="font-medium text-lg"> {event.brandName}</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="font-medium">Duration: </span>
                <span className="text-[#7d4af9]">
                  {new Date(event.startDt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(event.endDt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
              <div
                className={`${
                  event.status === "upcoming"
                    ? "bg-yellow-400"
                    : event.status === "happening"
                      ? "bg-green-400"
                      : "bg-red-400"
                } p-1 rounded-md capitalize`}
              >
                {event.status}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#7d4af9] text-white p-3 font-semibold text-xl text-center rounded-md">
                {event.status === "happening" ? (
                  <Link
                    to={
                      event.gameType === "shaking"
                        ? `/shaking-game/main/`
                        : `/quiz-game/main/${event.eventId}`
                    }
                  >
                    Play
                  </Link>
                ) : (
                  <div
                    onClick={() => {
                      toast({
                        description: "Event is not happening!",
                      });
                    }}
                  >
                    Play
                  </div>
                )}
              </div>

              <button
                onClick={() => handleFavorite()}
                className="flex-1 border-slate-700 text-slate-700 border-2 p-3 font-semibold text-xl text-center rounded-md"
              >
                {isFavorite ? "Unfavorite" : "Favorite"}
              </button>
            </div>
            <div className="font-bold text-xl">Gift Vouchers</div>
            <div>
              {event.vouchers.map((voucher, index) => (
                <div
                  key={index}
                  className="bg-white my-2 flex pr-2 border border-slate-300 relative rounded-sm"
                  onClick={() => handleSelectVoucher(voucher)}
                >
                  <div className="w-1/3 flex items-center border-r-2 border-slate-200 border-dashed relative">
                    <img
                      src={voucher.imgUrl}
                      className="max-h-44 h-full w-full object-cover"
                    />
                  </div>
                  <div className="py-2 w-2/3 pl-2 text-left">
                    <div>
                      <div className="mb-1 font-medium line-clamp-2">
                        {voucher.description}
                      </div>
                      <div className="mb-2 line-clamp-1 text-sm">
                        {event.brandName}
                      </div>
                    </div>
                    <div className="mb-2 flex gap-1">
                      {voucher.redeemMethod === "both" ? (
                        <>
                          <div className="text-sm bg-blue-400 text-white p-1 rounded-md mr-1">
                            Online
                          </div>
                          <div className="text-sm bg-yellow-400 p-1 rounded-md mr-1">
                            Offline
                          </div>
                        </>
                      ) : (
                        <div
                          className={`text-sm p-1 rounded-md mr-1 capitalize ${
                            voucher.redeemMethod === "online"
                              ? "bg-blue-400 text-white"
                              : "bg-yellow-400"
                          }`}
                        >
                          {voucher.redeemMethod}
                        </div>
                      )}
                    </div>

                    <div className="text-[#7d4af9] text-sm">
                      Expired:{" "}
                      {new Date(voucher.expiryDt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(voucher.remainings / voucher.quantity) * 100}
                        className="h-2 progress-bar"
                      />
                      <div className="text-sm text-slate-400">
                        {voucher.remainings}/{voucher.quantity}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventDetails;
