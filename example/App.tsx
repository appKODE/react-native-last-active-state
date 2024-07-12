import React, { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import LastActiveState from '@kode-frontend/react-native-last-active-state';

function App() {
  const [result, setResult] = useState<number | undefined>(
    LastActiveState.initialLastActiveTime
  );

  useEffect(() => {
    const listener = LastActiveState.addListener(({ lastActiveTime }) => {
      setResult(lastActiveTime);
    });
    return () => {
      listener.remove();
    };
  }, []);
  return (
    <View style={styles.container}>
      <Text>now: {Math.floor(Date.now() / 1000)}</Text>
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

export default App;
