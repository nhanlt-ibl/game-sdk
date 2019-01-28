declare global {
    interface Window {
        GameSDK: {
            TYPES: any;
            loginCallback: (success: any, error: any) => void;
            checkAuthen: any;
            requestLogin: any;
            sendMessage: any;
        };
    }
}
export {};
