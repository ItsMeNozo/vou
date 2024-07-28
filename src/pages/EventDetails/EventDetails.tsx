import React from "react";
import { Progress } from "@/components/ui/progress";
import "./EventDetails.css";

const eventInfo =
  // name, description, imageURL, brand, startTime, endTime, vouchers: [{voucher, quantity}], game, status
  {
    name: "Summer Fun Quiz Challenge",
    description:
      "Join our Summer Fun Quiz Challenge and stand a chance to win refreshing prizes every day! Answer fun trivia questions and earn vouchers.",
    brand_name: "Cool Drinks Inc.",
    startTime: "2024-07-01T10:00:00Z",
    endTime: "2024-07-31T22:00:00Z",
    game_type: "Quiz",
    status: "Happening",
    imageURL:
      "https://ohiostate.pressbooks.pub/app/uploads/sites/8/2016/09/ThinkstockPhotos-483171893.jpg",
    vouchers: [
      // description, condition, voucherCode, qrCode, expiryDate, status
      {
        voucherInfo: {
          description: "Get $10 off your next purchase at Cool Drinks Inc.",
          brand: "Cool Drinks Inc.",
          expired: "2024-12-31T23:59:59Z",
          imageURL:
            "https://i.pinimg.com/originals/d9/95/a3/d995a3d4637c2d04b2b5acfc43640a2d.png",
          redeemMethod: ["Online", "Offline"],
        },
        quantity: 10,
        available: 4,
      },
      {
        voucherInfo: {
          description: "Get $10 off your next purchase at Cool Drinks Inc.",
          brand: "Cool Drinks Inc.",
          expired: "2024-12-31T23:59:59Z",
          imageURL:
            "https://i.pinimg.com/originals/d9/95/a3/d995a3d4637c2d04b2b5acfc43640a2d.png",
          redeemMethod: ["Online", "Offline"],
        },
        quantity: 10,
        available: 4,
      },
      {
        voucherInfo: {
          description: "Get $10 off your next purchase at Cool Drinks Inc.",
          brand: "Cool Drinks Inc.",
          expired: "2024-12-31T23:59:59Z",
          imageURL:
            "https://i.pinimg.com/originals/d9/95/a3/d995a3d4637c2d04b2b5acfc43640a2d.png",
          redeemMethod: ["Online", "Offline"],
        },
        quantity: 10,
        available: 4,
      },
    ],
  };

const EventDetails: React.FC = () => {
  return (
    <>
      <div className="mb-16 p-4">
        <div className="text-left">
          <span className="text-left text-3xl font-bold ">Event Details</span>
        </div>
        <div className="aspect-w-16 aspect-h-9 my-4">
          <img
            src={eventInfo.imageURL}
            alt={eventInfo.name}
            className="object-cover rounded-md"
          />
        </div>
        <div className="text-left flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-2xl font-medium">{eventInfo.name}</div>
            <div className="">{eventInfo.description}</div>
          </div>
          <div>
            The campaign is run by
            <span className="font-medium text-lg"> {eventInfo.brand_name}</span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <span className="font-medium">Duration: </span>
              <span className="text-[#7d4af9]">
                {new Date(eventInfo.startTime).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                })}{" "}
                -{" "}
                {new Date(eventInfo.endTime).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            </div>
            <div className="bg-green-500 text-white p-1 rounded-md">
              {eventInfo.status}
            </div>
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
            {eventInfo.vouchers.map((voucher, index) => (
              <div
                key={index}
                className="bg-white my-2 flex pr-2 border border-slate-300 relative rounded-sm"
              >
                <div className="w-1/3 flex items-center border-r-2 border-slate-200 border-dashed relative">
                  <img
                    src={voucher.voucherInfo.imageURL}
                    className="max-h-44 h-full w-full object-cover"
                  />
                </div>
                <div className="py-2 w-2/3 pl-2 text-left">
                  <div>
                    <div className="mb-1 font-medium line-clamp-2">
                      {voucher.voucherInfo.description}
                    </div>
                    <div className="mb-2 line-clamp-1 text-sm">
                      {voucher.voucherInfo.brand}
                    </div>
                  </div>
                  <div className="mb-2 flex gap-1">
                    {voucher.voucherInfo.redeemMethod.map((method, index) =>
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
                    {new Date(voucher.voucherInfo.expired).toLocaleDateString(
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
    </>
  );
};

export default EventDetails;
