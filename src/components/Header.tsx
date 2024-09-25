import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View, StyleSheet, ViewStyle} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import Icon from './Icon';
import colors from '../config/colors';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import {FONT_SIZES, FONT_VARIANT} from '../config/themes';
import Image, {ImageIconNames} from '../components/Image';
import Text from './Text';
import {RenderActiveStatus} from '../screens/userManagement/UsersMainPage';
import {database} from '../utils/firebase';
import {onValue, ref} from '@react-native-firebase/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch, useAppSelector} from '../redux/store';
import { allUserNotification } from '../redux/features/masterSlice';

type HeaderPropsTypes = {
  title?: string;
  avoidBackButton?: boolean;
  dashboard?: boolean;
  onPressMenuIcon?: () => void;
  onPressBellIcon?: () => void;
  // onPressProfileIcon?: () => void;
  onPressBackArrow?: () => void;
  onPressLogoutButton?: () => void;
  icon?: ImageIconNames;
  scrollTransition?: boolean;
  isScrolled?: boolean;
  isActive?: 'Active' | 'Inactive';
};

const Header: FC<HeaderPropsTypes> = ({
  title,
  avoidBackButton,
  dashboard,
  onPressMenuIcon,
  onPressBellIcon,
  // onPressProfileIcon,
  onPressBackArrow,
  onPressLogoutButton,
  icon,
  scrollTransition,
  isScrolled,
  isActive,
}) => {
  const navigation = useNavigation();
  const onPressProfileIcon = () => {
    navigation.navigate('MyAccount' as never);
  };
  // const [showNotification, setShowNotification] = useState<boolean>(false);
  const {notificationResponse} = useAppSelector(state => state.master);
  const {userData} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  
  useEffect(() => {
    // Hardcoded userId for demonstration
    // const userRef = ref(database, `PAF-USER/4`);
    const userRef = ref(database, `PAF-USER/${userData.id}`);

    const checkWebFlag = async (snapshot: any) => {
      const data = snapshot.val();

      if (data && data.mobile) {
        dispatch(
          allUserNotification([
            userData.id,
            {
              page: 0,
              size: 0,
              type: 'all',
            },
          ]),
        );
        // setShowNotification(true);
      } else {
        // setShowNotification(false);
      }
    };

    const unsubscribe = onValue(userRef, checkWebFlag, error => {
      console.error('Error with Firebase listener:', error);
    });

    // Cleanup function to remove listener when component unmounts
    return () => {
      unsubscribe(); // This removes the Firebase listener
    };
  }, []);

  return (
    <View style={styles.headerContainer}>
      {dashboard && (
        <View style={styles.dashboardContainer}>
          <TouchableOpacity
            onPress={onPressMenuIcon}
            style={{height: '70%', justifyContent: 'flex-end', width: '20%',right:5}}>
            <Icon name="menu_icon" />
          </TouchableOpacity>
          <View style={styles.iconRow}>
            {/* <TouchableOpacity onPress={onPressBellIcon} style={{width: '50%'}}>
              <Icon name="bell_icon" />
            </TouchableOpacity> */}
            <TouchableOpacity onPress={onPressBellIcon} style={{width: '50%'}}>
              <View style={styles.iconWrapper}>
                <Icon name="bell_icon" />
                {notificationResponse?.dataList.isNewNotification && (
                  <View style={styles.redDot} />
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressProfileIcon}
              style={{width: '30%'}}>
              <Icon name="profile_icon" />
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.mainHeader}>
        <View
          style={[
            styles.titleContainer,
            {top: scrollTransition && !isScrolled ? 20 : 0},
          ]}>
          {!avoidBackButton && !dashboard && (
            <TouchableOpacity
              onPress={() => {
                onPressBackArrow ? onPressBackArrow() : navigation.goBack();
              }}
              style={styles.backButton}>
              <Icon name="back_button" />
            </TouchableOpacity>
          )}
          {((title && !scrollTransition) ||
            (title && scrollTransition && isScrolled)) && (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.title}>{title}</Text>
              {isActive && (
                <RenderActiveStatus
                  style={{left: 5}}
                  isActive={isActive == 'Active'}
                />
              )}
            </View>
          )}
        </View>
        {icon && (
          <TouchableOpacity
            onPress={() => {}}
            style={
              scrollTransition && !isScrolled
                ? {...styles.iconScrolled, ...styles.iconContainer}
                : styles.iconContainer
            }>
            <Image
              name={icon}
              size={
                !scrollTransition || (scrollTransition && isScrolled) ? 0.5 : 1
              }
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: colors.primaryLightColor,
    height: normaliseDesigns(50),
  },
  dashboardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    width: '100%',
    height: '100%',
    paddingLeft:2 
  },
  iconRow: {
    flexDirection: 'row',
    width: '20%',
    height: '70%',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '70%',
    width: normaliseDesigns(30),
    right:15
  },
  title: {
    fontSize: FONT_SIZES.body3,
    fontFamily: FONT_VARIANT.bold,
    color: colors.blackColor,
    textAlign: 'left',
  },
  iconScrolled: {
    top: 35,
    // right: 10,
  },
  iconContainer: {
    width: '25%',
    height: '100%',
    alignItems: 'center',
  },
  iconWrapper: {
    position: 'relative',
  },
  redDot: {
    position: 'absolute',
    top: -3, // Adjust this value as needed
    right: 15, // Adjust this value as needed
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
  },
});

export default Header;
// import React, { FC } from 'react';
// import { TouchableOpacity, View, StyleSheet } from 'react-native';
// import { useNavigation, DrawerActions } from '@react-navigation/native';

// import Icon from './Icon';
// import colors from '../config/colors';
// import { normaliseDesigns } from '../utils/helpers/responsiveHelpers';
// import { FONT_SIZES, FONT_VARIANT } from '../config/themes';
// import Image, { ImageIconNames } from '../components/Image';
// import Text from './Text';
// import { RenderActiveStatus } from '../screens/userManagement/UsersMainPage';

// type HeaderPropsTypes = {
//   title?: string;
//   avoidBackButton?: boolean;
//   dashboard?: boolean;
//   onPressMenuIcon?: () => void;
//   onPressBellIcon?: () => void;
//   onPressBackArrow?: () => void;
//   onPressLogoutButton?: () => void;
//   icon?: ImageIconNames;
//   scrollTransition?: boolean;
//   isScrolled?: boolean;
//   isActive?: 'Active' | 'Inactive';
// };

// const Header: FC<HeaderPropsTypes> = ({
//   title,
//   avoidBackButton,
//   dashboard,
//   onPressMenuIcon,
//   onPressBellIcon,
//   onPressBackArrow,
//   onPressLogoutButton,
//   icon,
//   scrollTransition,
//   isScrolled,
//   isActive,
// }) => {
//   const navigation = useNavigation();

//   const handleMenuIconPress = () => {
//     navigation.dispatch(DrawerActions.openDrawer());
//   };

//   const onPressProfileIcon = () => {
//     navigation.navigate('MyAccount' as never);
//   };

//   return (
//     <View style={styles.headerContainer}>
//       {dashboard && (
//         <View style={styles.dashboardContainer}>
//           <TouchableOpacity
//             onPress={onPressMenuIcon || handleMenuIconPress}
//             style={{ height: '70%', justifyContent: 'flex-end', width: '20%' }}>
//             <Icon name="menu_icon" />
//           </TouchableOpacity>
//           <View style={styles.iconRow}>
//             <TouchableOpacity onPress={onPressBellIcon} style={{ width: '50%' }}>
//               <Icon name="bell_icon" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={onPressProfileIcon}
//               style={{ width: '50%' }}>
//               <Icon name="profile_icon" />
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//       <View style={styles.mainHeader}>
//         <View
//           style={[
//             styles.titleContainer,
//             { top: scrollTransition && !isScrolled ? 20 : 0 },
//           ]}>
//         {!avoidBackButton && !dashboard && (
//   <TouchableOpacity
//     onPress={handleMenuIconPress} // Remove the arrow function and just pass the function reference
//     style={styles.backButton}>
//     <Icon name="menu_icon" />
//   </TouchableOpacity>
// )}
//           {((title && !scrollTransition) ||
//             (title && scrollTransition && isScrolled)) && (
//             <View style={{ flexDirection: 'row' }}>

//               {isActive && (
//                 <RenderActiveStatus style={{ left: 5 }} isActive={isActive === 'Active'} />
//               )}
//             </View>
//           )}
//         </View>
//         {icon && (
//           <TouchableOpacity
//             onPress={() => {}}
//             style={
//               scrollTransition && !isScrolled
//                 ? { ...styles.iconScrolled, ...styles.iconContainer }
//                 : styles.iconContainer
//             }>
//             <Image
//               name={icon}
//               size={
//                 !scrollTransition || (scrollTransition && isScrolled) ? 0.5 : 1
//               }
//             />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   headerContainer: {
//     justifyContent: 'flex-end',
//     width: '100%',
//     paddingBottom: 15,
//     paddingHorizontal: 20,
//     backgroundColor: colors.primaryLightColor,
//     height: normaliseDesigns(50),
//   },
//   dashboardContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//     width: '100%',
//     height: '100%',
//   },
//   iconRow: {
//     flexDirection: 'row',
//     width: '20%',
//     height: '70%',
//     justifyContent: 'space-around',
//     alignItems: 'flex-end',
//   },
//   mainHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     width: '100%',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   backButton: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: '70%',
//     width: normaliseDesigns(30),
//   },
//   title: {
//     fontSize: FONT_SIZES.body3,
//     fontFamily: FONT_VARIANT.bold,
//     color: colors.blackColor,
//     textAlign: 'left',
//   },
//   iconScrolled: {
//     top: 35,
//   },
//   iconContainer: {
//     width: '25%',
//     height: '100%',
//     alignItems: 'center',
//   },
// });

// export default Header;
