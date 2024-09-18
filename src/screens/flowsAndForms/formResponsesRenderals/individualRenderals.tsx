// import React, {FC, useEffect, useState} from 'react';
// import {TouchableOpacity, View, ViewStyle} from 'react-native';

// import moment from 'moment';
// import Text from '../../../components/Text';
// import Icon from '../../../components/Icon';
// import Image from '../../../components/Image';
// import {normaliseDesigns} from '../../../utils/helpers/responsiveHelpers';
// import colors from '../../../config/colors';
// import {
//   IndicatorIndividualResponse,
//   IndividualResponse,
//   resetDeleteFormResponse,
// } from '../../../redux/features/formsSlice';
// import RatingInput from '../../../components/RatingInput';
// import {useAppDispatch, useAppSelector} from '../../../redux/store';
// import {deleteForm} from '../../../redux/features/formsSlice';
// import {FlowDetailItem} from '../../../redux/features/flowsSlice';
// import {RenderEmptyPlaceholder} from '../../observation/ObservationReportsMainPage';
// import FastImage from 'react-native-fast-image';

// type IndividualTileTypes = {
//   flowDetailItem: FlowDetailItem;
//   id: number;
//   rating: number;
//   name: string;
//   image: string;
//   creationDate: string;
//   questionsAnswered: string;
//   onPress: () => void;
//   onPressDelete: () => void;
//   style?: ViewStyle;
// };

// const IndividualTile: FC<IndividualTileTypes> = ({
//   flowDetailItem,
//   id,
//   rating,
//   name,
//   image,
//   creationDate,
//   questionsAnswered,
//   onPress,
//   onPressDelete,
//   style,
// }) => {
//   const [isPressed, setIsPressed] = useState(false);
//   const dispatch = useAppDispatch();
//   const {userData} = useAppSelector(state => state.auth);
//   const {deleteFormResponse} = useAppSelector(state => state.forms);

//   const onPressDeleteFormResponse = () => {
//     dispatch(
//       deleteForm([
//         flowDetailItem.flowId,
//         0,
//         {
//           ids: [id],
//           loggedInUserName: userData.userName,
//         },
//       ]),
//     );
//   };

//   useEffect(() => {
//     if (deleteFormResponse) {
//       dispatch(resetDeleteFormResponse());
//     }
//   }, [deleteFormResponse]);

//   useEffect(() => {
//     return () => {
//       setIsPressed(false);
//     };
//   }, [isPressed]);

//   return (
//     <TouchableOpacity
//       onPress={() => {
//         setIsPressed(true);
//         onPress();
//       }}
//       key={name}
//       style={{
//         width: '100%',
//         flexDirection: 'row',
//         borderWidth: 1,
//         borderColor: '#F4C24A',
//         height: normaliseDesigns(60),
//         justifyContent: 'space-between',
//         borderRadius: 10,
//         alignItems: 'center',
//         marginVertical: 5,
//         backgroundColor: isPressed ? '#FCEBC5' : colors.backgroundColor,
//         ...style,
//       }}>
//       <View
//         style={{
//           flexDirection: 'row',
//           padding: 8,
//           backgroundColor: '#EAF1FE',
//           borderRadius: 10,
//           alignSelf: 'flex-start',
//           alignItems: 'center',
//           justifyContent: 'center',
//           width: '13%',
//         }}>
//         <Text size="small1" fontVariant="bold">
//           {rating}
//         </Text>
//         <Icon style={{marginLeft: 5}} name="star_icon" width={10} />
//       </View>
//       <View style={{width: '85%', paddingRight: 10, paddingLeft: 10}}>
//         <Text fontVariant="bold" size="body1">
//           {name}
//         </Text>
//         <View
//           style={{
//             flexDirection: 'row',
//             width: '100%',
//             justifyContent: 'space-between',
//             marginTop: 7,
//           }}>
//           <View>
//             <Text size="verysmall3" opacity="0.50">
//               Creation Date
//             </Text>
//             <Text size="small3">{creationDate}</Text>
//           </View>
//           <View>
//             <Text size="verysmall3" opacity="0.50">
//               Questions Answered
//             </Text>
//             <Text size="small3"> {questionsAnswered}</Text>
//           </View>
//           {/* <TouchableOpacity
//             style={{alignSelf: 'flex-end'}}
//             onPress={onPressDelete}>
//             <Icon name="trash_icon" />
//           </TouchableOpacity> */}
//         </View>
//       </View>
//     </TouchableOpacity>
//   );
// };

