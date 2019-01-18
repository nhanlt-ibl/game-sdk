import {AuthenURL, ButtonId} from './config';
export const loginCallback = (callback: (success: any, error: any) => void) => {
  window.addEventListener('message', (e: any) => {
    try {
      if (e.data) {
        callback(JSON.parse(e.data || {}), null);
      } else {
        callback(null, 'message error');
      }
    } catch (e) {
      console.error(e);
      /* handle error */
    }
  });
};
export const initAuthenScript = () => {
  document.addEventListener('DOMContentLoaded', () => {
    try {
      const loginBtn: HTMLElement | null = document.getElementById(ButtonId);
      if (!loginBtn) {
        throw `Quanta login button notfound \n Please add id=${ButtonId} into login tag`;
      }
      if (loginBtn.dataset.loginType === 'dialog') {
        const width = 780;
        const height = 700;
        const left = screen.width / 2 - width / 2;
        const top = screen.height / 2 - height / 2;
        const features = `width=${width}, height=${height}, top=${top}, left=${left}`;
        loginBtn.addEventListener('click', () => {
          window.open(
            `${AuthenURL}?client_id=${loginBtn.dataset.clientId}`,
            'Login to Quanta Game Platform ',
            features,
          );
        });
      }
      window.addEventListener('message', (e: any) => {
        console.log('Receiver event: ', e.data);
        document.location.href = `${loginBtn.dataset.redirect}?code=123123123`;
      });
    } catch (e) {
      console.error(e);
      /* handle error */
    }
  });
};
