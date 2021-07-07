import {
  NativeModules,
  NativeEventEmitter,
  EmitterSubscription,
} from 'react-native';

type EventData = { lastActiveTime: number };

type EventHandle = (e: EventData) => void;

type LastActiveStateType = {
  getLastActiveTime: () => number;
  initialLastActiveTime: number;
  addListener: (handle: EventHandle) => EmitterSubscription;
};

const { LastActiveState } = NativeModules;

const initialLastActiveTime =
  LastActiveState.getConstants().initialLastActiveTime;

const nativeEmitter = new NativeEventEmitter(LastActiveState);

let _lastActiveTime = initialLastActiveTime;

function generalHandle(e: EventData) {
  _lastActiveTime = e.lastActiveTime;
}

nativeEmitter.addListener('changeLastActiveTime', generalHandle);

export default {
  ...LastActiveState,
  initialLastActiveTime,
  addListener: (handle: EventHandle) => {
    const cb = (e: EventData) => {
      handle(e);
      generalHandle(e);
    };
    return nativeEmitter.addListener('changeLastActiveTime', cb);
  },
  getLastActiveTime: () => _lastActiveTime,
} as LastActiveStateType;
