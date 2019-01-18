import {TYPES} from './config';
import {initAuthenScript, loginCallback} from './login';
export {};
initAuthenScript();
declare global {
  interface Window {
    GameSDK: {
      TYPES: any;
      loginCallback: (success: any, error: any) => void;
    };
  }
}
window.GameSDK = {TYPES, loginCallback};
