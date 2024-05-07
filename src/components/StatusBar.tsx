import React, { FC } from 'react';
import { View, StatusBar as RNStatusBar, SafeAreaView, Platform } from 'react-native';

type StatusBarPropsTypes = {
    backgroundColor: any;
    barStyle?: any;
};

const StatusBar: FC<StatusBarPropsTypes> = ({ backgroundColor, barStyle }) => {
    if (Platform.OS === 'ios') {
        return (
            <View style={[backgroundColor]}>
                <SafeAreaView>
                    <RNStatusBar translucent backgroundColor={backgroundColor} />
                </SafeAreaView>
            </View>
        );
    } else
        return (
            <RNStatusBar
                backgroundColor={backgroundColor}
                animated
                barStyle={barStyle ? 'light-content' : 'dark-content'}
            />
        );
};

export default StatusBar;
