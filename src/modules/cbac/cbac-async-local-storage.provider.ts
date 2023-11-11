import { Provider } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';

export const CbacAsyncLocalStorageToken = 'CBAC_ASYNC_LOCAL_STORAGE_TOKEN';
export const CbacAsyncLocalStorage: Provider = {
  provide: CbacAsyncLocalStorageToken,
  useValue: new AsyncLocalStorage(),
};
