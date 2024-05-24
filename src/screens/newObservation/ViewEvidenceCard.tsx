import React, { FC, useEffect, useState } from 'react';
import {
    FlatList,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View,
    ViewStyle,
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FONT_SIZES, FONT_VARIANT } from '../../config/themes';
import Layout from '../../components/Layout';
import TextInput from '../../components/TextInput';
import { ReportsTabBarStackParamList } from '../../navigation/ReportsTabStack';
import Text from '../../components/Text';
import Image from '../../components/Image';
import colors from '../../config/colors';
import { normaliseDesigns } from '../../utils/helpers/responsiveHelpers';
import FileUpload from '../../components/FileUpload';
import Icon from '../../components/Icon';
import { navigate } from '../../utils/helpers/navigationHelpers';
import { NewObservationStackParamList } from '../../navigation/NewObservationStack';
import FooterWithButtons from '../../components/FooterWithButtons';
import FilterComponent from '../../components/FilterComponent';
import EvidenceCard from '../../components/EvidenceCard';

type ViewEvidenceCardNavigationProp = StackNavigationProp<
    NewObservationStackParamList,
    'ViewEvidenceCard'
>;
type ViewEvidenceCardRouteProp = RouteProp<
    NewObservationStackParamList,
    'ViewEvidenceCard'
>;

interface ViewEvidenceCardScreenProps {
    navigation: ViewEvidenceCardNavigationProp;
    route: ViewEvidenceCardRouteProp;
}


const ViewEvidenceCard: FC<ViewEvidenceCardScreenProps> = ({
    navigation,
    route,
}) => {
    const [evidenceCardData, setEvidenceCardData] = useState<any[]>([]);
    const [feedbackNote, setFeedbackNote] = useState('');
    const [feedbackNoteEnable, setFeedbackNoteEnable] = useState<boolean>(false);

    const EvidenceCardDetails = [
        {
            title: 'Evidence Card 1',
            description: 'Teacher is able to manage all students in class very well.',
            voiceClipCount: 10,
            videoClipCount: 30,
            noteCount: 5,
            photoCount: 4
        },
        {
            title: 'Evidence Card 2',
            description: 'Teacher is able to manage all students in class very well.',
            voiceClipCount: 10,
            videoClipCount: 20,
            noteCount: 15,
            photoCount: 14
        },]

    useEffect(() => {
        setEvidenceCardData(EvidenceCardDetails);
    }, []);
    return (
        <KeyboardAvoidingView
            style={{ flex: 1, }} // Ensure the component takes up the whole screen
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Adjust behavior based on platform
        >
            <Layout
                overridePaddingHorizontal
                overridePaddingVertical
                style={{ paddingHorizontal: 15, paddingVertical: 0 }}
                icon="reports_icon"
                title="New Observation">
                <View style={{ marginVertical: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Icon name={'evidence_card_sample_image'} />
                        <View style={{ flex: 1, justifyContent: 'center', marginLeft: 10 }}>
                            <View>
                                <Text fontVariant="bold" size="body2">
                                    Isha Dani (Maths)
                                </Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                {Array.from({ length: 4 }, () => '').map(item => (
                                    <Icon name="star_icon" />
                                ))}
                                <Icon name="star_unfilled_icon" />
                                <View style={{ height: 10, backgroundColor: '#E4E7EB', width: 1, marginHorizontal: 5 }} />
                                <Text style={{ color: '#4E565F' }} size='small3'>3.2/5</Text>
                            </View>

                        </View>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 10 }}>
                        <Image name='evidence_icon' />
                        <Text style={{ alignSelf: 'center', fontFamily: FONT_VARIANT.bold, fontSize: FONT_SIZES.body1 }}>
                            {`Evidence cards ${evidenceCardData.length}`}</Text>
                    </View>

                    <FlatList
                        data={evidenceCardData}
                        extraData={evidenceCardData}
                        style={{ marginVertical: 10 }}
                        renderItem={({ item }) => (
                            <EvidenceCard
                                title={item?.title}
                                description={item?.description}
                                voiceClipCount={item?.voiceClipCount}
                                videoClipCount={item?.videoClipCount}
                                noteCount={item?.noteCount}
                                photoCount={item?.photoCount}
                            />
                        )}
                    />

                    <TouchableOpacity
                        onPress={() => { setFeedbackNoteEnable(!feedbackNoteEnable) }}
                        // disabled={!isActive}
                        style={{
                            alignSelf: 'flex-start',
                            borderBottomColor:
                                //   isActive ? 
                                colors.blackColor,
                            //   : '#CBD2D9',
                            borderBottomWidth: 1,
                        }}>
                        <Text style={{
                            color:
                                // isActive ? 
                                colors.blackColor,
                            // : '#CBD2D9'
                        }}>+ Add feedback note</Text>
                    </TouchableOpacity>

                    {feedbackNoteEnable && <View style={{ marginTop: 15 , }}>
                        <TextInput
                            label=""
                            value={feedbackNote}
                            setValue={setFeedbackNote}
                            multiline
                            // style={{borderColor: '#CBD2D9', borderWidth: 1, borderRadius: 10}}
                            maxLength={200}
                        />
                        <Text style={{ alignSelf: 'flex-end', fontFamily: FONT_VARIANT.regular, fontSize: FONT_SIZES.small2,  }}>{`${feedbackNote.length}/200`}</Text>
                    </View>}


                </View>
            </Layout>
            <FooterWithButtons
                onPressProceedButton={() => { navigate('NewObservationStack', { screen: 'ViewEvidenceCard' }) }}
                proceedButtonText={'Submit'}
                isActiveProceedButton={true}
                cancelButtonText={'Save as draft'}
                onPressCancelButton={() => { }}
                style={{}}
            />
        </KeyboardAvoidingView>
    );
};
export default ViewEvidenceCard;

const styles = StyleSheet.create({});
