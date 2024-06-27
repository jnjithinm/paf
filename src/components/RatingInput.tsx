import {FC, useState} from 'react';
import {TextStyle, TouchableOpacity, View, ViewStyle} from 'react-native';
import Text from './Text';
import Icon from './Icon';

type RatingInputTypes = {
  label: string;
  rating: number;
  onChangeRating: (rating: number) => void;
  size?: number;
  disabled?: boolean;
  showRating?: boolean;
  style?:ViewStyle
  labelStyle?:TextStyle
};

const RatingInput: FC<RatingInputTypes> = ({
  label,
  rating,
  onChangeRating,
  size = 20,
  disabled,
  showRating = true,
  style,
  labelStyle
}) => {
  const [selectedRating, setSelectedRating] = useState(rating);

  const handleStarPress = (index: number) => {
    const newRating = index + 1;
    setSelectedRating(newRating);
    onChangeRating(newRating);
  };

  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;
  return (
    <View style={{...style}}>
      {label && (
        <Text fontVariant="bold" size="body1" style={{...labelStyle}}>
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
        {Array.from({length: 5}, (_, index) => {
          if (index < filledStars) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
                disabled={disabled}>
                <Icon
                  key={index}
                  name={rating ? 'star_icon' : 'rating_deselected_icon'}
                  width={size}
                  height={size}
                />
              </TouchableOpacity>
            );
          } else if (index === filledStars && hasHalfStar) {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
                disabled={disabled}>
                <Icon
                  key={index}
                  name={
                    rating ? 'star_half_filled_icon' : 'rating_deselected_icon'
                  }
                  width={size}
                  height={size}
                />
              </TouchableOpacity>
            );
          } else {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleStarPress(index)}
                disabled={disabled}>
                <Icon
                  key={index}
                  name={
                    rating ? 'star_unfilled_icon' : 'rating_deselected_icon'
                  }
                  width={size}
                  height={size}
                />
              </TouchableOpacity>
            );
          }
        })}
        {showRating && (
          <>
            <View style={{height: 15, width: 1, backgroundColor: '#E4E7EB'}} />
            <Text style={{left: 5}}>( {rating} ) </Text>
          </>
        )}
      </View>
    </View>
  );
};

export default RatingInput;