// type IndividualMainPageRenderalTypes = {
//   onPress: (item: IndividualResponse) => void;
//   individualResponse: IndividualResponse[] | undefined;
//   flowDetailItem: FlowDetailItem;
//   totalQuestion: number;
// };

// //IndividualMainScreen Renderals
// export const IndividualMainPageRenderal: FC<
//   IndividualMainPageRenderalTypes
// > = ({onPress, individualResponse, flowDetailItem, totalQuestion}) => {
//   return (
//     <View>
//       {individualResponse ? (
//         individualResponse.length > 0 ? (
//           individualResponse.map(item => (
//             <IndividualTile
//               rating={item.questionAvgRating || 0}
//               creationDate={moment(item.responses[0].responseDate).format(
//                 'DD/MM/YYYY',
//               )}
//               onPress={() => {
//                 onPress(item);
//                 // navigation.navigate('AdminFormList');
//               }}
//               flowDetailItem={flowDetailItem}
//               id={item.userId}
//               key={item.userId}
//               name={item.name}
//               image={''}
//               questionsAnswered={`${item.responses.length}/${totalQuestion}`}
//               onPressDelete={() => {}}
//             />
//           ))
//         ) : (
//           <RenderEmptyPlaceholder />
//         )
//       ) : (
//         <></>
//       )}
//     </View>
//   );
// };

// type RatingProps = {
//   rating: number;
// };

// export const RatingStars: FC<RatingProps> = ({ rating }) => {
//   const renderStars = () => {
//     const stars = [];
//     const maxStars = 5;
//     const starSize = { width: 15, height: 15 }; // Define uniform size for all stars

//     for (let i = 0; i < maxStars; i++) {
//       if (i < Math.floor(rating)) {
//         stars.push(
//           <Icon
//             key={i}
//             name="star_icon"
//             {...starSize} // Apply uniform size
//           />
//         );
//       } else if (i < rating) {
//         stars.push(
//           <Icon
//             key={i}
//             name="star_half_filled_icon"
//             {...starSize} // Apply uniform size
//           />
//         );
//       } else {
//         stars.push(
//           <Icon
//             key={i}
//             name="star_unfilled_icon"
//             {...starSize} // Apply uniform size
//           />
//         );
//       }
//     }
//     return stars;
//   };

//   return <View style={{ flexDirection: 'row' }}>{renderStars()}</View>;
// };

// type RenderProfileIconTypes = {
//   image: string | null | undefined;
//   name: string;
//   size?: number;
// };

// export const RenderProfileIcon: FC<RenderProfileIconTypes> = ({
//   image,
//   name,
//   size = 20,
// }) => {
//   if (image) {
//     return (
//       <FastImage
//         style={{width: size, height: size, borderRadius: size / 2}}
//         source={{
//           uri: image,
//           priority: FastImage.priority.normal,
//         }}
//         resizeMode={FastImage.resizeMode.cover}
//         onLoadStart={() => console.log('Loading started')}
//         onLoadEnd={() => console.log('Loading finished')}
//         onError={() => console.log('Failed to load image')}
//       />
//     );
//   } else {
//     const initials = name ? getInitials(name) : '';
//     return (
//       <View
//         style={[
//           {
//             justifyContent: 'center',
//             alignItems: 'center',
//             backgroundColor: '#CBD2D9',
//             width: size,
//             height: size,
//             borderRadius: size / 2,
//           },
//         ]}>
//         <Text style={{fontSize: size / 2}}>{initials}</Text>
//       </View>
//     );
//   }
// };

// const getInitials = (name: string): string => {
//   const nameParts = name.trim().split(' ');
//   if (nameParts.length > 1) {
//     const firstNameInitial = nameParts[0][0];
//     const lastNameInitial = nameParts[nameParts.length - 1][0];
//     return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
//   } else {
//     const firstInitial = name[0];
//     const lastInitial = name[name.length - 1];
//     return `${firstInitial}${lastInitial}`.toUpperCase();
//   }
// };

