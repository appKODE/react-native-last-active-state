# react-native-last-active-state

The library determines the time of the last active state of the application.

## Motivation

When an application is destroyed, it does not receive control, thus there is no way to detect the time spent in an inactive state. This library remembers the time of the last active state, you can get it the next time you start the application.

## Installation

```sh
yarn add @kode-frontend/react-native-last-active-state
```

## Usage

```js
import LastActiveState from "@kode-frontend/react-native-last-active-state";

export default function App() {
    const [result, setResult] = React.useState<number | undefined>(
        LastActiveState.initialLastActiveTime
    );

    React.useEffect(() => {
        const listener = LastActiveState.addListener(({ lastActiveTime }) => {
            setResult(lastActiveTime);
        });
        return () => {
            listener.remove();
        };
    }, []);

  return (
        <View>
            <Text>Last active time: {result}</Text>
            <Button
                onPress={() =>
                Alert.alert(
                    'Last active time',
                    String(LastActiveState.getLastActiveTimeSync())
                )
                }
                title="Get last active time"
            />
        </View>
  );
}

```

## Available methods

| method                   | description                                                      |
| ------------------------ | ---------------------------------------------------------------- |
| addListener              | Subscribing to data changes                                      |
| getLastActiveTime        | Recommended method for getting the time of the last active state |
| getLastActiveTimeSync    | Synchronous method for getting the time of the last active state |

## Types

```ts

type LastActiveStateEvent = { lastActiveTime: number };

type LastActiveStateEventHandle = (e: LastActiveStateEvent) => void;

type LastActiveStateType = {
  getLastActiveTime: () => Promise<number>;
  getLastActiveTimeSync: () => number;
  initialLastActiveTime: number;
  addListener: (handle: LastActiveStateEventHandle) => EmitterSubscription;
};

```

## Tags

`release` - create release tag and increase version
