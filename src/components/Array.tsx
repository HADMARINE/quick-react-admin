import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react';
import ReactModal from 'react-modal';
import { Column, Table } from 'react-rainbow-components';
import { ContainerBase, containerFactory, DataTypes } from '..';
import Button from './assets/Button';
import { Text } from './assets/Text';
import { Flex } from './assets/Wrapper';

type Props = ContainerBase<any[]> & {
  dataTypes?: ReturnType<ReturnType<typeof containerFactory>>;
};

const ArrayColumn = (data: any) => {
  const [modalIsOpen, setIsModalIsOpen] = useState<boolean>(false);
  const value = data?.value;
  if (!value) return <div>Data is null</div>;

  return (
    <div>
      <Button
        height={'20px'}
        width={'50px'}
        style={{
          marginLeft: '6px',
        }}
        onClick={() => setIsModalIsOpen(!modalIsOpen)}>
        <Text fontSize={'14px'}>Details</Text>
      </Button>
      <ReactModal
        isOpen={modalIsOpen}
        onRequestClose={() => setIsModalIsOpen(false)}>
        <Table
          keyField={'id'}
          data={(value as any[]).map((v, i) => ({ id: i, value: v }))}>
          <Column header={'Index'} field={'id'} />
          <Column header={'Value'} field={'value'} />
        </Table>
      </ReactModal>
    </div>
  );
};

const ArrayDetails = (props: {
  data: any[];
  dataTypes?: ReturnType<ReturnType<typeof containerFactory>>;
  onChange: (e: React.ChangeEvent<any>) => void;
}) => {
  const valueExisting = props.data;

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  return (
    <>
      <ReactModal
        isOpen={isEditModalOpen}
        onRequestClose={() => setIsEditModalOpen(false)}>
        <Flex vertical fitParent>
          <Flex right flex={1} fitParent>
            <Button
              onClick={() => setIsEditModalOpen(false)}
              variant={'transparent'}
              width={'20px'}
              height={'20px'}>
              <FontAwesomeIcon icon="fa-solid fa-xmark" />
            </Button>
          </Flex>
          <Flex vertical left fitParent flex={9}>
            {props.data.map((v, i) => {
              return (
                <Flex center left key={`ArrayDetails_Iteration_${i}`}>
                  {i} :
                  {(props.dataTypes || DataTypes.string()).func({
                    isChanging: true,
                    onChange: (e) => {
                      valueExisting[i] = e.target.value;
                      return props.onChange({
                        ...e,
                        target: { ...e.target, value: valueExisting },
                      });
                    },
                    value: v,
                  })}
                </Flex>
              );
            })}
          </Flex>
        </Flex>
      </ReactModal>
      <Button
        width={'50px'}
        height={'20px'}
        onClick={() => setIsEditModalOpen(!isEditModalOpen)}>
        <Text fontSize="14px">Unfold</Text>
      </Button>
    </>
  );
};

const ArrayContainer = (props: Props) => {
  return props.isChanging ? (
    <Flex width={'70%'} horizontal flex={1}>
      {props.value ? (
        <ArrayDetails
          data={props.value}
          dataTypes={props.dataTypes}
          onChange={props.onChange}
        />
      ) : (
        <>Data NULL</>
      )}
    </Flex>
  ) : (
    <Column
      sortable={props.sortable || false}
      header={props.title}
      field={props.key}
      component={ArrayColumn}
    />
  );
};

export default ArrayContainer;
