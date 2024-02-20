import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";

const styles = StyleSheet.create({
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        borderStyle: 'solid',
    },
    item: {
      padding: 10,
      fontSize: 16,
    },
    lineref: {},
    title: {
      flexWrap: 'wrap',
      flexGrow: 1,
      flexShrink: 1,
    },
    time: {},
    scroller: {
        borderColor: 'red',
        borderWidth: 1,
    }
  });

function ListComponent({list}) {

    function getTime(t) {
        const now = new Date().getTime()
        const deltaMin = (t - now / 1000) / 60
        if (deltaMin < 10) {
          return `${Math.round(deltaMin)} min`
        } else {
          const d = new Date(t * 1000)
          const h = d.getHours()
          const m = d.getMinutes()
          return `${h}:${m.toString().padStart(2, '0')}`
        }
      }

    return (
            <FlatList
                data={list}
                renderItem={({item}) => (
                    <View style={styles.itemContainer}>
                        <Text textBreakStrategy='highQuality' style={styles.item}>{item.lineref}</Text>
                        <Text style={[styles.item, styles.title]}>{item.destinationdisplay}</Text>
                        <Text style={styles.item}>{getTime(item.expecteddeparturetime)}</Text>
                    </View>
                )}
                />
    )
}

export default ListComponent