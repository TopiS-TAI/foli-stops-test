import { FlatList, StyleSheet, Text, View, Dimensions } from "react-native";
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome'
import { faBusSimple } from '@fortawesome/free-solid-svg-icons/faBusSimple'

const styles = StyleSheet.create({
  selectedStop: {
    padding: 10,
    fontSize: 24,
  },
    itemContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: '#DDD',
        borderBottomWidth: 1,
        borderStyle: 'solid',
        paddingHorizontal: 6,
    },
    item: {
      paddingHorizontal: 4,
      paddingVertical: 10,
      fontSize: 16,
    },
    lineref: {
      flexBasis: 44,
      paddingRight: 0,
    },
    title: {
      flexWrap: 'wrap',
      flexGrow: 1,
      flexShrink: 1,
    },
    time: {},
    scroller: {
        borderColor: 'red',
        borderWidth: 1,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      height: 400,
    },
    emptyText: {
      color: "#DDD",
      fontSize: 40,
      fontWeight: '600',
      marginTop: 20,
    }
  });

function ListComponent({selectedStop, list}) {

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
      <>
          <Text style={styles.selectedStop}>{selectedStop}</Text>
          <FlatList
              data={list}
              renderItem={({item}) => (
                  <View style={styles.itemContainer}>
                      <Text textBreakStrategy='highQuality' style={[styles.item, styles.lineref]}>{item.lineref}</Text>
                      <Text style={[styles.item, styles.title]}>{item.destinationdisplay}</Text>
                      <Text style={styles.item}>{getTime(item.expecteddeparturetime)}</Text>
                  </View>
              )}
              ListEmptyComponent={() => (
                <View style={styles.emptyContainer}>
                  <FontAwesomeIcon size={Dimensions.get('screen').width * 0.5} color="#DDD" icon={ faBusSimple } />
                  {selectedStop ? (
                    <Text style={styles.emptyText}>Ei busseja</Text>
                  ) : (
                    <Text style={styles.emptyText}>Valitse pysäkki</Text>
                  )}
                </View>
              )}
              />
        </>
    )
}

export default ListComponent