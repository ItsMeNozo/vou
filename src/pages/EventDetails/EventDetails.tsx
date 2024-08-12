import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import Event from "@/models/event";
import axios from "axios";
import "./EventDetails.css";

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const EventDetails: React.FC = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event>();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/event/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.log("Failed to fetch events");
      }
    };

    fetchEvent();
  }, []);

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
              alt={event.name}
              className="object-cover rounded-md"
            />
          </div>
          <div className="text-left flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-medium">{event.name}</div>
              <div className="">{event.description}</div>
            </div>
            <div>
              The campaign is run by
              <span className="font-medium text-lg"> {event.brand}</span>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <span className="font-medium">Duration: </span>
                <span className="text-[#7d4af9]">
                  {new Date(event.startDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                  })}{" "}
                  -{" "}
                  {new Date(event.endDate).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                  })}
                </span>
              </div>
              <div className={`${event.status == "happening" ? "bg-green-400" : "bg-yellow-400"} p-1 rounded-md`}>{capitalizeFirstLetter(event.status)}</div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-[#7d4af9] text-white p-3 font-semibold text-xl text-center rounded-md">
                Play
              </div>
              <div className="flex-1 border-slate-700 text-slate-700 border-2 p-3 font-semibold text-xl text-center rounded-md">
                Favorite
              </div>
            </div>
            <div className="font-bold text-xl">Gift Vouchers</div>
            <div>
              {event.vouchers.map((voucher, index) => (
                <div
                  key={index}
                  className="bg-white my-2 flex pr-2 border border-slate-300 relative rounded-sm"
                >
                  <div className="w-1/3 flex items-center border-r-2 border-slate-200 border-dashed relative">
                    <img
                      src={voucher.voucher.imgUrl}
                      className="max-h-44 h-full w-full object-cover"
                    />
                  </div>
                  <div className="py-2 w-2/3 pl-2 text-left">
                    <div>
                      <div className="mb-1 font-medium line-clamp-2">
                        {voucher.voucher.description}
                      </div>
                      <div className="mb-2 line-clamp-1 text-sm">
                        {event.brand}
                      </div>
                    </div>
                    <div className="mb-2 flex gap-1">
                      {voucher.voucher.redeemMethod.map((method, index) =>
                        method === "Online" ? (
                          <div
                            key={index}
                            className="text-sm bg-blue-400 text-white p-1 rounded-md mr-1"
                          >
                            {method}
                          </div>
                        ) : (
                          <div
                            key={index}
                            className="text-sm bg-yellow-400 p-1 rounded-md mr-1"
                          >
                            {method}
                          </div>
                        ),
                      )}
                    </div>
                    <div className="text-[#7d4af9] text-sm">
                      Expired:{" "}
                      {new Date(voucher.voucher.expiryDate).toLocaleDateString(
                        "en-GB",
                        { day: "2-digit", month: "2-digit", year: "numeric" },
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={(voucher.available / voucher.quantity) * 100}
                        className="h-2 progress-bar"
                      />
                      <div className="text-sm text-slate-400">
                        {voucher.available}/{voucher.quantity}
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
