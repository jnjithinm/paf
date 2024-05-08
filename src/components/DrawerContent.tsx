import {
    DrawerContentScrollView,
    DrawerItemList,
  } from '@react-navigation/drawer';
  
  function DrawerContent(props) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    );
  }

  export default DrawerContent;