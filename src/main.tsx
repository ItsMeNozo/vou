import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { SocketProvider } from "@/providers/SocketProvider.tsx";
import { ConfigProvider } from "antd";
import { StyleProvider } from "@ant-design/cssinjs";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "black",
          fontSize: 16,
        },
        components: {
          Button: {
            colorPrimary: "black",
          },
        },
      }}
    >
      <StyleProvider hashPriority="high">
        <SocketProvider>
          <App />
        </SocketProvider>
      </StyleProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
