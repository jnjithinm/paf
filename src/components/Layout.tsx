import React, {ReactNode, FC, useState, useEffect, Children} from 'react';
import {
  ScrollView,
  ViewStyle,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';

import StatusBar from './StatusBar';
import colors from '../config/colors';
import {ColorTypes} from '../config/types';
import Header from './Header';
import {ImageIconNames} from './Image';
import Loading from './Loading';
import {useAppSelector} from '../redux/store';
import ShowToastMessage from './ShowToastMessage';
import {ScreenNames} from '../utils/helpers/navigationHelpers';
import BottomTab from './BottomTab';

interface LayoutPropsTypes extends ViewStyle {
  children: ReactNode;
  focusedStack?: ScreenNames;
  backgroundColor?: ColorTypes;
  overridePaddingHorizontal?: boolean;
  overridePaddingVertical?: boolean;
  centreAlligned?: boolean;
  style?: ViewStyle;
  avoidBackButton?: boolean;
  isLoading?: boolean[];
  hideHeader?: boolean;
  onPressMenuIcon?: () => void;
  onPressBellIcon?: () => void;
  onPressProfileIcon?: () => void;
  onPressBackArrow?: () => void;
  onScrollToEnd?: () => void;
  onPressLogoutButton?: () => void;
  showsVerticalScrollIndicator?: boolean;
  dashboard?: boolean;
  title?: string;
  icon?: ImageIconNames;
  titleTransition?: boolean;
}
const Layout: FC<LayoutPropsTypes> = ({
  children,
  focusedStack,
  backgroundColor,
  overridePaddingHorizontal,
  overridePaddingVertical,
  centreAlligned,
  avoidBackButton,
  style,
  hideHeader,
  // isLoading = [false],
  onPressMenuIcon,
  onPressBellIcon,
  onPressProfileIcon,
  onScrollToEnd,
  //   navigateBack,
  onPressBackArrow,
  onPressLogoutButton,
  showsVerticalScrollIndicator,
  dashboard,
  title,
  icon,
  titleTransition,
}) => {
  const {isLoading} = useAppSelector(state => state.auth);

  let backgroundStyle = backgroundColor
    ? colors[backgroundColor]
    : colors.backgroundColor;

  const container: ViewStyle = {
    paddingHorizontal: overridePaddingHorizontal ? 0 : '6.5%',
    paddingVertical: overridePaddingVertical ? 0 : '4%',
  };
  const viewContainer: ViewStyle = {
    justifyContent: centreAlligned ? 'center' : undefined,
    alignItems: centreAlligned ? 'center' : undefined,
    backgroundColor: backgroundStyle,
    flex: 1,
  };
  const padding: ViewStyle = {
    paddingHorizontal: 20,
    paddingVertical: 25,
  };
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      event => {
        setKeyboardOffset(event.endCoordinates.height);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => {
        setKeyboardOffset(0);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // const { panResponder } = usePanResponder();

  // const isLoadingFinal = Object.values(isLoading).some(value => value);
  const modifiedChildren = Children.map(children, child => {
    if (
      typeof child === 'undefined' ||
      child === null ||
      Number.isNaN(child) ||
      child === 'null' ||
      child === 'undefined' ||
      typeof child === null
    ) {
      return '';
    }
    return child;
  });

  const handleScroll = event => {
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const endOffsetY = contentSize.height - layoutMeasurement.height;

    // // Check if the user has scrolled to the end
    // if (endOffsetY > 0 && contentOffset.y >= endOffsetY) {
    //   setIsScrolled(true);
    //   onScrollToEnd && onScrollToEnd();
    // } else
    if (contentOffset.y === 0) {
      setIsScrolled(false);
    } else {
      setIsScrolled(true);
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={viewContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
        <StatusBar backgroundColor={colors.primaryLightColor} />
        <ShowToastMessage />
        {!hideHeader && (
          <Header
            avoidBackButton={avoidBackButton}
            dashboard={dashboard}
            onPressBellIcon={onPressBellIcon}
            onPressProfileIcon={onPressProfileIcon}
            onPressBackArrow={onPressBackArrow}
            onPressLogoutButton={onPressLogoutButton}
            title={title}
            onPressMenuIcon={onPressMenuIcon}
            icon={icon}
            scrollTransition={titleTransition}
            isScrolled={isScrolled}
          />
        )}
        <ScrollView
          nestedScrollEnabled
          contentContainerStyle={[container, style]}
          onScroll={handleScroll}
          showsVerticalScrollIndicator={showsVerticalScrollIndicator}>
          {modifiedChildren}
        </ScrollView>
        {isLoading && <Loading />}
      </KeyboardAvoidingView>
      {focusedStack && <BottomTab focusedStack={focusedStack} />}
    </>
  );
};

export default Layout;
