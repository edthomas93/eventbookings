import initialiseApp from '../src/server';

let appInstance: any = null;

export const getTestApp = async () => {
  if (!appInstance) {
    appInstance = await initialiseApp();
  }
  return appInstance;
};
