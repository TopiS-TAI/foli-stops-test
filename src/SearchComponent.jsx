import { Alert, Button, StyleSheet, TextInput, View } from "react-native"
import { AutocompleteDropdown } from "react-native-autocomplete-dropdown";

const styles = StyleSheet.create({
    header: {
      backgroundColor: 'rgb(240, 179, 35)',
      display: 'flex',
      flexDirection: 'row',
      padding: 10,
    }
  });

function SearchComponent({stop, setStop, stopNames, onSelect}) {
    return (
        <View style={styles.header}>
            {/* <AutocompleteDropdown
                containerStyle={{ flex: 1, fontSize: 18}}
                inputContainerStyle={{backgroundColor: '#FFF'}}
                clearOnFocus={false}
                closeOnBlur={true}
                closeOnSubmit={false}
                initialValue={{ id: '20' }} // or just '2'
                onSelectItem={(item) => setStop(item && item.id)}
                dataSet={stopNames}
                /> */}
            <TextInput
                style={{height: 40, backgroundColor: '#FFF', flex: 1, paddingLeft: 8, fontSize: 18}}
                placeholder="Pysäkki"
                onChangeText={newText => setStop(newText)}
                defaultValue={stop}
                keyboardType='number-pad'
            />
            <Button
                onPress={onSelect}
                title='Hae'
                
                />
        </View>
    )
}

export default SearchComponent