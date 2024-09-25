import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Platform,
} from 'react-native';
import WebView from 'react-native-webview';
import FusionCharts from '../../utils/fusioncharts'; // Import the FusionCharts configuration
import colors from '../../config/colors';
import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';
import Layout from '../../components/Layout';
import {Drawer} from 'react-native-drawer-layout';
import DrawerContent from '../../components/DrawerContent';
import {AnalyticsCountTile} from './UserAndRoleAnalyticsMainPage';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import Text from '../../components/Text';
import {
  Area,
  District,
  getAreas,
  getDistricts,
  getSchools,
  getStates,
  getStatesDistrictSchool,
  SchoolType,
  State,
} from '../../redux/features/analyticsSlice';
import { normaliseDesigns } from '../../utils/helpers/responsiveHelpers';

type LocationAnalyticsNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'LocationAnalytics'
>;
type LocationAnalyticsRouteProp = RouteProp<
  AnalyticsStackParamList,
  'LocationAnalytics'
>;

interface LocationAnalyticsScreenProps {
  navigation: LocationAnalyticsNavigationProp;
  route: LocationAnalyticsRouteProp;
}

// const IndiaMap = () => {
//   const chartRef = useRef<WebView>(null);
//   const dataSource = {
//     type: 'maps/india',
//     renderAt: 'chart-container',
//     width: '100%',
//     height: '400',
//     dataFormat: 'json',

//     dataSource: {
//       chart: {
//         caption: 'India Map',
//         theme: 'fusion',
//         formatNumberScale: '0',
//       },
//       colorrange: {
//         minvalue: '0',
//         code: '#FFE0B2',
//         gradient: '1',
//         color: [
//           {
//             minvalue: '0.5',
//             maxvalue: '1.0',
//             color: '#FFD74D',
//           },
//           {
//             minvalue: '1.0',
//             maxvalue: '2.0',
//             color: '#FB8C00',
//           },
//           {
//             minvalue: '2.0',
//             maxvalue: '3.0',
//             color: '#E65100',
//           },
//         ],
//       },
//       data: [
//         {
//           id: '001',
//           value: '.82',
//           showLabel: '1',
//         },
//         {
//           id: '002',
//           value: '1.04',
//           showLabel: '1',
//         },
//         // Add more states...
//       ],
//     },
//   };

//   useEffect(() => {
//     if (chartRef.current) {
//       chartRef.current.postMessage(JSON.stringify(dataSource));
//     }
//   }, [dataSource]);

//   return (
//     <View style={styles.container}>
//       <WebView
//         ref={chartRef}
//         originWhitelist={['*']}
//         source={
//           Platform.OS === 'android'
//             ? {uri: '/Users/apple/Documents/paf/src/assets/fusioncharts.html'}
//             : require('/Users/apple/Documents/paf/src/assets/fusioncharts.html')
//         }
//         javaScriptEnabled={true}
//         domStorageEnabled={true}
//         onMessage={event => {
//           console.log(event.nativeEvent.data);
//         }}
//       />
//     </View>
//   );
// };

type SchoolList = {
  totalCount: number;
  schoolList: SchoolType[] | undefined;
  count: number | undefined;
  selectedTab: 'all' | boolean;
};

