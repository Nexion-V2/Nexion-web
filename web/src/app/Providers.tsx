"use client";

// Patch Ant Design v5 to be compatible with React 19 at runtime. This must be
// imported as a side-effect before any antd components are loaded in the
// client bundle.
import React from "react";
import { store } from "@/redux/store";
import { Provider } from "react-redux";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { PanelProvider } from "@/context/PanelContext";
import { ThemeProvider } from "@/context/ThemeProvider";
import { SocketProvider } from "@/context/SocketContext";
// import { ClassroomProvider } from "@/context/ClassroomContext";
import { ChatProvider } from "@/context/ChatContext/ChatProvider";
import { ConfigProvider } from "antd";
import { ConversationProvider } from "@/context/ChatContext/ConversationProvider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Toaster position="bottom-right"/>
      <Provider store={store}>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#1DA57A",
            },
            components: {
              Message: {
                contentBg: "#1F1F1F",
                colorText: "#FFFFFFD9",
              },
            },
          }}
        >
          <AuthProvider>
            <SocketProvider>
              <PanelProvider>
                <ConversationProvider>
                  <ChatProvider>
                    {/* <ClassroomProvider> */}
                      <ThemeProvider>{children}</ThemeProvider>
                    {/* </ClassroomProvider> */}
                  </ChatProvider>
                </ConversationProvider>
              </PanelProvider>
            </SocketProvider>
          </AuthProvider>
        </ConfigProvider>
      </Provider>
    </>
  );
}