// type RenderQuestionAndAnswerTypes = {
//   index: number;
//   question: string;
//   answer: string;
//   rating: number;
//   indicators?: IndicatorIndividualResponse[];
// };

// const RenderQuestionAndAnswer: FC<RenderQuestionAndAnswerTypes> = ({
//   index,
//   question,
//   answer,
//   rating,
//   indicators,
// }) => (
//   <View
//     style={{
//       borderBottomWidth: 1,
//       borderBottomColor: '#CBD2D9',
//       paddingVertical: 10,
//     }}>
//     <View>
//       <View style={{flexDirection: 'row'}}>
//         <Text style={{flex: 2}}>{index}.</Text>
//         <Text style={{flex: 17}} size="body1">
//           {question}
//         </Text>
//       </View>
//       <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
//         <View style={{flex: 1}}>
//           <Icon name="arrow_narrow_right" />
//         </View>
//         <Text style={{color: '#4E565F', flex: 17}} size="body1">
//           {answer}
//         </Text>
//       </View>
//       {rating && (
//         <View
//           style={{
//             flexDirection: 'row',
//             alignSelf: 'flex-end',
//             alignItems: 'center',
//           }}>
//           <Text style={{color: '#4E565F', right: 10}} size="small1">
//             Rating
//           </Text>
//           <Text
//             style={{color: '#4E565F', right: 2.5}}
//             size="small3"
//             fontVariant="bold">
//             {rating?.toFixed(1)}
//           </Text>
//           <Icon name="rating_star_display" width={15} height={15} />
//         </View>
//       )}
//     </View>
//     {indicators &&
//       indicators.map((item, index) => (
//         <View>
//           <Text size="small2">{item.indicatorName}</Text>
//           <RatingInput
//             disabled
//             rating={item.avgRating || 0}
//             label={''}
//             size={15}
//             style={{marginTop: 4}}
//             key={index}
//             onChangeRating={() => {}}
//           />
//         </View>
//       ))}
//   </View>
// );

// type IndividualDescriptionRenderalTypes = {
//   individualResponse: IndividualResponse | null;
//   totalQuestion: number;
// };

// //IndividualDescription Renderal
// export const IndividualDescriptionRenderal: FC<
//   IndividualDescriptionRenderalTypes
// > = ({individualResponse, totalQuestion}) => (
//   <View>
//     {individualResponse ? (
//       <>
//         <View
//           style={{
//             backgroundColor: '#FCEBC5',
//             padding: 15,
//             flexDirection: 'row',
//             justifyContent: 'space-between',
//             borderRadius: 10,
//             width: '100%',
//             height: normaliseDesigns(105),
//             marginTop: 5,
//             marginBottom: 10,
//           }}>
//           <View style={{justifyContent: 'space-between'}}>
//             <Text fontVariant="bold">{individualResponse?.name}</Text>
//             <View style={{flexDirection: 'row', alignItems: 'center'}}>
//               <RenderProfileIcon
//                 image={userData?.userImageUrl || userData.userImageUrl}
//                 name={userData?.name || ''}
//                 size={45}
//               />
//               {/* <RatingInput
//                 rating={individualResponse?.questionAvgRating || 0}
//                 label={''}
//                 size={15}
//                 onChangeRating={() => {}}
//                 showRating={false}
//               /> */}
//                 <RatingStars rating={Number(individualResponse?.questionAvgRating || 0)} />
//               <Text style={{paddingLeft:5}}>
//                 {`${individualResponse?.questionAvgRating?.toFixed(1)||0} / 5`}
//               </Text>
//             </View>
//             <View
//               style={{
//                 backgroundColor: '#FEF8EC',
//                 padding: 10,
//                 borderRadius: 10,
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 flexDirection: 'row',
//               }}>
//               <Text fontVariant="bold">
//                 {individualResponse?.responses?.length}/{totalQuestion}{' '}
//               </Text>
//               <Text size="small3" style={{marginLeft: 5, color: '#1F2933'}}>
//                 Questions answered
//               </Text>
//             </View>
//           </View>
//           <Image
//             name="response_card_icon"
//             size={0.9}
//             style={{alignSelf: 'flex-end'}}
//           />
//         </View>
//         {individualResponse?.responses.map((item, index) => (
//           <RenderQuestionAndAnswer
//             index={index+1}
//             question={item.questionText}
//             answer={item.responseValues}
//             rating={item.avgRating}
//             indicators={item.indicators}
//             key={index}
//           />
//         ))}
//       </>
//     ) : (
//       <RenderEmptyPlaceholder />
//     )}
//   </View>
// );

