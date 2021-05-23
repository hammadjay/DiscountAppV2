import { StatusBar } from 'expo-status-bar';
import Constants from 'expo-constants';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  ScrollView,
  Button,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Icon, ListItem } from 'react-native-elements';
import { Alert } from 'react-native';

const HomeScreen = ({ navigation, route }) => {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [isSaveEnabled, setSaveEnabled] = useState(true);
  const [saveStatus, setSaveStatus] = useState(false);
  const [historyArray, setHistoryArray] = useState([]);

  useEffect(() => {
    if (route.params?.historyUpdate) {
      setHistoryArray(route.params?.historyUpdate);
    }
  }, [route.params?.historyUpdate]);

  useEffect(() => {
    if (price.length > 0 && discount.length > 0) {
      setSaveEnabled(false);
    } else {
      setSaveEnabled(true);
    }
    if (saveStatus) {
      setSaveEnabled(true);
    }
  },[price.length, discount.length, saveStatus]);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View>
          <Text style={[styles.header, { marginTop: 20 }]}>Discount App</Text>
          <Icon name="tags" size={50} type="font-awesome" color="orange" />
        </View>

        <View style={{ marginTop: 50 }}>
          <View style={{ alignItems: 'center' }}>
            <TextInput
              style={styles.inputStyle}
              placeholder="Enter original $"
              keyboardType="decimal-pad"
              value={price}
              onChangeText={(text) => {
                if (text > -1 && text != ' ') {
                  setPrice(text);
                  setSaveStatus(false);
                }
              }}
            />

            <TextInput
              style={styles.inputStyle}
              placeholder="Enter discount %"
              keyboardType="decimal-pad"
              value={discount}
              maxLength={3}
              onChangeText={(text) => {
                if ((text > 0 && text < 101) || (text == '' && text != ' ')) {
                  setDiscount(text);
                  setSaveStatus(false);
                }
              }}
            />
          </View>

          <View style={{ width: '80%', alignSelf: 'center', marginTop: 30 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={styles.Processed}>FINAL PRICE:</Text>
              <Text style={styles.Processed}>
                ${parseFloat(price - price * (discount / 100)).toFixed(2)}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 10,
              }}>
              <Text style={styles.Processed}>YOU SAVE:</Text>
              <Text style={styles.Processed}>
                ${parseFloat(price * (discount / 100)).toFixed(2)}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.SaveButton,
                { backgroundColor: isSaveEnabled ? 'gray' : '#f3954f' },
              ]}
              disabled={isSaveEnabled}
              onPress={() => {
                var savings = parseFloat(price * (discount / 100)).toFixed(2);
                var fPrice = parseFloat(
                  price - price * (discount / 100)
                ).toFixed(2);
                var obj = {
                  key: historyArray.length,
                  actualPrice: price,
                  discountPercent: discount,
                  finalPrice: fPrice,
                  saved: savings,
                };
                setSaveEnabled(true);
                setSaveStatus(true);
                setHistoryArray([...historyArray, obj]);
                setPrice('');
                setDiscount('');
              }}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 25,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                }}>
                SAVE
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            flex: 1,
          }}>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => {
              navigation.navigate('History', { historyArray });
            }}>
            <Icon name="history" size={40} color="white" />
          </TouchableOpacity>
        </View>
        <StatusBar style="auto" />
      </ScrollView>
    </View>
  );
};

const HistoryScreen = ({ navigation, route }) => {
  const { historyArray } = route.params;
  const [isEditable, setEditable] = useState(false);
  const [historyList, setHistory] = useState(historyArray);

  
    useEffect(()=>{

      navigation.setOptions({
        headerRight: () => (
          <Button
            title="Clear All"
            color="red"
            onPress={() => {
              Alert.alert('Confirm', 'Are you sure you want to clear all items ?', [
                {
                  text: 'Delete All',
                  onPress: () => {
                    removeAll();
                  },
                },
                { text: 'cancel' },
              ]);
            }}
          />
        ),
      });
    })
  

  const removeItem = (key) => {
    var list = historyList.filter((item) => key != item.key);
    setHistory(list);
  };
  const removeAll = () => {
    navigation.navigate({
      name: 'Home',
      params: { historyUpdate: [] },
      merge: true,
    });
  };

  if (historyList.length == 0 && !isEditable) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
        }}>
        <Icon name="frown" size={50} type="feather" />
        <Text style={{ fontSize: 20, color: 'black' }}>Wow, Such Empty</Text>
      </View>
    );
  } else {
    return (
      <ScrollView>
        <View>
          <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
            <TouchableOpacity
              style={{
                backgroundColor: 'green',
                elevation: 5,
                padding: 8,
                borderRadius: 10,
                marginRight: 10,
                width: '18%',
                marginVertical: 5,
                display: isEditable ? 'flex' : 'none',
              }}
              onPress={() => {
                navigation.navigate({
                  name: 'Home',
                  params: { historyUpdate: historyList },
                  merge: true,
                });
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}>
                Save
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                backgroundColor: 'red',
                elevation: 5,
                padding: 8,
                borderRadius: 10,
                marginRight: 10,
                width: '15%',

                marginVertical: 5,
              }}
              onPress={() => {
                setEditable(!isEditable);
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: 20,
                }}>
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {historyList.map((item, i) => (
          <ListItem key={i} bottomDivider>
            <ListItem.Content>
              <ListItem.Title style={{ fontWeight: 'bold', fontSize: 20 }}>
                ${item.actualPrice} - {item.discountPercent}% = $
                {item.finalPrice}
              </ListItem.Title>
            </ListItem.Content>
            <View style={{ display: isEditable ? 'flex' : 'none' }}>
              <Icon
                name="trash"
                color="red"
                type="feather"
                onPress={() => {
                  removeItem(item.key);
                }}
              />
            </View>
          </ListItem>
        ))}
      </ScrollView>
    );
  }
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: Constants.statusBarHeight,
  },
  inputStyle: {
    backgroundColor: '#f9d162',
    height: 50,
    padding: 12,
    margin: 5,
    width: '75%',
    color: '#ed7c28',
    fontWeight: 'bold',
    fontSize: 18,
    borderWidth: 5,
    borderTopColor: 'white',
    borderLeftColor: 'white',
    borderRightColor: 'white',
    borderBottomColor: '#f3954f',
  },
  SaveButton: {
    borderRadius: 50,
    elevation: 8,
    padding: 20,
    marginTop: 30,
    width: '60%',
    alignSelf: 'center',
    shadowColor: '#f9d162',
    shadowRadius: 3,
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 1,
  },
  header: {
    fontSize: 40,
    fontWeight: 'bold',
    alignSelf: 'center',
    textShadowColor: '#f9d162',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 10,
    color: '#f3954f',
    marginBottom: 10,
  },
  Processed: {
    fontSize: 25,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#ed7c28',
  },
  historyButton: {
    backgroundColor: '#f3954f',
    borderRadius: 50,
    padding: 15,
    elevation: 8,
    shadowColor: '#f9d162',
    shadowRadius: 3,
    shadowOffset: { width: 2, height: 5 },
    shadowOpacity: 1,
    position: 'absolute',
    bottom: 15,
    right: 18,
  },
});
