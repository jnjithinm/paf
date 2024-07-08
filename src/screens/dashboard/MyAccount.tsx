import React, {FC, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {
  ScrollView,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {MainStackParamList} from '../../navigation/MainStack';
import TextInput from '../../components/TextInput';
import useValidation from '../../utils/hooks/useValidation';
import {RenderProfileIcon} from './TeacherDashboard';
import colors from '../../config/colors';
import FooterWithButtons from '../../components/FooterWithButtons';
import {useAppSelector} from '../../redux/store';
import Icon from '../../components/Icon';

type MyAccountNavigationProp = StackNavigationProp<
  MainStackParamList,
  'MyAccount'
>;
type MyAccountRouteProp = RouteProp<MainStackParamList, 'MyAccount'>;

interface MyAccountScreenProps {
  navigation: MyAccountNavigationProp;
  route: MyAccountRouteProp;
}

const MyAccount: FC<MyAccountScreenProps> = ({navigation, route}) => {
  const [name, setName] = useState<string>('');
  const [phoneNum, setPhoneNum] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [area, setArea] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [modules, setModules] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('12345678');
  const [userType, setUserType] = useState<string>('');
  const [isShowModal, setIsShowModal] = useState<boolean>(false);
  const {userData} = useAppSelector(state => state.auth);

  const {validateField} = useValidation();

  const userNameErrorMessage = validateField({
    fieldName: 'Name',
    value: name,
  });

  const phoneNumberErrorMessage = validateField({
    fieldName: 'Phone Number',
    value: phoneNum,
  });

  const emailErrorMessage = validateField({
    fieldName: 'Email ID',
    value: email,
  });

  const districtErrorMessage = validateField({
    fieldName: 'District',
    value: district,
  });

  const areaErrorMessage = validateField({
    fieldName: 'Area',
    value: area,
  });

  const onPressSendButton = () => {
    setIsShowModal(true);
  };

  const onPressOpenEmail = () => {
    navigation.navigate('CreateNewPassword');
  };

  const sendResetPasswordLink = () => {
    // Logic to send reset password link
    console.log('Reset password link sent');
  };

  const handleEditPhoto = () => {};
  const handleDeletPhoto = () => {};

  return (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <Layout
          overridePaddingHorizontal
          overridePaddingVertical
          style={{paddingHorizontal: 15}}
          icon="profile_icon"
          titleTransition>
          <Text
            size="body4"
            fontVariant="bold"
            style={{marginBottom: 15, marginTop: 30}}>
            My Account
          </Text>
          <View style={{flexDirection: 'row', alignItems: 'center',marginBottom:10}}>
            <RenderProfileIcon
              size={50}
              image={userData.userImageUrl || userData.userImage}
              name={''}
            />
            <View style={{alignItems: 'center', marginLeft: 10}}>
              <TouchableOpacity
                onPress={handleEditPhoto}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginRight: 20,
                }}>
                <Icon name="edit_red" />
                <Text style={{marginLeft: 5,fontSize:13}}>Edit Photo</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: '100%',
                  borderBottomWidth: 1,
                  paddingVertical: 2,
                  marginBottom:5
                }}></View>
              <TouchableOpacity
                onPress={handleDeletPhoto}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon name="trash_red" />
                <Text style={{marginLeft: 5, color: 'red',fontSize:13}}>Delete Photo</Text>
              </TouchableOpacity>
              <View
                style={{
                  width: '100%',
                  borderBottomWidth: 1,
                  paddingVertical: 2,
                }}></View>
            </View>
          </View>
          <TextInput
            label="Name"
            value={name}
            setValue={setName}
            errorMessage={userNameErrorMessage}
            placeholder="Enter Name"
            autoCapitalize="none"
            mandatory
          />
          <TextInput
            label="Phone No."
            value={phoneNum}
            setValue={setPhoneNum}
            errorMessage={phoneNumberErrorMessage}
            placeholder="Enter Phone No."
            autoCapitalize="none"
            mandatory
          />
          <TextInput
            label="Email"
            value={email}
            setValue={setEmail}
            placeholder="Enter Email"
            errorMessage={emailErrorMessage}
            autoCapitalize="none"
            mandatory
          />
          <TextInput
            label="District"
            value={district}
            setValue={setDistrict}
            errorMessage={districtErrorMessage}
            placeholder="Enter District"
            autoCapitalize="none"
            mandatory
          />
          <TextInput
            label="Area"
            value={area}
            errorMessage={areaErrorMessage}
            setValue={setArea}
            placeholder="Enter Area"
            autoCapitalize="none"
          />
          <View
            style={{
              backgroundColor: 'lightgray',
              width: '100%',
              height: 1,
              marginVertical: 20,
            }}></View>
          <TextInput
            label="Role"
            value={userData.role}
            setValue={setRole}
            placeholder="Enter Role"
            autoCapitalize="none"
            editable={false}
          />
          <TextInput
            label="Modules"
            value={modules}
            setValue={setModules}
            placeholder="Enter Modules"
            autoCapitalize="none"
            editable={false}
          />
          <TextInput
            label="Username"
            value={userData.userName}
            setValue={setUserName}
            placeholder="Enter Username"
            autoCapitalize="none"
            mandatory
            editable={false}
          />
          <TextInput
            label="Password"
            value={password}
            setValue={setPassword}
            placeholder="Enter Password"
            autoCapitalize="none"
            mandatory
            secureTextEntry={true}
            editable={false}
          />
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginTop: 5,
            }}>
            <TouchableOpacity onPress={sendResetPasswordLink}>
              <Text
                style={{
                  color: colors.blackColor,
                  fontSize: 14,
                  textDecorationLine: 'underline',
                  lineHeight: 16,
                }}>
                Send reset password link
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            label="User Type"
            value={userData.roleType}
            setValue={setUserType}
            placeholder="Enter User Type"
            autoCapitalize="none"
            editable={false}
          />
        </Layout>
      </ScrollView>
      <FooterWithButtons
        proceedButtonText={'Save'}
        isActiveProceedButton
        cancelButtonText={'Cancel'}
        style={{marginVertical: 10}}
      />
    </KeyboardAvoidingView>
  );
};

export default MyAccount;
