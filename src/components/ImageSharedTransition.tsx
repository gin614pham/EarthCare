import {SharedTransition, withTiming} from 'react-native-reanimated';

const transition = SharedTransition.custom(value => {
  'worklet';
  return {
    originX: withTiming(value.targetOriginX, {duration: 3000}),
    originY: withTiming(value.targetOriginY, {duration: 3000}),
    width: withTiming(value.targetWidth, {duration: 3000}),
    height: withTiming(value.targetHeight, {duration: 3000}),
  };
});

export default transition;
