import React, {FC, ReactNode, useEffect, useState} from 'react';
import {StyleSheet} from 'react-native';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {MainStackParamList} from '../../navigation/MainStack';
import TextInput from '../../components/TextInput';
import useValidation from '../../utils/hooks/useValidation';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import {TouchableOpacity, View} from 'react-native';
import Image from '../../components/Image';
import colors from '../../config/colors';
import {normaliseDesigns} from '../../utils/helpers/responsiveHelpers';
import Icon from '../../components/Icon';
import {Drawer} from 'react-native-drawer-layout';
import DrawerContent from '../../components/DrawerContent';

type FAQNavigationProp = StackNavigationProp<MainStackParamList, 'FAQ'>;
type FAQRouteProp = RouteProp<MainStackParamList, 'FAQ'>;

interface FAQScreenProps {
  navigation: FAQNavigationProp;
  route: FAQRouteProp;
}

const styles = StyleSheet.create({
  faqText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#333',
    marginBottom: 8,
  },
});

type FAQContent = {
  title: string;
  content: ReactNode;
};

const faqContent: FAQContent[] = [
  {
    title: 'How do I log in for the first time or re-login when logged out?',
    content: (
      <View>
        <Text style={styles.faqText}>
          Step 1: Enter your username in the placeholder/textbox that says
          ‘Enter your username’.
        </Text>
        <Text style={styles.faqText}>
          Step 2: Enter your password in the placeholder/textbox that says
          ‘Enter your password’.
        </Text>
        <Text style={styles.faqText}>Step 3: Click Log In to continue.</Text>
      </View>
    ),
  },
  {
    title: 'Q. What to do when you forget your password?',
    content: (
      <View>
        <Text style={styles.faqText}>
          Step 1: Click Forgot Password on the login page. Step 2: You will be
          redirected to the Password Recovery page. Step 3: Enter username in
          the placeholder/textbox that says ‘Enter your Username’. Step 4: Press
          Continue. Step 5: You will receive a reset password link on your
          registered email id. Click the link and it will redirect to the Reset
          Password page. Step 6: Enter your new password in the Password
          placeholder/textbox that says ‘Enter your Password’. Step 7: Re-type
          the password in the Confirm Password placeholder/textbox and ensure
          that both the passwords are the same. Step 8: Press Continue.
        </Text>
      </View>
    ),
  },
  {
    title:
      'Q. Why does the web browser show a white screen or fail to load the page?',
    content: (
      <View>
        <Text style={styles.faqText}>
          A white screen or loading issue appears due to slow Internet speed or
          no Internet. Note: Try refreshing the page with the keyboard buttons
          Ctrl + Shift + R.
        </Text>
      </View>
    ),
  },
  {
    title: 'Q. How to change your password on the Dashboard page?',
    content: (
      <View>
        <Text style={styles.faqText}>
          Step 1: Click the Profile drop-down arrow. Step 2: Click the Change
          password option. Step 3: Enter and confirm your new password. Step 4:
          Click Continue.
        </Text>
      </View>
    ),
  },
  {
    title: 'Q. What’s on the Dashboard screen?',
    content: (
      <View>
        <Text style={styles.faqText}>
          The Dashboard has two sections i.e. the left navigation menu and the
          main section. The left navigation menu has the following options:
        </Text>
        <Text style={styles.faqText}>
          • User Management with sub-menus i.e. Users, Users Groups, Roles & App
          Access.
        </Text>
        <Text style={styles.faqText}>
          • Location Management with sub menus i.e State, District, Area &
          Schools.
        </Text>
        <Text style={styles.faqText}>
          • Teacher Evaluation with sub menus i.e Evaluation Flows & Evaluation
          Rubrics.
        </Text>
        <Text style={styles.faqText}>
          • Analytics with sub-menus i.e. Usage Analytics.
        </Text>
        <Text style={styles.faqText}>
          • Product Analytics with sub-menus i.e. Classroom Resources, Learning
          Management System, Teacher Evaluation and Forms.
        </Text>
        <Text style={styles.faqText}>
          • Calendar with sub-menus i.e. Create New Events & Share Calendar.
        </Text>
        <Text style={styles.faqText}>
          • Icon to download the Pehlay Akshar App. The main section will have
          the sections from the left navigation menu.
        </Text>
      </View>
    ),
  },
  {
    title: 'Q. How to download the PehlayAkshar App?',
    content: (
      <View>
        <Text style={styles.faqText}>
          Step 1: Navigate to the left menu bar at the bottom you will find the
          logo to download the Pehlay Akshar App.
        </Text>
        <Text style={styles.faqText}>
          Step 2: Click the logo to download the Pehlay Akshar App from Play
          Store for Android users and App Store for iOS users.
        </Text>
      </View>
    ),
  },
  {
    title: 'Q. How to upload a photo in the My Account section after login?',
    content: (
      <View>
        <Text style={styles.faqText}>
          Step 1: Click the profile drop-down arrow on the right corner of the
          Dashboard screen. Step 2: Click the My Account option. You will see an
          upload button on the My Account screen.
        </Text>
        <Text style={styles.faqText}>
          Step 3: Click the Upload button and choose a picture of your choice
          from the computer.
        </Text>
        <Text style={styles.faqText}>
          Step 4: A dialog box screen for choosing a picture will appear. Choose
          a picture and click the Open button.
        </Text>
        <Text style={styles.faqText}>
          Step 5: Crop the selected picture and click the Upload button.
        </Text>
        <Text style={styles.faqText}>
          Step 6: Click the Save button to set your profile picture in your
          login.
        </Text>
      </View>
    ),
  },
  {
    title: 'Q. How to Logout from your account?',
    content: (
      <View>
        <Text style={styles.faqText}>
          Click the profile drop-down arrow and select Logout.
        </Text>
      </View>
    ),
  },
];