const LocationAnalytics: React.FC<LocationAnalyticsScreenProps> = ({
  navigation,
  route,
}) => {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [statesList, setStatesList] = useState<State[]>();
  const [districtList, setDistrictList] = useState<District[]>();
  const [areatList, setAreaList] = useState<Area[]>();

  const [first, setFirst] = useState<any>();

  const [schoolList, setSchoolList] = useState<SchoolList>({
    schoolList: [],
    count: 0,
    selectedTab: 'all',
  });
  const handleLocationPress = (location: string) => {
    setSelectedLocation(location);
  };

  const dispatch = useAppDispatch();
  const {states, districts, areas, statesDistrictSchool} = useAppSelector(
    state => state.analytics,
  );
  useEffect(() => {
    dispatch(
      getStatesDistrictSchool({
        area: null,
        district: null,
        school: null,
      }),
    );
  }, []);

  console.log(
    'statesDistrictSchool',
    statesDistrictSchool?.dataList?.totalDistrictCount[0],
  );

  useEffect(() => {
    if (states) {
      setStatesList(states?.dataList);
    }
  }, [states]);

  useEffect(() => {
    dispatch(
      getStates({
        page: 0,
        size: 0,
        type: 'all',
      }),
    );
  }, []);

  useEffect(() => {
    if (districts) {
      setDistrictList(districts.dataList);
    }
  }, [districts]);

  useEffect(() => {
    dispatch(
      getDistricts({
        page: 0,
        size: 0,
        type: 'all',
      }),
    );
  }, []);

  useEffect(() => {
    if (areas) {
      setAreaList(areas.dataList);
    }
  }, [areas]);

  useEffect(() => {
    dispatch(
      getAreas({
        page: 0,
        size: 0,
        type: 'all',
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(
      getSchools({
        page: 0,
        size: 0,
        type: 'all',
      }),
    );
  }, []);

  const closeModal = () => {
    setSelectedLocation(null);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };

  useEffect(() => {
    if (
      statesDistrictSchool &&
      statesDistrictSchool.dataList?.locationAnalytics
    ) {
      let locationAnalyticsData = JSON.stringify(
        statesDistrictSchool.dataList?.locationAnalytics,
      );
      let htmlContent = `
        <html>
   <head>
      <script type="text/javascript" src="https://www.gstatic.com/charts/loader.js"></script>
      <script type="text/javascript">
         google.charts.load('current', {
           packages: ['geochart'],
           mapsApiKey: 'YOUR_GOOGLE_MAPS_API_KEY' // Optional if needed
         });
         google.charts.setOnLoadCallback(drawChart);
         
         function drawChart() {
           var data = google.visualization.arrayToDataTable(
             ${locationAnalyticsData}
           );
         
           var options = {
         
         colorAxis: { colors: ['#F7D178', '#F7D178']  }, // Color gradient
         legend:'none',
         region: 'IN',  // Display the map of India
         
         displayMode: 'regions',  // Highlight regions (states in India)
         
         resolution: 'provinces'  // Province level for states in India
         
         };
         
         
         
         var chart = new google.visualization.GeoChart(document.getElementById('geochart'));
         
         
         
         chart.draw(data, options);
         
         }
         
      </script>
   </head>
   <body>
      <div id="geochart" style="width: 100%; height: 100%;"></div>
   </body>
</html>
      `;

      console.log(
        htmlContent,
        statesDistrictSchool?.dataList?.locationAnalytics,
        'htmlContent',
      );

      setFirst(htmlContent);
    }
  }, [
    statesDistrictSchool && statesDistrictSchool.dataList?.locationAnalytics,
  ]);

  return (
    <Drawer
      open={isDrawerOpen}
      onOpen={() => setIsDrawerOpen(true)}
      onClose={() => setIsDrawerOpen(false)}
      renderDrawerContent={() => (
        <DrawerContent closeDrawer={() => setIsDrawerOpen(false)} />
      )}>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        onPressBellIcon={() => navigation.navigate('Notifications')}
        onPressMenuIcon={() => setIsDrawerOpen(true)}
        focusedStack="AnalyticsStack"
        avoidBackButton
        dashboard>
        <Text
          size="body4"
          fontVariant="bold"
          style={{marginBottom: 10, marginTop: 30}}>
          Location Analytics
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: 10,
          }}>
          <AnalyticsCountTile
            text={'Total Districts'}
            color={'green'}
            count={statesDistrictSchool?.dataList?.totalDistrictCount || 0}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Total Area'}
            color={'orange'}
            count={Number(statesDistrictSchool?.dataList?.totalAreaCount || 0)}
            onPress={() => {}}
          />
          <AnalyticsCountTile
            text={'Total Schools'}
            color={'red'}
            count={Number(
              statesDistrictSchool?.dataList?.totalSchoolCount || 0,
            )}
            onPress={() => {}}
          />
        </View>
        {/* <View
            style={{ height:normaliseDesigns(350), width: '100%', backgroundColor: 'pink',borderWidth:1}}>
            <WebView
              originWhitelist={['*']}
              source={{html: first}}
            />
          </View> */}
        <View style={styles.container}>
        
          <Modal
            visible={selectedLocation !== null}
            transparent
            animationType="slide">
            <View style={styles.modalOverlay}>
              <View style={styles.modalContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}>
                  <Text style={styles.closeButtonText}>X</Text>
                </TouchableOpacity>
                <Text style={styles.modalText}>
                  {selectedLocation} in zoomed view
                </Text>
              </View>
            </View>
          </Modal>
        </View>
      </Layout>
    </Drawer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"red"
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: colors.backgroundColor,
    padding: 20,
    borderRadius: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  closeButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalText: {
    marginTop: 30,
    fontSize: 16,
    textAlign: 'center',
  },
  tooltip: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
  },
});

export default LocationAnalytics;
