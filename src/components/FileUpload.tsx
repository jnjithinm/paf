// components/FileUpload.js
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ProgressBarAndroid,
  Platform,
  ProgressViewIOS,
} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import {FONT_SIZES, FONT_VARIANT} from '../config/themes';
// import axios from 'axios';

const FileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const pickFiles = async () => {
    try {
      const results = await DocumentPicker.pick({
        allowMultiSelection: true,
        type: [
          DocumentPicker.types.images,
          DocumentPicker.types.video,
          DocumentPicker.types.audio,
        ],
      });
      console.log('reeeee', results);

      setFiles(results);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.log('Unknown error: ', err);
        Alert.alert('Error', 'An error occurred while picking the files.');
      }
    }
  };

  const uploadFiles = async () => {
    if (files.length === 0) {
      Alert.alert('No files selected', 'Please select files first.');
      return;
    }

    // const formData = new FormData();
    // files.forEach((file) => {
    //   formData.append('files', {
    //     uri: file.uri,
    //     type: file.type,
    //     name: file.name,
    //   });
    // });

    setUploading(true);

    try {
      //   await axios.post('YOUR_UPLOAD_URL', formData, {
      //     headers: {
      //       'Content-Type': 'multipart/form-data',
      //     },
      //     onUploadProgress: (progressEvent) => {
      //       const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //       setUploadProgress(progress);
      //     },
      //   });
      Alert.alert('Success', 'Files uploaded successfully.');
      setFiles([]);
    } catch (error) {
      console.error('File upload error: ', error);
      Alert.alert('Error', 'An error occurred while uploading the files.');
    } finally {
      //   setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.dropZone} onPress={pickFiles}>
        <Text style={styles.dropZoneText}>
          Drag and drop or <Text style={styles.browseText}>Browse</Text> your
          files
        </Text>
        <Text style={styles.supportedTypes}>
          Supported file types: jpg, mp4, mp3
        </Text>
      </TouchableOpacity>
      {uploading && (
        <View style={styles.progressContainer}>
          <Text style={styles.uploadingText}>
            Uploaded {files.length} files
          </Text>
          {Platform.OS === 'android' ? (
            <ProgressBarAndroid
              styleAttr="Horizontal"
              color="#6a1b9a"
              indeterminate={false}
              progress={uploadProgress / 100}
            />
          ) : (
            <ProgressViewIOS progress={uploadProgress / 100} />
          )}
          <Text style={styles.progressText}>{uploadProgress} % completed</Text>
        </View>
      )}
      <TouchableOpacity style={styles.uploadButton} onPress={uploadFiles}>
        <Text style={styles.uploadButtonText}>Upload</Text>
      </TouchableOpacity>
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
    fontSize: 16,
    color: '#333',
  },
  browseText: {
    color: '#007bff',
  },
  supportedTypes: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  progressContainer: {
    marginVertical: 20,
    alignItems: 'center',
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
