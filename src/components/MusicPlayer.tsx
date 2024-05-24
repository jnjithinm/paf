import React, { useState, useEffect } from 'react';
import { View, Image, Text, TouchableOpacity, Platform, Alert } from 'react-native';
import Sound from 'react-native-sound';

const img_speaker = require('../assets/images/ui_speaker.png');
const img_pause = require('../assets/images/ui_pause.png');
const img_play = require('../assets/images/ui_play.png');
const img_playjumpleft = require('../assets/images/ui_playjumpleft.png');
const img_playjumpright = require('../assets/images/ui_playjumpright.png');

interface PlayerScreenProps {
    navigation: {
        state: {
            params: {
                title: string;
                filepath: string;
                dirpath?: string;
            };
        };
    };
}

const PlayerScreen: React.FC<PlayerScreenProps> = ({ navigation }) => {
    const [playState, setPlayState] = useState<'playing' | 'paused'>('paused');
    const [playSeconds, setPlaySeconds] = useState<number>(0);
    const [duration, setDuration] = useState<number>(0);
    let sliderEditing = false;
    let sound: Sound | null = null;
    let timeout: NodeJS.Timeout | null = null;

    useEffect(() => {
        play();
        timeout = setInterval(() => {
            if (sound && sound.isLoaded() && playState === 'playing' && !sliderEditing) {
                sound.getCurrentTime((seconds, isPlaying) => {
                    setPlaySeconds(seconds);
                });
            }
        }, 100);

        return () => {
            if (sound) {
                sound.release();
                sound = null;
            }
            if (timeout) {
                clearInterval(timeout);
            }
        };
    }, []);

    const onSliderEditStart = () => {
        sliderEditing = true;
    };

    const onSliderEditEnd = () => {
        sliderEditing = false;
    };

    const onSliderEditing = (value: number) => {
        if (sound) {
            sound.setCurrentTime(value);
            setPlaySeconds(value);
        }
    };

    const play = async () => {
        console.log("mmmmmmmm",sound);
        
        if (sound) {
            console.log("mjjjjj");
            
            sound.play(playComplete);
            setPlayState('playing');
        } else {
            const filepath = 'https://commondatastorage.googleapis.com/codeskulptor-demos/DDR_assets/Sevish_-__nbsp_.mp3';
            let dirpath = '';
            // if (navigation.state.params.dirpath) {
            //     dirpath = navigation.state.params.dirpath;
            // }
            // console.log('[Play]', filepath);

            sound = new Sound(filepath, dirpath, (error) => {
                if (error) {
                    console.log('failed to load the sound', error);
                    Alert.alert('Notice', 'audio file error. (Error code : 1)');
                    setPlayState('paused');
                } else {
                    setPlayState('playing');
                    setDuration(sound.getDuration());
                    sound.play(playComplete);
                }
            });
        }
    };

    const playComplete = (success: boolean) => {
        if (sound) {
            if (success) {
                console.log('successfully finished playing');
            } else {
                console.log('playback failed due to audio decoding errors');
                Alert.alert('Notice', 'audio file error. (Error code : 2)');
            }
            setPlayState('paused');
            setPlaySeconds(0);
            sound.setCurrentTime(0);
        }
    };

    const pause = () => {
        console.log("pause",sound);
        
        if (sound) {
            sound.pause();
        }
        setPlayState('paused');
    };

    const jumpPrev15Seconds = () => {
        jumpSeconds(-15);
    };

    const jumpNext15Seconds = () => {
        jumpSeconds(15);
    };

    const jumpSeconds = (secsDelta: number) => {
        if (sound) {
            sound.getCurrentTime((secs, isPlaying) => {
                let nextSecs = secs + secsDelta;
                if (nextSecs < 0) nextSecs = 0;
                else if (nextSecs > duration) nextSecs = duration;
                sound.setCurrentTime(nextSecs);
                setPlaySeconds(nextSecs);
            });
        }
    };

    const getAudioTimeString = (seconds: number): string => {
        const h = parseInt(seconds / (60 * 60));
        const m = parseInt((seconds % (60 * 60)) / 60);
        const s = parseInt(seconds % 60);

        return `${(h < 10 ? '0' + h : h)}:${(m < 10 ? '0' + m : m)}:${(s < 10 ? '0' + s : s)}`;
    };

    const currentTimeString = getAudioTimeString(playSeconds);
    const durationString = getAudioTimeString(duration);

    return (
        <View style={{ flex: 1, justifyContent: 'center', backgroundColor: 'black' }}>
            <Image source={img_speaker} style={{ width: 150, height: 150, marginBottom: 15, alignSelf: 'center' }} />
            <View style={{ flexDirection: 'row', justifyContent: 'center', marginVertical: 15 }}>
                <TouchableOpacity onPress={jumpPrev15Seconds} style={{ justifyContent: 'center' }}>
                    <Image source={img_playjumpleft} style={{ width: 30, height: 30 }} />
                    <Text style={{ position: 'absolute', alignSelf: 'center', marginTop: 1, color: 'white', fontSize: 12 }}>15</Text>
                </TouchableOpacity>
                {playState === 'playing' && (
                    <TouchableOpacity onPress={pause} style={{ marginHorizontal: 20 }}>
                        <Image source={img_pause} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                )}
                {playState === 'paused' && (
                    <TouchableOpacity onPress={play} style={{ marginHorizontal: 20 }}>
                        <Image source={img_play} style={{ width: 30, height: 30 }} />
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={jumpNext15Seconds} style={{ justifyContent: 'center' }}>
                    <Image source={img_playjumpright} style={{ width: 30, height: 30 }} />
                    <Text style={{ position: 'absolute', alignSelf: 'center', marginTop: 1, color: 'white', fontSize: 12 }}>15</Text>
                </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 15, marginHorizontal: 15, flexDirection: 'row' }}>
                <Text style={{ color: 'white', alignSelf: 'center' }}>{currentTimeString}</Text>
                {/* <Slider
                    onTouchStart={onSliderEditStart}
                    onTouchEnd={onSliderEditEnd}
                    onValueChange={onSliderEditing}
                    value={playSeconds}
                    maximumValue={duration}
                    maximumTrackTintColor='gray'
                    minimumTrackTintColor='white'
                    thumbTintColor='white'
                    style={{ flex: 1, alignSelf: 'center', marginHorizontal: Platform.select({ ios: 5 }) }}
                /> */}
                <Text style={{ color: 'white', alignSelf: 'center' }}>{durationString}</Text>
            </View>
        </View>
    );
};

export default PlayerScreen;
