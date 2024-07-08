import React, {FC, useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TouchableOpacity, View} from 'react-native';

import Layout from '../../components/Layout';
import Text from '../../components/Text';
import {MainStackParamList} from '../../navigation/MainStack';
import TextInput from '../../components/TextInput';
import useValidation from '../../utils/hooks/useValidation';
import {RenderProfileIcon} from './TeacherDashboard';
import colors from '../../config/colors';
import FooterWithButtons from '../../components/FooterWithButtons';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Icon from '../../components/Icon';
import {getUser} from '../../redux/features/usersSlice';
import {
  deleteUserPhoto,
  forgotPassword,
  resetUpdateUserResponse,
  updateUserDetails,
} from '../../redux/features/authSlice';

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
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phoneNum, setPhoneNum] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [area, setArea] = useState<string>('');

  const {userData, isAdmin, updateUserResponse} = useAppSelector(
    state => state.auth,
  );
  const {user} = useAppSelector(state => state.users);
  const {validateField} = useValidation();

  const dispatch = useAppDispatch();

  const nameErrorMessage = validateField({
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

  useEffect(() => {
    dispatch(getUser(userData.id));
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhoneNum(user.contactNumber);
      setEmail(user.email);
      setDistrict(user.district);
      setArea(user.area);
    }
  }, [user]);

  const sendResetPasswordLink = () => {
    dispatch(forgotPassword(userData.userName));
  };

  const onPressEditPhoto = () => {
    // dispatch()
  };
  const onPressDeletePhoto = () => {
    dispatch(deleteUserPhoto([userData.id, userData.userName]));
  };

  useEffect(() => {
    if (updateUserResponse) {
      dispatch(resetUpdateUserResponse());
      isAdmin
        ? navigation.navigate('AdminDashboard')
        : navigation.navigate('TeacherDashboard');
    }
  }, [updateUserResponse]);

  const onPressSave = () => {
    dispatch(
      updateUserDetails([
        userData.id,
        {
          userType: user?.userType || '',
          email,
          contactNumber: phoneNum,
          districtId: user?.districtId || 0,
          schoolId: user?.schoolId || 0,
          status: user?.status || false,
          stateId: user?.stateId || 0,
          area: user?.areaId || 0,
          dateOfBirth: user?.dateOfBirth || '',
          name,
          citizenship: user?.citizenship || '',
          grade: user?.school || '',
          isAdmin,
          roleId: user?.roleId || 0,
          moduleId: user?.stateId || 0,
          loggedInUserName: userData.userName,
        },
      ]),
    );
  };

  console.log(
    'is,i',
    isChanged,
    nameErrorMessage,
    emailErrorMessage,
    districtErrorMessage,
  );

  return (
    <>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        icon="profile_icon"
        // transform={}
        title="My Account"
        titleTransition>
        <Text
          size="body4"
          fontVariant="bold"
          style={{marginBottom: 15, marginTop: 30}}>
          My Account
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
          }}>
          <RenderProfileIcon
            size={60}
            image={userData.userImageUrl || userData.userImage}
            name={userData.name}
          />
          <View style={{marginLeft: 10}}>
            <TouchableOpacity
              onPress={onPressEditPhoto}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: colors.blackColor,
                height: 20,
              }}>
              <Icon name="edit_icon_red" />
              <Text style={{marginLeft: 5}} size="small1">
                Edit Photo
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressDeletePhoto}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: colors.dangerColor,
                height: 20,
              }}>
              <Icon name="trash_icon_red" />
              <Text style={{marginLeft: 5}} color="dangerColor" size="small1">
                Delete Photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TextInput
          label="Name"
          value={name}
          setValue={setName}
          errorMessage={nameErrorMessage}
          placeholder="Enter Name"
          style={{marginVertical: 2}}
          onChange={() => {
            setIsChanged(true);
          }}
          autoCapitalize="words"
          mandatory
        />
        <TextInput
          label="Phone No."
          value={phoneNum}
          setValue={setPhoneNum}
          errorMessage={phoneNumberErrorMessage}
          placeholder="Enter Phone No."
          keyboardType="number-pad"
          maxLength={10}
          style={{marginVertical: 2}}
          onChange={() => {
            setIsChanged(true);
          }}
          mandatory
        />
        <TextInput
          label="Email"
          value={email}
          setValue={setEmail}
          placeholder="Enter Email"
          errorMessage={emailErrorMessage}
          autoCapitalize="none"
          keyboardType="email-address"
          style={{marginVertical: 2}}
          onChange={() => {
            setIsChanged(true);
          }}
          mandatory
        />
        <TextInput
          label="District"
          value={district}
          setValue={setDistrict}
          errorMessage={districtErrorMessage}
          placeholder="Enter District"
          style={{marginVertical: 2}}
          onChange={() => {
            setIsChanged(true);
          }}
          autoCapitalize="words"
          mandatory
        />
        <TextInput
          label="Area"
          value={area}
          errorMessage={areaErrorMessage}
          setValue={setArea}
          placeholder="Enter Area"
          style={{marginVertical: 2}}
          onChange={() => {
            setIsChanged(true);
          }}
          autoCapitalize="words"
        />
        <View
          style={{
            backgroundColor: 'lightgray',
            width: '100%',
            height: 1,
            marginVertical: 10,
          }}
        />
        <TextInput
          label="Role"
          value={userData.role}
          placeholder="Enter Role"
          autoCapitalize="none"
          editable={false}
        />
        <TextInput
          label="Modules"
          value={userData.module?.moduleName || ''}
          placeholder="Enter Modules"
          autoCapitalize="none"
          editable={false}
        />
        <TextInput
          label="Username"
          value={userData.userName}
          placeholder="Enter Username"
          autoCapitalize="none"
          mandatory
          editable={false}
        />
        <TextInput
          label="Password"
          value={'12313432'}
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
                fontSize: 12,
                textDecorationLine: 'underline',
                lineHeight: 16,
                bottom: 4,
              }}>
              Send reset password link
            </Text>
          </TouchableOpacity>
        </View>
        <TextInput
          label="User Type"
          value={userData.roleType || ''}
          placeholder="Enter User Type"
          autoCapitalize="none"
          editable={false}
          style={{marginBottom: 20}}
        />
      </Layout>

      <FooterWithButtons
        proceedButtonText={'Save'}
        isActiveProceedButton={Boolean(
          isChanged &&
            !nameErrorMessage &&
            !emailErrorMessage &&
            !phoneNumberErrorMessage &&
            !districtErrorMessage &&
            !areaErrorMessage,
        )}
        cancelButtonText={'Cancel'}
        style={{elevation: 10}}
        onPressProceedButton={onPressSave}
        onPressCancelButton={() => {
          isAdmin
            ? navigation.navigate('AdminDashboard')
            : navigation.navigate('TeacherDashboard');
        }}
      />
    </>
  );
};

export default MyAccount;
