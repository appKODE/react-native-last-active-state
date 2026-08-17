import type { HybridObject } from 'react-native-nitro-modules';

export interface LastActiveState
  extends HybridObject<{ ios: 'swift'; android: 'kotlin' }> {
  readonly initialLastActiveTime: number;
  onLastActiveTimeChanged: ((lastActiveTime: number) => void) | undefined;
  getLastActiveTime(): Promise<number>;
  getLastActiveTimeSync(): number;
}