import React, {FC, useEffect, useState} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import moment from 'moment';
import Text from '../../../components/Text';
import Icon from '../../../components/Icon';
import Image from '../../../components/Image';
import {normaliseDesigns} from '../../../utils/helpers/responsiveHelpers';
import colors from '../../../config/colors';
import {
  IndicatorIndividualResponse,
  IndividualResponse,
  resetDeleteFormResponse,
} from '../../../redux/features/formsSlice';
import RatingInput from '../../../components/RatingInput';
import {useAppDispatch, useAppSelector} from '../../../redux/store';
import {deleteForm} from '../../../redux/features/formsSlice';
import {FlowDetailItem} from '../../../redux/features/flowsSlice';
import {RenderEmptyPlaceholder} from '../../observation/ObservationReportsMainPage';
import FastImage from 'react-native-fast-image';

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  const nameParts = name.trim().split(' ');
  if (nameParts.length > 1) {
    const firstNameInitial = nameParts[0][0];
    const lastNameInitial = nameParts[nameParts.length - 1][0];
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  } else {
    const firstInitial = name[0];
    const lastInitial = name[name.length - 1];
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }
};

type IndividualTileTypes = {
  flowDetailItem: FlowDetailItem;
  id: number;
  rating: number;
  name: string;
  image: string;
  creationDate: string;
  questionsAnswered: string;
  onPress: () => void;
  onPressDelete: () => void;
  style?: ViewStyle;
};

const IndividualTile: FC<IndividualTileTypes> = ({
  flowDetailItem,
  id,
  rating,
  name,
  image,
  creationDate,
  questionsAnswered,
  onPress,
  onPressDelete,
  style,
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const dispatch = useAppDispatch();
  const {userData} = useAppSelector(state => state.auth);
  const {deleteFormResponse} = useAppSelector(state => state.forms);

  const onPressDeleteFormResponse = () => {
    dispatch(
      deleteForm([
        flowDetailItem.flowId,
        0,
        {
          ids: [id],
          loggedInUserName: userData.userName,
        },
      ]),
    );
  };

  useEffect(() => {
    if (deleteFormResponse) {
      dispatch(resetDeleteFormResponse());
    }
  }, [deleteFormResponse]);

  useEffect(() => {
    return () => {
      setIsPressed(false);
    };
  }, [isPressed]);

  return (
    <TouchableOpacity
      onPress={() => {
        setIsPressed(true);
        onPress();
      }}
      key={name}
      style={{
        width: '100%',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#F4C24A',
        height: normaliseDesigns(60),
        justifyContent: 'space-between',
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 5,
        backgroundColor: isPressed ? '#FCEBC5' : colors.backgroundColor,
        ...style,
      }}>
      <View
        style={{
          flexDirection: 'row',
          padding: 8,
          backgroundColor: '#EAF1FE',
          borderRadius: 10,
          alignSelf: 'flex-start',
          alignItems: 'center',
          justifyContent: 'center',
          width: '13%',
        }}>
        <Text size="small1" fontVariant="bold">
          {rating}
        </Text>
        <Icon style={{marginLeft: 5}} name="star_icon" width={10} />
      </View>
      <View style={{width: '85%', paddingRight: 10, paddingLeft: 10}}>
        <Text fontVariant="bold" size="body1">
          {name}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            justifyContent: 'space-between',
            marginTop: 7,
          }}>
          <View>
            <Text size="verysmall3" opacity="0.50">
              Creation Date
            </Text>
            <Text size="small3">{creationDate}</Text>
          </View>
          <View>
            <Text size="verysmall3" opacity="0.50">
              Questions Answered
            </Text>
            <Text size="small3"> {questionsAnswered}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Render Profile Icon Component
type RenderProfileIconTypes = {
  image: string | null | undefined;
  name: string;
  size?: number;
};

export const RenderProfileIcon: FC<RenderProfileIconTypes> = ({
  image,
  name,
  size = 45, // Default size
}) => {
  if (image) {
    return (
      <FastImage
        style={{width: size, height: size, borderRadius: size / 2}}
        source={{
          uri: image,
          priority: FastImage.priority.normal,
        }}
        resizeMode={FastImage.resizeMode.cover}
        onError={() => console.log('Failed to load image')}
      />
    );
  } else {
    const initials = getInitials(name);
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#CBD2D9',
          width: size,
          height: size,
          borderRadius: size / 2,
        }}>
        <Text style={{fontSize: size / 2}}>{initials}</Text>
      </View>
    );
  }
};

