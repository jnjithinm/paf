import {FC, useState} from 'react';
import {TextInput, View} from 'react-native';

import {FlowDetailItem} from '../../../redux/features/flowsSlice';
import Button from '../../../components/Button';
import LabelDropdown from '../../../components/LabeledDropdown';
import {normaliseDesigns} from '../../../utils/helpers/responsiveHelpers';
import {ItemType} from '../../../config/types';
import colors from '../../../config/colors';
import {useAppDispatch} from '../../../redux/store';
import {
  printFormResponses,
  setFormsShowMessage,
} from '../../../redux/features/formsSlice';
import {downloadFile} from '../../../utils/functions/apiUtils';

export type PrintResponsesType = 'Individual Wise' | 'Question Wise';

type RenderPrintResponsesModalContentTypes = {
  flowDetailItem: FlowDetailItem;
  printResponsesType: PrintResponsesType;
  ids: number[];
  onClosePrintResponsesModal: () => void;
};
export const RenderPrintResponsesModalContent: FC<
  RenderPrintResponsesModalContentTypes
> = ({flowDetailItem, ids, printResponsesType, onClosePrintResponsesModal}) => {
  const [selectedDestination, setSelectedDestination] = useState<ItemType>();
  const [selectedPagingMethod, setSelectedPagingMethod] = useState<ItemType>();
  const [selectedLayout, setSelectedLayout] = useState<ItemType>();
  const [pagesCount, setPagesCount] = useState<string>();

  const dispatch = useAppDispatch();

  const handleSave = async () => {
    console.log('aaa');
    const downloadStatus = await downloadFile(printResponsesType, {
      flowId: flowDetailItem.flowId,
      formId: flowDetailItem.formId,
      ids,
    });
    if (downloadStatus) {
      dispatch(
        setFormsShowMessage({
          message: 'Download Successful',
          status: 'Success',
        }),
      );
      onClosePrintResponsesModal();
    } else {
      dispatch(
        setFormsShowMessage({message: 'Download Failed', status: 'Error'}),
      );
    }
  };

  const handlePrint = () => {};
  return (
    <View style={{paddingHorizontal: 5}}>
      <LabelDropdown
        options={[
          {value: 'saveAsPDF', label: 'Save As PDF'},
          {value: 'hpPrinter', label: 'HP Printer'},
        ]}
        defaultValue={selectedDestination?.value || ''}
        setSelectedItem={setSelectedDestination}
        label="Destination"
        placeHolder="Select"
      />

      <LabelDropdown
        options={[
          {value: 'allPages', label: 'All Pages'},
          {value: 'customised', label: 'Customised'},
        ]}
        setSelectedItem={setSelectedPagingMethod}
        defaultValue={selectedPagingMethod?.value || ''}
        label="Pages"
        placeHolder="Select"
      />
      {selectedPagingMethod?.value === 'customised' && (
        <TextInput
          style={{
            width: '100%',
            borderWidth: 1,
            borderColor: '#CBD2D9',
            borderRadius: 8,
            paddingHorizontal: 10,
            color: colors.blackColor,
          }}
          keyboardType="number-pad"
          placeholder="e.g. 1-5,8, 11-13"
          placeholderTextColor={'#CBD2D9'}
          onChangeText={text => {
            setPagesCount(text);
          }}
        />
      )}
      <LabelDropdown
        options={[
          {value: 'portrait', label: 'Portrait'},
          {value: 'landscape', label: 'Landscape'},
        ]}
        defaultValue={selectedLayout?.value || ''}
        setSelectedItem={setSelectedLayout}
        placeHolder="Select"
        label="Layout"
      />
      <Button
        text="Save"
        active={Boolean(
          selectedDestination?.value &&
            (selectedPagingMethod?.value !== 'customised' ||
              (selectedPagingMethod?.value == 'customised' && pagesCount)) &&
            selectedLayout?.value,
        )}
        onPress={handleSave}
        style={{marginTop: normaliseDesigns(75)}}
      />
    </View>
  );
};
