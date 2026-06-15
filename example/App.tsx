import { useEffect, useState } from 'react';
import { Alert, Button, StyleSheet, Text, View } from 'react-native';
import LastActiveState from '@kode-frontend/react-native-last-active-state';

function App() {
  const [result, setResult] = useState<number | undefined>(
    LastActiveState.getLastActiveTimeSync()
  );

  useEffect(() => {
    const listener = LastActiveState.addListener(({ lastActiveTime }) => {
      setResult(lastActiveTime);
    });
    return () => {
      listener.remove();
    };
  }, []);

  // @ts-ignore
  const isNewArchitectureEnabled = global.nativeFabricUIManager != null;

  return (
    <View style={styles.container}>
      <Text>
        {isNewArchitectureEnabled
          ? 'New Architecture (Fabric)'
          : 'Old Architecture'}
      </Text>

      {result ? (
        <Text>
          Was inactive time:{' '}
          <Text style={{ fontWeight: 'bold' }}>
            {Math.floor(Date.now() / 1000) - result}
          </Text>{' '}
          seconds
        </Text>
      ) : null}

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