// Individual Main Page Render
type IndividualMainPageRenderalTypes = {
  onPress: (item: IndividualResponse) => void;
  individualResponse: IndividualResponse[] | undefined;
  flowDetailItem: FlowDetailItem;
  totalQuestion: number;
};

export const IndividualMainPageRenderal: FC<
  IndividualMainPageRenderalTypes
> = ({onPress, individualResponse, flowDetailItem, totalQuestion}) => {
  return (
    <View>
      {individualResponse ? (
        individualResponse.length > 0 ? (
          individualResponse.map(item => (
            <IndividualTile
              rating={item.questionAvgRating || 0}
              creationDate={moment(item.responses[0].responseDate).format(
                'DD/MM/YYYY',
              )}
              onPress={() => onPress(item)}
              flowDetailItem={flowDetailItem}
              id={item.userId}
              key={item.userId}
              name={item.name}
              image={''}
              questionsAnswered={`${item.responses.length}/${totalQuestion}`}
              onPressDelete={() => {}}
            />
          ))
        ) : (
          <RenderEmptyPlaceholder />
        )
      ) : null}
    </View>
  );
};

// Render Rating Stars Component
type RatingProps = {
  rating: number;
};

export const RatingStars: FC<RatingProps> = ({rating}) => {
  const renderStars = () => {
    const stars = [];
    const maxStars = 5;
    const starSize = {width: 15, height: 15};

    for (let i = 0; i < maxStars; i++) {
      if (i < Math.floor(rating)) {
        stars.push(<Icon key={i} name="star_icon" {...starSize} />);
      } else if (i < rating) {
        stars.push(<Icon key={i} name="star_half_filled_icon" {...starSize} />);
      } else {
        stars.push(<Icon key={i} name="star_unfilled_icon" {...starSize} />);
      }
    }
    return stars;
  };

  return <View style={{flexDirection: 'row'}}>{renderStars()}</View>;
};

// Render Question and Answer Component
type RenderQuestionAndAnswerTypes = {
  index: number;
  question: string;
  answer: string;
  rating: number;
  indicators?: IndicatorIndividualResponse[];
};

const RenderQuestionAndAnswer: FC<RenderQuestionAndAnswerTypes> = ({
  index,
  question,
  answer,
  rating,
  indicators,
}) => (
  <View
    style={{
      borderBottomWidth: 1,
      borderBottomColor: '#CBD2D9',
      paddingVertical: 10,
    }}>
    <View>
      <View style={{flexDirection: 'row'}}>
        <Text style={{flex: 2}}>{index}.</Text>
        <Text style={{flex: 33}} size="body1">
          {question}
        </Text>
      </View>
      <View style={{flexDirection: 'row', marginTop: 5, alignItems: 'center'}}>
        <View style={{flex: 1}}>
          <Icon name="arrow_narrow_right" />
        </View>
        <Text style={{color: '#4E565F', flex: 17}} size="body1">
          {answer}
        </Text>
      </View>
      {rating && (
        <View
          style={{
            flexDirection: 'row',
            alignSelf: 'flex-end',
            alignItems: 'center',
          }}>
          <Text style={{color: '#4E565F', right: 10}} size="small1">
            Rating
          </Text>
          <Text
            style={{color: '#4E565F', right: 2.5}}
            size="small3"
            fontVariant="bold">
            {rating?.toFixed(1)}
          </Text>
          <Icon name="rating_star_display" width={15} height={15} />
        </View>
      )}
    </View>
    {/* {indicators &&
      indicators.map((item, index) => (
        <View key={index}>
          <Text size="small2">{item.indicatorName}</Text>
          <RatingInput
            disabled
            rating={item.avgRating || 0}
            label={''}
            size={15}
          />
        </View>
      ))} */}
  </View>
);

