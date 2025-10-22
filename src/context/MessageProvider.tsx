import React, { createContext, useContext } from "react";
import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";

type MessageContextType = {
    messageApi: MessageInstance;
};

const MessageContext = createContext<MessageContextType | null>(null);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [messageApi, contextHolder] = message.useMessage();

    return (
        <MessageContext.Provider value={{ messageApi }}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useMessageApi = (): MessageInstance => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessageApi must be used within a MessageProvider");
    }
    return context.messageApi;
};
