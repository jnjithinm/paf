import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ProgressBarAndroid, Platform, ProgressViewIOS } from 'react-native';
import DocumentPicker, { DocumentPickerResponse } from 'react-native-document-picker';
import Image from '../components/Image';

interface FileUploadProps {
    onFilesPicked?: (files: DocumentPickerResponse[]) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesPicked }) => {
    const [files, setFiles] = useState<DocumentPickerResponse[]>([]);
    const [uploadProgress, setUploadProgress] = useState<number>(80);
    const [uploading, setUploading] = useState<boolean>(false);

    const pickFiles = async () => {
        try {
            const results = await DocumentPicker.pick({
                allowMultiSelection: true,
                type: [DocumentPicker.types.images, DocumentPicker.types.video, DocumentPicker.types.audio, DocumentPicker.types.pdf, DocumentPicker.types.doc],
            });
            // console.log("Files picked:", results);

            setFiles(results);
            if (onFilesPicked) {
                onFilesPicked(results);
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log('User cancelled the picker');
            } else {
                console.log('Unknown error: ', err);
                Alert.alert('Error', 'An error occurred while picking the files.');
            }
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.dropZone} onPress={pickFiles}>
                <Image name='upload_icon' />
                <Text style={styles.dropZoneText}>Drag and drop or <Text style={styles.browseText}>Browse</Text> your files</Text>
                <Text style={styles.supportedTypes}>Supported file types: jpg, mp4, mp3</Text>
            </TouchableOpacity>
            {/* <View style={styles.progressContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <View>
                        <Image name='img_upload_icon' />
                    </View>
                    <View>
                        <Text style={styles.dropZoneText}>{` Uploaded ${files.length} files`}</Text>
                        <Text style={styles.supportedTypes}>{` ${uploadProgress}% completed`}</Text>
                    </View>
                </View>

                {Platform.OS === 'android' ? (
                    <ProgressBarAndroid styleAttr="Horizontal" color="#749E35" indeterminate={false} progress={uploadProgress / 100} style={{ width: '100%' }} />
                ) : (
                    <ProgressViewIOS progress={uploadProgress / 100} />
                )}
            </View> */}
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
        borderBottomWidth: 1,
        borderBottomColor: 'red'
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
        padding: 10,
        marginBottom: 20,
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
