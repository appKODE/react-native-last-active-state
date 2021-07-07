import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

export type LastActiveStateEvent = { lastActiveTime: number };

export type LastActiveStateEventHandle = (e: LastActiveStateEvent) => void;

export type LastActiveStateType = {
  getLastActiveTime: () => Promise<number>;
  getLastActiveTimeSync: () => number;
  initialLastActiveTime: number;
  addListener: (handle: LastActiveStateEventHandle) => EmitterSubscription;
};

const { LastActiveState } = NativeModules;

const initialLastActiveTime =
  LastActiveState.getConstants().initialLastActiveTime;

const nativeEmitter = new NativeEventEmitter(LastActiveState);

let _lastActiveTime = initialLastActiveTime;

function generalHandle(e: LastActiveStateEvent) {
  _lastActiveTime = e.lastActiveTime;
}

nativeEmitter.addListener('changeLastActiveTime', generalHandle);

export default {
  ...LastActiveState,
  initialLastActiveTime,
  addListener: (handle: LastActiveStateEventHandle) => {
    const cb = (e: LastActiveStateEvent) => {
      handle(e);
      generalHandle(e);
    };
    return nativeEmitter.addListener('changeLastActiveTime', cb);
  },
  getLastActiveTimeSync: () => _lastActiveTime,
  getLastActiveTime: () =>
    new Promise((resolve) => LastActiveState.getLastActiveTime(resolve)),
} as LastActiveStateType;
