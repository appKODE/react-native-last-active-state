import * as React from 'react';

import { StyleSheet, View, Text, Button, Alert } from 'react-native';
import LastActiveState from 'react-native-last-active-state';

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
    <View style={styles.container}>
      <Text>now: {Date.now() / 1000}</Text>
      <Text>Last active time: {result}</Text>
      <Button
        onPress={() =>
          LastActiveState.getLastActiveTime().then((result) => {
            Alert.alert('Last active time', String(result));
          })
        }
        title="Get last active time"
      />

      <Button
        onPress={() =>
          Alert.alert(
            'Last active time',
            String(LastActiveState.getLastActiveTimeSync())
          )
        }
        title="Get last active time SYNC"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
