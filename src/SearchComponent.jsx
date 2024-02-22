import { useState } from "react";
import { FlatList, StyleSheet, TextInput, View, Text, Dimensions, Pressable, ActivityIndicator, TouchableOpacity, Keyboard, Platform } from "react-native"

function SearchComponent({stop, onInputChange, stopNames, onSelect, filterLoad, onFilterStart}) {
    const [open, setOpen] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [inputWidth, setInputWidth] = useState(null)
    const [debouncer, setDebouncer] = useState(null)

    const styles = StyleSheet.create({
        header: {
          backgroundColor: 'rgb(240, 179, 35)',
          display: 'flex',
          flexDirection: 'row',
          padding: 10,
          zIndex: 5
        },
        input: {
            height: 40,
            backgroundColor: '#FFF',
            flex: 1,
            paddingLeft: 8, 
            fontSize: 18
        },
        list: {
            position: 'absolute',
            left: 10,
            top: Platform.OS === 'ios' ? 60 : 50,
            zIndex: 10,
            width: inputWidth + 36,
            display: open ? 'flex' : 'none',
            maxHeight: Dimensions.get('screen').height - 100,
            overflow: 'hidden'
        },
        itemContainer: {
            backgroundColor: '#FED',
            borderBottomWidth: 1,
            borderBottomColor: '#CCC',
        },
        item: {
            paddingVertical: 10,
            paddingHorizontal: 8,
            fontSize: 16,
        },
        indicator: {
            color: 'rgb(240, 179, 35)',
            paddingHorizontal: 8,
            backgroundColor: "#FFF",
            height: 40,
        },
        button: {
            backgroundColor: "#EEE",
            width: 40,
            alignItems: 'center',
            justifyContent: 'center',
        },
        clearButton: {
            minWidth: 40,
            flexBasis: 40,
        }
      });

    function handleMenuPress(item) {
        setOpen(false)
        setInputValue(item.title)
        onSelect(item.id)
    }

    function handleInputChange(text) {
        onFilterStart()
        setInputValue(text)
        !open && setOpen(true)
        if (debouncer) {
            clearTimeout(debouncer)
            setDebouncer(null)
        }
        setDebouncer(setTimeout(() => {
            onInputChange(text)
        }, 500))
    }

    function clearInput() {
        setInputValue('')
    }

    return (
        <>
        <View style={styles.header}>
            <TextInput
                style={styles.input}
                placeholder="Pysäkki"
                value={inputValue}
                keyboardType='default'
                onChangeText={value => handleInputChange(value)}
                onSubmitEditing={Keyboard.dismiss}
                onLayout={(event) => setInputWidth(event.nativeEvent.layout.width)}
            />
            <ActivityIndicator style={styles.indicator} color="rgb(240, 179, 35)" animating={filterLoad}/>
            <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={clearInput}
                >
                    <Text>X</Text>
            </TouchableOpacity>
        </View>
        <FlatList
            data={stopNames}
            style={styles.list}
            renderItem={({item}) => (
                <Pressable style={styles.itemContainer} onPress={() => handleMenuPress(item)}>
                    <Text style={styles.item}>{item.title}</Text>
                </Pressable>
            )}
            ListEmptyComponent={() => (
                <View style={styles.itemContainer}>
                    <Text style={styles.item}>Ei pysäkkejä</Text>
                </View>
            )}
            />
        </>
    )
}

export default SearchComponent