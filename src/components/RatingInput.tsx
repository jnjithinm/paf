import { FC } from 'react';
import { TextStyle, TouchableOpacity, View, ViewStyle, GestureResponderEvent } from 'react-native';
import Text from './Text';
import Icon from './Icon';

type RatingInputTypes = {
  label: string;
  rating: number;
  onChangeRating: (rating: number) => void;
  size?: number;
  disabled?: boolean;
  showRating?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
};

const RatingInput: FC<RatingInputTypes> = ({
  label,
  rating,
  onChangeRating,
  size = 22,
  disabled,
  showRating = true,
  style,
  labelStyle,
}) => {
  const handleStarPress = (index: number, event: GestureResponderEvent) => {
    const { locationX } = event.nativeEvent;
    const starWidth = size;
    const isHalfStar = locationX < starWidth / 2;
    const newRating = isHalfStar ? index + 0.5 : index + 1;
    onChangeRating(newRating);
  };

  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;


  return (
    <View style={{ ...style }}>
      {label && (
        <Text fontVariant="bold" size="body1" style={{ ...labelStyle }}>
          {label}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          marginTop: label ? 5 : 0,
          width: '35%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        {Array.from({ length: 5 }, (_, index) => {
          if (index < filledStars) {
            return (
              <TouchableOpacity
                key={index}
                onPress={(event) => handleStarPress(index, event)}
                disabled={disabled}>
                <Icon
                  key={index}
                  name='star_icon'
                  width={size}
                  height={size}
                />
              </TouchableOpacity>
            );
          } else if (index === filledStars && hasHalfStar) {
            return (
              <TouchableOpacity
                key={index}
                onPress={(event) => handleStarPress(index, event)}
                disabled={disabled}>
                <Icon
                  key={index}
                  name='star_half_filled_icon'
                  width={size}
                  height={size}
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={index}
                onPress={(event) => handleStarPress(index, event)}
                disabled={disabled}>
                <Icon
                  key={index}
                  name='star_unfilled_icon'
                  width={size}
                  height={size}
                />
              </TouchableOpacity>
            );
          }
        })}
        {showRating && (
          <>
            <View style={{ height: 15, width: 1, backgroundColor: '#E4E7EB' }} />
            <Text style={{ left: 5 }}>( {rating} ) </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default RatingInput;
