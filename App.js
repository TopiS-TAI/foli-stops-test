import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, Alert, Button, Dimensions, Platform, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import ListComponent from './src/ListComponent';
import { useEffect, useState } from 'react';
import SearchComponent from './src/SearchComponent';
import { AutocompleteDropdownContextProvider } from 'react-native-autocomplete-dropdown';

export default function App() {
  const [stopNames, setStopNames] = useState([])
  const [filteredStopNames, setFilteredStopNames] = useState([])
  const [data, setData] = useState([])
  const [stopsLoad, setStopsLoad] = useState(false)
  const [filterLoad, setFilterLoad] = useState(false)
  const [stop, setStop] = useState('')
  const headerHeight = Platform.OS === 'ios' ? 40 : 24

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'stretch',
      justifyContent: 'flex-start',
      marginTop: headerHeight,
      fontSize: 18
    },
    item: {
      padding: 10,
      fontSize: 18,
      height: 44,
      textAlign: 'center'
    }
  })

  useEffect(() => {
    fetch('http://data.foli.fi/siri/sm')
      .then((res) => res.json())
      .then((res) => {
        const mappedNames = Object.entries(res).map((e) => {return {id: e[0], title: e[0] + ' ' + e[1].stop_name}} )
        setStopNames(mappedNames)
        setFilteredStopNames(mappedNames)
      })
      .catch((err) => Alert.alert(err.name, err.message))
  }, [])

  function handleButton(stop) {
    setStopsLoad(true)
    fetch('http://data.foli.fi/siri/sm/' + stop)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Pysäkin tietojen haku epäonnistui.')
        }
        return res.json()
      })
      .then((res) => {
        setStopsLoad(false)
        setData(res.result)
      })
      .catch((err) => {
        setStopsLoad(false)
        Alert.alert(err.name, err.message)
      })
  }

  function handleInputChange(val) {
    setFilteredStopNames(
      stopNames.filter((s) => s.title.includes(val))
      )
    setFilterLoad(false)
  }

  function handleFilterStart() {
    setFilterLoad(true)
  }

  return (
      // <AutocompleteDropdownContextProvider>
    <View style={styles.container}>
      <MyStatusBar style="auto" backgroundColor='rgb(240, 179, 35)' />
      <SearchComponent
        stop={stop}
        onInputChange={handleInputChange}
        stopNames={filteredStopNames}
        onSelect={handleButton}
        filterLoad={filterLoad}
        onFilterStart={handleFilterStart}
      />
      
      <ListComponent list={data} />
      { stopsLoad && 
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
    // </AutocompleteDropdownContextProvider>

  );
}

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={{ backgroundColor: backgroundColor }}>
    <SafeAreaView>
      <StatusBar translucent backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);