import React, {FC, useEffect, useState} from 'react';
import {RouteProp} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';
import {TouchableOpacity, View} from 'react-native';
import DocumentPicker from 'react-native-document-picker';

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
  resetDeleteUserPhotoResponse,
  resetUpdateUserPhotoResponse,
  resetUpdateUserResponse,
  saveUpdatedUserPhoto,
  updateUserDetails,
  updateUserPhoto,
} from '../../redux/features/authSlice';
import {FileObject, ItemType} from '../../config/types';
import LabelDropdown from '../../components/LabeledDropdown';
import {
  getAreas,
  getDistricts,
  getStates,
} from '../../redux/features/masterSlice';
import moment from 'moment';

type MyAccountNavigationProp = StackNavigationProp<
  MainStackParamList,
  'MyAccount'
>;
type MyAccountRouteProp = RouteProp<MainStackParamList, 'MyAccount'>;

interface MyAccountScreenProps {
  navigation: MyAccountNavigationProp;
  route: MyAccountRouteProp;
}

const selectImageFile = async (): Promise<FileObject> => {
  const result = await DocumentPicker.pick({
    type: [DocumentPicker.types.images],
  });
  return {
    uri: result[0].uri,
    name: result[0].name || 'image',
    type: result[0].type || 'image/jpg',
  };
};

const MyAccount: FC<MyAccountScreenProps> = ({navigation, route}) => {
  
  const [isChanged, setIsChanged] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [phoneNum, setPhoneNum] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [district, setDistrict] = useState<ItemType>();
  const [area, setArea] = useState<ItemType>();
  const [state, setState] = useState<ItemType>();

  const {
    userData,
    isAdmin,
    pageData,
    updateUserResponse,
    deleteUserPhotoResponse,
    updateUserPhotoResponse,
  } = useAppSelector(state => state.auth);

  const {user} = useAppSelector(state => state.users);

  const {states, allDistricts, allAreas} = useAppSelector(
    state => state.master,
  );


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

  useEffect(() => {
    dispatch(getUser(userData.id));
    dispatch(
      getStates({
        page: 0,
        size: 0,
        type: 'all',
      }),
    );
    dispatch(
      getAreas([
        {
          page: 0,
          size: 0,
          type: 'all',
        },
      ]),
    );
    dispatch(
      getDistricts([
        {
          page: 0,
          size: 0,
          type: 'all',
        },
      ]),
    );
  }, []);

  useEffect(() => {
    if (deleteUserPhotoResponse) {
      dispatch(getUser(userData.id));
      dispatch(resetDeleteUserPhotoResponse());
    }
  }, [deleteUserPhotoResponse]);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhoneNum(user.contactNumber);
      setEmail(user.email);
      setState({value: user.stateId?.toString(), label: user.state});
      setDistrict({value: user.districtId?.toString(), label: user.district});
      setArea({value: user.areaId?.toString(), label: user.area});
      user.userImageUrl && dispatch(saveUpdatedUserPhoto(user.userImageUrl));
    }
  }, [user]);

  const sendResetPasswordLink = () => {
    dispatch(forgotPassword(userData.userName));
  };

  const onPressEditPhoto = async () => {
    const file = await selectImageFile();
    dispatch(updateUserPhoto([userData.id, file, userData.userName]));
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

  useEffect(() => {
    if (updateUserPhotoResponse) {
      dispatch(getUser(userData.id));
      dispatch(resetUpdateUserPhotoResponse());
    }
  }, [updateUserPhotoResponse]);

  useEffect(() => {
    if (deleteUserPhotoResponse) {
      dispatch(getUser(userData.id));
      dispatch(resetDeleteUserPhotoResponse());
    }
  }, [deleteUserPhotoResponse]);

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
          dateOfBirth:
            moment(user?.dateOfBirth, 'YYYYMMDD').format('YYYY-MM-DD') || '',
          name,
          isAdmin:true,
          citizenship: user?.citizenship || '',
          roleId: user?.roleId || 0,
          loggedInUserName: userData.userName,
        },
      ]),
    );
  };



  const filteredDistricts = allDistricts?.dataList
    .filter(item => item.stateId?.toString() === state?.value)
    .map(ele => ({value: ele.districtId?.toString(), label: ele.districtName}));

  const filteredAreas = allAreas?.dataList
    .filter(item => item.districtId?.toString() === district?.value)
    .map(ele => ({value: ele.pinId?.toString(), label: ele.area}));

  const modules = pageData ? Object.keys(pageData).join(', ') : '';

  return (
    <>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        icon="profile_icon"
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
            image={user?.userImageUrl}
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
              disabled={Boolean(!user?.userImageUrl)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomWidth: 1,
                borderColor: colors.dangerColor,
                height: 20,
                opacity: Boolean(!user?.userImageUrl) ? 0.3 : undefined,
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
        <LabelDropdown
          label="State"
          defaultValue={state?.value || ''}
          searchable
          setIsChanged={setIsChanged}
          options={
            states?.dataList.map(item => ({
              value: item.stateId?.toString(),
              label: item.stateName,
            })) || []
          }
          onChangeItem={setState}
          placeHolder="Enter District"
          style={{marginVertical: 4}}
          mandatory
        />
        <LabelDropdown
          label="District"
          defaultValue={district?.value || ''}
          onChangeItem={setDistrict}
          setIsChanged={setIsChanged}
          searchable
          options={filteredDistricts || []}
          placeHolder="Enter District"
          style={{marginVertical: 4}}
          mandatory
        />
        <LabelDropdown
          label="Area"
          defaultValue={area?.value || ''}
          onChangeItem={setArea}
          setIsChanged={setIsChanged}
          options={filteredAreas || []}
          placeHolder="Enter Area"
          style={{marginVertical: 4}}
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
        <View style={{marginVertical: 4}}>
          <Text
            color="blackColor"
            fontVariant="bold"
            size='small3'
            style={{fontWeight: '700'}}>
            Modules
          </Text>
          <Text
            style={{
              backgroundColor: '#FDF0E3',
              borderWidth: 1,
              borderColor: '#ABB4BD',
              borderRadius: 8,
              padding: 10,
              marginTop: 3,
            }}
            size="small3">
            {modules}
          </Text>
        </View>
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
            state?.value &&
            district?.value &&
            area?.value,
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