// Individual Description Render Component
type IndividualDescriptionRenderalTypes = {
  individualResponse: IndividualResponse | null;
  totalQuestion: number;
};

export const IndividualDescriptionRenderal: FC<
  IndividualDescriptionRenderalTypes
> = ({individualResponse, totalQuestion}) => {
  const {userData} = useAppSelector(state => state.auth);

  return (
    <View>
      {individualResponse ? (
        <>
          <View
            style={{
              backgroundColor: '#FCEBC5',
              padding: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
              borderRadius: 10,
              width: '100%',
              height: normaliseDesigns(115),
              marginTop: 5,
              marginBottom: 10,
            }}>
            <View style={{justifyContent: 'center'}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 5,
                }}>
                <RenderProfileIcon
                  image={individualResponse?.userImageUrl}
                  name={userData?.name || ''}
                  size={45}
                />
                {/* <View>
                  <Text fontVariant="bold">{individualResponse.name}</Text>
                  <View style={{flexDirection:"row"}}>
                    <RatingStars
                      rating={Number(individualResponse.questionAvgRating || 0)}
                    />
                     <View
                  style={{
                    width: 10,
                    // height: 0,
                    borderWidth: 1,
                    borderColor: '#ABB4BD', // Use borderColor to match the top border color
                    //opacity: 0, // Make the element invisible
                    transform: [{rotate: '90deg'}], // Rotate the element by 90 degrees
                  }}
                />
                <Text style={{paddingLeft: 5}}>
                  {`${
                    individualResponse.questionAvgRating?.toFixed(1) || 0
                  } / 5`}
                </Text>
                  </View>
                </View> */}

                <View style={{marginVertical: 10}}>
                  {/* User Name */}
                  <Text
                    fontVariant="bold"
                    style={{fontSize: 16, marginBottom: 5}}>
                    {individualResponse.name}
                  </Text>

                  {/* Row with RatingStars, Divider, and Rating Value */}
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {/* Rating Stars */}
                    <RatingStars
                      rating={Number(individualResponse.questionAvgRating || 0)}
                    />

                    {/* Divider */}
                    <View
                      style={{
                        width: 1, // Adjusted width to make a thin line
                        height: 20, // Set height to make it a proper divider
                        marginHorizontal: 10, // Space between stars and rating value
                        borderWidth: 1,
                        borderColor: '#ABB4BD', // Divider color
                        transform: [{rotate: '180deg'}], // Rotated 90 degrees to make it a vertical line
                      }}
                    />

                    {/* Rating Value */}
                    <Text style={{paddingLeft: 5, fontSize: 14}}>
                      {`${
                        individualResponse.questionAvgRating?.toFixed(1) || 0
                      } / 5`}
                    </Text>
                  </View>
                </View>
              </View>
              <View
                style={{
                  backgroundColor: '#FEF8EC',
                  padding: 10,
                  borderRadius: 10,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                }}>
                <Text fontVariant="bold">
                  {individualResponse.responses.length}/{totalQuestion}
                </Text>
                <Text size="small3" style={{marginLeft: 5, color: '#1F2933'}}>
                  Questions answered
                </Text>
              </View>
            </View>
            <Image
              name="response_card_icon"
              size={0.9}
              style={{alignSelf: 'flex-end'}}
            />
          </View>
          {individualResponse.responses.map((item, index) => (
            <RenderQuestionAndAnswer
              index={index + 1}
              question={item.questionText}
              answer={item.responseValues}
              rating={item.avgRating}
              indicators={item.indicators}
              key={index}
            />
          ))}
        </>
      ) : (
        <RenderEmptyPlaceholder />
      )}
    </View>
  );
};
