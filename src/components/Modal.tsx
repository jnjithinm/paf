import React, {FC, ReactNode,JSX} from 'react';
import {
  Modal as RNModal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

import Text from './Text';
import Icon from './Icon';
import {normaliseDesigns} from '../utils/helpers/responsiveHelpers';
import colors from '../config/colors';

type RenderButtonTypes = {
  type: ButtonTypes;
  onClose: () => void;
  onProceed: () => void;
};

type ButtonTypes = 'Cancel' | 'OK';

const buttons: ButtonTypes[] = ['Cancel', 'OK'];

const RenderButton: FC<RenderButtonTypes> = ({type, onClose, onProceed}) => (
  <TouchableOpacity
    style={{
      width: normaliseDesigns(70),
      height: normaliseDesigns(35),
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 10,
    }}
    onPress={() => {
      type === 'OK' ? onProceed() : onClose();
    }}>
    <Text color="backgroundColor" fontVariant="medium">
      {type}
    </Text>
  </TouchableOpacity>
);

interface ModalPropsTypes {
  onProceed: () => void;
  onClose: () => void;
  isVisible: boolean;
  title?: string;
  content?: JSX.Element;
  Close?: string;
  isOKCancelButtonsNeeded?: boolean;
  closeButton?: boolean;
  renderButton?: ReactNode;
  contentStyle?: ViewStyle;
  containerStyle?: ViewStyle;
}

const Modal: FC<ModalPropsTypes> = ({
  onProceed,
  onClose,
  isVisible,
  title,
  content,
  isOKCancelButtonsNeeded,
  closeButton,
  renderButton,
  contentStyle,
  containerStyle,
}) => {
  return (
    <RNModal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalOverlay} />
      <View style={[styles.modalContainer, {...containerStyle}]}>
        <View style={[styles.modalContent, {...contentStyle}]}>
          <View style={styles.header}>
            <Text
              color="blackColor"
              style={{justifyContent: 'flex-start'}}
              fontVariant='bold'
              size="body1">
              {title}
            </Text>

            {closeButton && (
              <TouchableOpacity
                onPress={() => onClose()}
                style={{
                  justifyContent: 'flex-end',
                  width: normaliseDesigns(20),
                  height: normaliseDesigns(20),
                }}>
                <Icon name="cross_icon_thin" width={10} height={10} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView contentContainerStyle={styles.contentContainer}>
            {content}
            {renderButton}
            {isOKCancelButtonsNeeded && (
              <View style={styles.buttonsContainer}>
                {buttons.map(item => (
                  <RenderButton
                    type={item}
                    key={item}
                    onClose={onClose}
                    onProceed={onProceed}
                  />
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </RNModal>
  );
};

export default Modal;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    flex: 1,
    // justifyContent: 'center',
    alignItems: 'center',
    justifyContent: 'flex-end',
    // marginVertical: 80,
  },
  modalContent: {
    backgroundColor: colors.backgroundColor,
    borderRadius: 20,
    width: '80%',
  },
  header: {
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center'
  },
  contentContainer: {
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  buttonsContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    marginTop: 20,
    right: 20,
  },
});
