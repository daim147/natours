import { useMemo } from 'react';
import { bindActionCreators } from 'redux';
import { actionCreator } from '../store';
import { useAppDispatch } from './useAppDispatch';
export const useActions = () => {
	const dispatch = useAppDispatch();
	return useMemo(() => bindActionCreators(actionCreator, dispatch), [dispatch]);
};
