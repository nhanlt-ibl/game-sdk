export {};
declare global {
    interface Window {
        GameSDK: {
            TYPES: any;
            loginCallback: (success: any, error: any) => void;
        };
    }
}
