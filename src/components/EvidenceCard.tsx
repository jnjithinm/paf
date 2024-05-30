import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon, {IconTypes} from '../components/Icon';
import {FONT_SIZES, FONT_VARIANT} from '../config/themes';
import Image from '../components/Image';
import colors from '../config/colors';

// Define the types for the icon prop

type RenderEvidenceCardMultimediaCountsTypes = {
  icon: IconTypes;
  count: number;
  lastCount?: boolean;
  photoCount?: number;
  voiceClipCount?: number;
  videoClipCount?: number;
  noteCount?: number;
};

const RenderEvidenceCardMultimediaCounts: React.FC<
  RenderEvidenceCardMultimediaCountsTypes
> = ({
  icon,
  count,
  lastCount,
  photoCount,
  voiceClipCount,
  videoClipCount,
  noteCount,
}) => (
  <View style={styles.multimediaContainer}>
    <Icon name={icon} />
    <Text style={styles.countText}>{count}</Text>
    {!lastCount && <View style={styles.separator} />}
  </View>
);

type EvidenceCardTypes = {
  title: string;
  onPressEvidenceCard:()=>void;
  description: string;
  photoCount?: number;
  voiceClipCount?: number;
  videoClipCount?: number;
  noteCount?: number;
};

const EvidenceCard: React.FC<EvidenceCardTypes> = ({
  title,
  onPressEvidenceCard,
  description,
  photoCount,
  voiceClipCount,
  videoClipCount,
  noteCount,
}) => (
  <TouchableOpacity style={styles.cardContainer} onPress={onPressEvidenceCard}>
    <Text style={styles.titleText}>{title}</Text>
    <Text style={styles.descriptionText}>{description}</Text>
    <View style={styles.multimediaCountsContainer}>
      <RenderEvidenceCardMultimediaCounts
        icon="evidence_card_photo_icon"
        count={photoCount || 0}
      />
      <RenderEvidenceCardMultimediaCounts
        icon="evidence_card_voice_clip_icon"
        count={voiceClipCount || 0}
      />
      <RenderEvidenceCardMultimediaCounts
        icon="evidence_card_video_clip_icon"
        count={videoClipCount || 0}
      />
      <RenderEvidenceCardMultimediaCounts
        icon="evidence_card_note_icon"
        count={noteCount || 0}
        lastCount
      />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cardContainer: {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#F4C24A',
    padding: 5,
    borderRadius: 6,
  },
  titleText: {
    fontFamily: FONT_VARIANT.bold,
    color: colors.blackColor,
    fontSize: FONT_SIZES.small3, // Assuming 'small3' is equivalent to fontSize 12
  },
  descriptionText: {
    fontFamily: FONT_VARIANT.regular,
    color: colors.blackColor,
    fontSize: FONT_SIZES.small2,
    marginTop: 5,
  },
  multimediaCountsContainer: {
    flexDirection: 'row',
    marginTop: 6,
  },
  multimediaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countText: {
    marginLeft: 3,
    fontSize: FONT_SIZES.small3,
    color: colors.blackColor,

    // fontSize: 12, // Assuming 'small3' is equivalent to fontSize 12
  },
  separator: {
    height: 10,
    width: 1,
    backgroundColor: '#E4E7EB',
    marginHorizontal: 5,
  },
});

export default EvidenceCard;