type FAQTileTypes = {
  title: string;
  isSelected: boolean;
  index: number;
  content: ReactNode;
  onSelect: (index: number) => void;
};
const FAQTile: FC<FAQTileTypes> = ({
  title,
  isSelected,
  content,
  onSelect,
  index,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onSelect(index);
      }}
      style={{
        borderWidth: 1,
        borderColor: '#F4C24A',
        marginVertical: 8,
        borderRadius: 10,
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isSelected ? '#FCEBC5' : colors.backgroundColor,
          width: '100%',
          borderRadius: 10,
          padding: 8,
        }}>
        <Text size="small3" fontVariant="bold" style={{width: '90%'}}>
          {title}
        </Text>
        <Icon
          name="chevron_up_black_icon"
          style={{
            transform: [{rotate: isSelected ? '0deg' : '180deg'}],
            //   alignSelf: isSelected ? 'flex-end' : undefined,
          }}
        />
      </View>
      {isSelected && <View style={{padding: 8}}>{content}</View>}
    </TouchableOpacity>
  );
};

const FAQ: FC<FAQScreenProps> = ({navigation, route}) => {
  const [selectedIndex, setSelectedIndex] = useState<number>();
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => <DrawerContent closeDrawer={closeDrawer} />}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        onPressMenuIcon={()=>{setIsDrawerOpen(true)}}
        dashboard
        avoidBackButton>
        <Text
          size="body4"
          fontVariant="bold"
          style={{marginBottom: 10, marginTop: 30}}>
          FAQ's
        </Text>
        <View style={{marginVertical: 20}}>
          {faqContent.map((item, index) => (
            <FAQTile
              onSelect={index => {
                setSelectedIndex(index);
              }}
              title={item.title}
              content={item.content}
              isSelected={selectedIndex === index}
              index={index}
              key={index}
            />
          ))}
        </View>
        <Button onPress={()=>{}} active text='Contact us' style={{width:'40%',alignSelf:'center',marginVertical:10}}  />
      </Layout>
    </Drawer>
  );
};
export default FAQ;
