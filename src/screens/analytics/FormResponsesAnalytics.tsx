import React, {FC, useCallback, useEffect, useState} from 'react';

import {RouteProp, useFocusEffect} from '@react-navigation/native';
import {StackNavigationProp} from '@react-navigation/stack';

import Layout from '../../components/Layout';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import SearchWithFilter from '../../components/SearchWithFilter';
import {resetAssignFormResponse} from '../../redux/features/formsSlice';
import {AnalyticsStackParamList} from '../../navigation/AnalyticsStack';
import {getFormAnalytics} from '../../redux/features/analyticsSlice';
import {RenderTaskItem} from '../flowsAndForms/EvaluationForm';

type FormResponsesAnalyticsNavigationProp = StackNavigationProp<
  AnalyticsStackParamList,
  'FormResponsesAnalytics'
>;
type FormResponsesAnalyticsRouteProp = RouteProp<
  AnalyticsStackParamList,
  'FormResponsesAnalytics'
>;

interface FormResponsesAnalyticsScreenProps {
  navigation: FormResponsesAnalyticsNavigationProp;
  route: FormResponsesAnalyticsRouteProp;
}

const FormResponsesAnalytics: FC<FormResponsesAnalyticsScreenProps> = ({
  navigation,
  route,
}) => {
  const {flowDetailItem} = route.params;
  const {formAnalytics} = useAppSelector(state => state.analytics);

  const {userData} = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getFormAnalytics([flowDetailItem.formId, flowDetailItem.flowId]));
  }, []);

  return (
    <>
      <Layout
        overridePaddingHorizontal
        overridePaddingVertical
        style={{paddingHorizontal: 15}}
        title={flowDetailItem.formName}>
        <SearchWithFilter
          onTextChange={text => {}}
          onProceed={() => {}}
          filterNotNeeded
        />

        {formAnalytics?.map((item, index) => (
          <RenderTaskItem
            index={index}
            key={index}
            question={item.questionText}
            isRequired={false}
            // isRequired={item.isRequired}
            renderSelection={<></>}
          />
        ))}
      </Layout>
    </>
  );
};
export default FormResponsesAnalytics;
