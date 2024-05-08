import * as React from 'react';
import { Button, View } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import DrawerContent from '../components/DrawerContent';
import TeacherDashboard from '../screens/dashboard/TeacherDashboard';

export type DrawerTabStackParamList = {
    TeacherDashboard: undefined;
    ObservationReports: undefined;
    RubricDashboard: undefined;
  };

const Drawer = createDrawerNavigator<DrawerTabStackParamList>();

 const DrawerTabStack=()=> {
  return (

      <Drawer.Navigator  drawerContent={(props) => <DrawerContent {...props} />}>
        <Drawer.Screen name="TeacherDashboard" component={TeacherDashboard} />

      </Drawer.Navigator>

  );
}

export default DrawerTabStack;