import {TYPES} from './config';
import {
  checkAuthen,
  loginCallback,
  loginSDK,
  requestLogin,
  sendMessage,
} from './login';

document.addEventListener('DOMContentLoaded', () => {
  try {
    console.log('init script');
    //checkAuthen();
    loginSDK();
  } catch (e) {
    console.error(e);
    /* handle error */
  }
});

declare global {
  interface Window {
    GameSDK: {
      TYPES: any;
      loginCallback: (success: any, error: any) => void;
      checkAuthen: any;
      requestLogin: any;
      sendMessage;
    };
  }
}
window.GameSDK = {TYPES, requestLogin, sendMessage, loginCallback, checkAuthen};
