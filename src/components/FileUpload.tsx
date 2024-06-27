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

type ImageItemProps = {
  item: DocumentPickerResponse;
  onRemove: (item: DocumentPickerResponse) => void;
  onPressFile: (item: FileObject) => void;
  // disabled?: boolean;
};

const ImageItem: FC<ImageItemProps> = ({
  item,
  onRemove,
  onPressFile,
  // disabled,
}) => {
  return (
    <TouchableOpacity
      style={styles.progressContainer}
      onPress={() =>
        onPressFile({
          uri: item.uri,
          name: item.name?.toString() || '',
          type: item.type?.toString() || '',
        })
      }
      // disabled={disabled}
    >
      <View style={{flexDirection: 'row', width: '90%', alignItems: 'center'}}>
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
        <View>
          <Text style={styles.dropZoneText}>{item.name}</Text>
        </View>
      </View>
      <TouchableOpacity
        style={{
          alignItems: 'center',
          justifyContent: 'flex-end',
          width: '10%',
        }}
        onPress={() => onRemove(item)}>
        <Image name="cross_icon" />
      </TouchableOpacity>
    </TouchableOpacity>
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

interface FileUploadProps {
  onFilesPicked?: (files: FileObject) => void;
  filesArray?: FileObject[];
  onPressFile: (item: FileObject) => void;
  onRemoveItem: Dispatch<SetStateAction<FileObject[]>>;
  disabled?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesPicked,
  filesArray,
  onPressFile,
  onRemoveItem,
  disabled,
}) => {
  const [files, setFiles] = useState<DocumentPickerResponse[]>([]);
  const getContentUriPath = async (contentUri: any) => {
    const fileInfo = await RNFS.stat(contentUri);
    return fileInfo.originalFilepath || contentUri;
  };

  const pickFiles = async () => {
    try {
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

      const newFiles = [...files, ...results];
      setFiles(newFiles);

      const filePaths = [];
      for (const result of newFiles) {
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
      if (onFilesPicked) {
        onFilesPicked(zipFile);
      }
    } catch (err) {
      console.error('Error picking files:', err);
      Alert.alert('Error', 'Failed to pick files');
    }
  };
  const handleRemoveItem = (item: DocumentPickerResponse) => {
    const updatedFiles = files.filter(file => file !== item);
    setFiles(updatedFiles);
    onRemoveItem(updatedFiles);
  };

  // useEffect(() => {
  //   if (filesArray) {
  //     setFiles(filesArray);
  //   }
  // }, [filesArray]);

  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.dropZone}
          onPress={pickFiles}
          disabled={disabled}>
          <Image name="upload_icon" />
          <Text style={styles.dropZoneText}>
            Drag and drop or <Text style={styles.browseText}>Browse</Text> your
            files
          </Text>
          <Text style={styles.supportedTypes}>
            Supported file types: jpg, mp4, mp3
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{marginVertical: 10}}>
        {files.map(item => (
          <ImageItem
            key={item.name}
            item={item}
            onRemove={handleRemoveItem}
            onPressFile={onPressFile}
            // disabled={disabled}
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
