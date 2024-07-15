import {Platform} from 'react-native';
import {getToken} from './localStorageOperations';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {PrintFormResponsesRequest} from '../../redux/features/formsSlice';
import {PrintResponsesType} from '../../screens/flowsAndForms/modalContentRenderals/printResponsesModalContent';
import endPoints from '../../config/endPoints';

export const logRequest = (method: string, url: string, formData: string) => {
  console.log(`[API] Request: ${method.toUpperCase()} ${url}`);
  console.log('FormData:', formData);
};

export const filterPayload = <T extends object>(payload: T): Partial<T> => {
  return Object.keys(payload).reduce((acc, key) => {
    const value = (payload as any)[key];
    if (value !== undefined && value !== null) {
      (acc as any)[key] = value;
    }
    return acc;
  }, {} as Partial<T>);
};

export const downloadFile = async (
  printResponsesType: PrintResponsesType,
  payload: PrintFormResponsesRequest,
): Promise<{downloadStatus:boolean,savedFilePath:string|null}> => {

  try {
    const timestamp = new Date().getTime();
    const token = await getToken();
    const url = `https://app-uat.pehlayakshar.org/${
      printResponsesType === 'Individual Wise'
        ? endPoints.PRINT_FORM_RESPONSES
        : endPoints.PRINT_QUESTION_WISE_RESPONSES
    }`;

    const downloadDir =
      Platform.OS === 'android'
        ? RNFetchBlob.fs.dirs.DownloadDir
        : RNFS.DocumentDirectoryPath;

    const path = `${downloadDir}/pdf_${timestamp}.pdf`;

    console.log('Downloading file to:', path);

    const response = await RNFetchBlob.config({
      fileCache: true,
      appendExt: 'pdf',
      
      path: path,
    }).fetch(
      'POST',
      url,
      {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      JSON.stringify(payload),
    );

    console.log('File saved to:', response.path());
    console.log('ggvhvghgh diugu kjhjkhjhkv',url)
    if (Platform.OS === 'android') {
      RNFetchBlob.android.actionViewIntent(response.path(), 'application/pdf');
    } else if (Platform.OS === 'ios') {
      RNFetchBlob.ios.previewDocument(response.path());
    }
    return {downloadStatus: true,savedFilePath:response.path()?.toString()};
  } catch (error) {
    console.error('Error downloading file:', error);
    return {downloadStatus: false,savedFilePath:null};
  }
};
