import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import colors from '../../config/colors';
import { AnalyticsStackParamList } from '../../navigation/AnalyticsStack';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Layout from '../../components/Layout';
import { Drawer } from 'react-native-drawer-layout';
import DrawerContent from '../../components/DrawerContent';
import Text from '../../components/Text';

type UsageAnalyticsNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'UsageAnalytics'
>;

type UsageAnalyticsRouteProp = RouteProp<
  AnalyticsStackParamList,
  'UsageAnalytics'
>;

interface UsageAnalyticsScreenProps {
  navigation: UsageAnalyticsNavigationProp;
  route: UsageAnalyticsRouteProp;
}

const UsageAnalytics: React.FC<UsageAnalyticsScreenProps> = ({
  navigation,
  route,
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(5);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      // Automatically redirect the user when countdown reaches 0
      handleRedirect();
    }
  }, [countdown]);

  const handleRedirect = () => {
    const url = 'https://analytics.google.com/analytics/web/#/provision';
    Linking.openURL(url).catch((err) =>
      console.error('An error occurred', err)
    );
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => (
        <DrawerContent closeDrawer={() => setIsDrawerOpen(false)} />
      )}
    >
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{ paddingHorizontal: 15 }}
        onPressBellIcon={() => navigation.navigate('Notifications')}
        onPressMenuIcon={() => setIsDrawerOpen(true)}
        focusedStack="AnalyticsStack"
        avoidBackButton
        dashboard
      >
        <View style={{ marginVertical: 10, bottom: 20 }}>
          <Text size="body4" fontVariant="bold" style={{ marginVertical: 20, padding: 5 }}>
            Usage Analytics
          </Text>
        </View>
        <View style={styles.redirectContainer}>
          <Text style={styles.redirectText}>
            You are being redirected to Google Analytics login page, please wait...
          </Text>
          <Text style={styles.redirectText}>
            In case, if you haven't been redirected in{' '}
            <Text style={styles.countdown}>{countdown} seconds</Text>,
            please click on the Continue button.
          </Text>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleRedirect}
          >
            <Text style={{ color: colors.blackColor }}>Continue</Text>
          </TouchableOpacity>
        </View>
      </Layout>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  redirectContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redirectText: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  countdown: {
    color: '#F4C24A',
    fontWeight: 'bold',
  },
  continueButton: {
    marginTop: 20,
    backgroundColor: '#F4C24A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
});

export default UsageAnalytics;
