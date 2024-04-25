import React from 'react';

const ShowBottomSheetContext = React.createContext({
  bottomSheetStatus: true,
  changeBottomSheetStatus: () => {},
});

export default ShowBottomSheetContext;
