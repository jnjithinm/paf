import React, {Dispatch, FC, SetStateAction, useEffect, useState} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import Image from '../components/Image';
import ZipArchive, {zip} from 'react-native-zip-archive';
import Text from './Text';
import {FileObject} from '../config/types';
import RNFS from 'react-native-fs';
import {useAppDispatch} from '../redux/store';
import {setLoading} from '../redux/features/authSlice';
import { setObservationShowMessage } from '../redux/features/observationSlice';

type ImageItemProps = {
  item: FileObject;
  onRemove: (item: FileObject) => void;
  onPressFile?: (item: FileObject) => void;
  disabled?: boolean;
};

export const FileItem: FC<ImageItemProps> = ({
  item,
  onRemove,
  onPressFile,
  disabled,
}) => {
  return (
    <View style={styles.progressContainer}>
      <TouchableOpacity
        style={{flexDirection: 'row', width: '90%', alignItems: 'center'}}
        onPress={() => {
          if (onPressFile) {
            onPressFile({
              uri: item.uri,
              name: item.name?.toString() || '',
              type: item.type?.toString() || '',
            });
          }
        }}>
        <View>
          {item.type?.startsWith('image') ? (
            <Image name="img_upload_icon" />
          ) : item.type?.startsWith('video') ? (
            <Image name="video_icon" />
          ) : item.type?.startsWith('audio') ? (
            <Image name="mic_icon" />
          ) : (
            <Image name="attachment" />
          )}
        </View>
        <View style={{paddingRight: 15, paddingLeft: 10}}>
          <Text style={styles.dropZoneText}>{item.name}</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '10%',
        }}
        disabled={disabled}
        onPress={() => onRemove(item)}>
        <Image name="cross_icon" />
      </TouchableOpacity>
    </View>
  );
};

const zipFiles = async (filePaths: string | string[], targetPath: string) => {
  try {
    await zip(filePaths, targetPath);
    return targetPath;
  } catch (error) {
    console.error('Failed to zip files:', error);
    throw error;
  }
};

const createZipFile = async (
  files: FileObject[],
): Promise<FileObject | undefined> => {
  const filePaths = [];
  try {
    for (const result of files) {
      const sourceUri = result.uri;
      const fileName = result.name;
      const destPath = `${RNFS.DocumentDirectoryPath}/${fileName}`;
      await RNFS.copyFile(sourceUri, destPath);
      filePaths.push(destPath);
    }

    const name = `${new Date().getTime()}.zip`;
    const targetPath = `${RNFS.DocumentDirectoryPath}/${name}`;
    await zipFiles(filePaths, targetPath);

    const zipFile = {
      uri: targetPath,
      name,
      type: 'application/zip',
    };
    return zipFile;
  } catch (err) {
    return undefined;
  }
};

interface FileUploadProps {
  setZipFile: Dispatch<SetStateAction<FileObject | undefined>>;
  files: FileObject[];
  onPressFile?: (item: FileObject) => void;
  setFiles: Dispatch<SetStateAction<FileObject[]>>;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  setZipFile,
  files,
  onPressFile,
  setFiles,
  disabled,
}) => {
  const dispatch = useAppDispatch();

  const pickFiles = async () => {
    try {
      dispatch(setLoading(true));
      const results = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.video,
          DocumentPicker.types.audio,
          DocumentPicker.types.pdf,
          DocumentPicker.types.doc,
        ],
      });

      const newFiles: FileObject[] = [];
      for (const result of results) {
        const fileStat = await RNFS.stat(result.uri);
        if (fileStat.size > 20 * 1024 * 1024) {
          console.log(`File ${result.name} is larger than 20 MB`);

          setObservationShowMessage({status:'Failed',})
        } else {
          newFiles.push({
            uri: result.uri,
            type: result.type ?? '',
            name: result.name ?? '',
          });
        }
      }
      const zipFile = await createZipFile([...newFiles, ...files]);
      if (zipFile) {
        setZipFile(zipFile);
      }
      setFiles(prevFiles => [...prevFiles, ...newFiles]);
      dispatch(setLoading(false));
    } catch (err) {
      dispatch(setLoading(false));
      console.error('Error picking files:', err);
    }
  };
  const handleRemoveItem = async (item: FileObject) => {
    const updatedFiles = files.filter(file => file.uri !== item.uri);
    try {
      const zip = await createZipFile(updatedFiles);
      setZipFile(zip);
      setFiles(updatedFiles);
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <View>
      <View style={styles.container}>
        {!disabled && (
          <TouchableOpacity style={styles.dropZone} onPress={pickFiles}>
            <Image name="upload_icon" />
            <Text style={styles.dropZoneText}>
              Drag and drop or <Text style={styles.browseText}>Browse</Text>{' '}
              your files
            </Text>
            <Text style={styles.supportedTypes}>
              Supported file types: jpg, mp4, mp3
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={{marginVertical: 10}}>
        {files.map(item => (
          <FileItem
            key={item.name}
            item={{
              uri: item.uri,
              name: item?.name || '',
              type: item?.type || '',
            }}
            disabled={disabled}
            onRemove={handleRemoveItem}
            onPressFile={onPressFile}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // padding: 10,
  },
  dropZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#ABB4BD',
    borderRadius: 5,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  dropZoneText: {
    fontSize: 13,
    color: '#333',
  },
  browseText: {
    color: '#007bff',
    borderBottomWidth: 1,
    borderBottomColor: 'red',
  },
  supportedTypes: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    borderWidth: 1,
    borderColor: '#ABB4BD',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  uploadingText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 14,
    color: '#333',
    marginTop: 5,
  },
  uploadButton: {
    backgroundColor: '#6a1b9a',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default FileUpload;
