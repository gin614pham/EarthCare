import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {Text} from 'react-native';
import {View} from 'react-native';

const Tab = createMaterialTopTabNavigator();

const TabSubTabData = [
  {
    id: 1,
    title: 'Tab 1',
    subTabs: [
      {id: 1, title: 'SubTab 1', parentTab: 'Tab 1', screenName: 'Screen1'},
      {id: 2, title: 'SubTab 2', parentTab: 'Tab 1', screenName: 'Screen2'},
    ],
    screen: 'Screen1',
  },
  {
    id: 2,
    title: 'Tab 2',
    subTabs: [
      {id: 3, title: 'SubTab 1', parentTab: 'Tab 2', screenName: 'Screen3'},
      {id: 4, title: 'SubTab 2', parentTab: 'Tab 2', screenName: 'Screen4'},
    ],
    screen: 'Screen3',
  },
  // Add more objects as needed
];

export const MyTabs = () => {
  return (
    <Tab.Navigator>
      {TabSubTabData.map((item, index) => (
        <Tab.Screen
          key={index}
          name={item.screen}
          options={{
            title: `${item.title}`,
          }}
          component={() => (
            <View>
              <Text>{item.title}</Text>
            </View>
          )}
        />
      ))}
    </Tab.Navigator>
  );
};
