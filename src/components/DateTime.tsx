import React from 'react';
import { Flex } from './assets/Wrapper';
import { ContainerBase } from '..';
import { Column, Input } from 'react-rainbow-components';
import moment from 'moment';

type Props = ContainerBase<Date>;

const DateTimeContainer = (props: Props) => {
  return props.isChanging ? (
    <Flex width={'70%'} horizontal flex={1}>
      <Input
        onChange={(e) => {
          e.target.value = moment(e.target.value)
            .local()
            .format('YYYY-MM-DD[T]HH:mm:ss');
          props.onChange(e);
        }}
        // value={moment(props.value).local().format('YYYY-MM-DD[T]HH:mm:ss')}
        value={props.value as any}
        variant={'default'}
        style={{ flex: 1 }}
        error={props.error || undefined}
        type={'datetime-local'}
      />
    </Flex>
  ) : (
    <Column
      sortable={props.sortable || true}
      header={props.title}
      field={props.key}
      component={(v: any) => (
        <>
          {moment(
            v.value[v.value.length - 1] === 'Z' ? v.value : v.value + '+00:00',
          )
            .local()
            .format('YYYY-MM-DD HH:mm:ss [(Local Time)]')}
        </>
      )}
    />
  );
};

export default DateTimeContainer;
