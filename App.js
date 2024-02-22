import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Button, Dimensions, Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import ListComponent from './src/ListComponent';
import { useEffect, useState } from 'react';
import SearchComponent from './src/SearchComponent';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
    marginTop: Platform.OS === 'ios' ? 40 : 24,
    fontSize: 18
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    textAlign: 'center'
  }
})

export default function App() {
  const lista = [
    {
      lineref: '123',
      destinationdisplay: 'Kauppatori-Linja-autoasema',
      expecteddeparturetime: 1708456455
    }
  ]
  const [stopNames, setStopNames] = useState([])
  const [data, setData] = useState(lista)
  const [load, setLoad] = useState(false)
  const [stop, setStop] = useState('')

  useEffect(() => {
    fetch('http://data.foli.fi/siri/sm')
      .then((res) => res.json())
      .then((res) => {
        const mappedNames = Object.entries(res).map((e) => {return {id: e[0], title: e[0] + ' ' + e[1].stop_name}} )
        setStopNames(mappedNames)
      })
      .catch((err) => Alert.alert(err.name, err.message))
  })

  function handleButton() {
    setLoad(true)
    fetch('http://data.foli.fi/siri/sm/' + stop)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Pysäkin tietojen haku epäonnistui.')
        }
        return res.json()
      })
      .then((res) => {
        setLoad(false)
        setData(res.result)
      })
      .catch((err) => {
        setLoad(false)
        Alert.alert(err.name, err.message)
      })
  }

  return (
      <AutocompleteDropdownContextProvider>
    <View style={styles.container}>
      <MyStatusBar style="auto" backgroundColor='rgb(240, 179, 35)' />

        <SearchComponent stop={stop} setStop={setStop} stopNames={stopNames} onSelect={handleButton} />

      
      <ListComponent list={data} />
      { load && 
        <View
          style={{
            position: 'absolute',
            width: Dimensions.get('screen').width,
            height: Dimensions.get('screen').height,
            backgroundColor: "#FFF", opacity: 0.75,
            display: 'flex',
            alignContent: 'center',
            justifyContent: 'center'
          }}>
            <ActivityIndicator size="large" />
          </View>
      }
    </View>
    </AutocompleteDropdownContextProvider>

  );
}

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={{ backgroundColor: backgroundColor }}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);