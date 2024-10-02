import React from 'react';
import { createStackNavigator, StackNavigationOptions } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LandingScreen from '../screens/LandingScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import SignedInScreen from '../screens/SignedInScreen';
import AccountScreen from '../screens/AccountScreen';
import SearchResultScreen from '../screens/SearchResultScreen';

type RootStackParamList = {
    Landing: undefined;
    Login: undefined;
    Signup: undefined;
    SignIn: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="Landing" component={LandingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Signup" component={SignupScreen} />
                <Stack.Screen name="SignIn" component={SignedInScreen} />
                <Stack.Screen name="Account" component={AccountScreen} />
                <Stack.Screen name="SearchResult" component={SearchResultScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
export default AppNavigator;