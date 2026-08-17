import { NitroModules } from 'react-native-nitro-modules';
import type { LastActiveState as Spec } from './specs/LastActiveState.nitro';

export type LastActiveStateEvent = { lastActiveTime: number };

export type LastActiveStateEventHandle = (e: LastActiveStateEvent) => void;

export type Subscription = { remove: () => void };

export type LastActiveStateType = {
  getLastActiveTime: () => Promise<number>;
  getLastActiveTimeSync: () => number;
  initialLastActiveTime: number;
  addListener: (handle: LastActiveStateEventHandle) => Subscription;
};

const NativeModule = NitroModules.createHybridObject<Spec>('LastActiveState');

const listeners = new Set<LastActiveStateEventHandle>();

NativeModule.onLastActiveTimeChanged = (lastActiveTime: number) => {
  listeners.forEach((listener) => listener({ lastActiveTime }));
};

const LastActiveState: LastActiveStateType = {
  initialLastActiveTime: NativeModule.initialLastActiveTime,
  getLastActiveTime: () => NativeModule.getLastActiveTime(),
  getLastActiveTimeSync: () => NativeModule.getLastActiveTimeSync(),
  addListener: (handle: LastActiveStateEventHandle): Subscription => {
    listeners.add(handle);
    return {
      remove: () => {
        listeners.delete(handle);
      },
    };
  },
};

export default LastActiveState;
