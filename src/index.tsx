import { NativeModules } from 'react-native';

type LastActiveStateType = {
  multiply(a: number, b: number): Promise<number>;
};

const { LastActiveState } = NativeModules;

export default LastActiveState as LastActiveStateType;
