import React, { useCallback, useEffect, useState } from 'react';
import {
  AdminTableGetApi,
  ContainerBase,
  ContainerTypes,
  ExclusiveContainerBase,
  PreferencesContainerBase,
} from '.';
import Color, { KeyColor } from './components/assets/Color';
import { Flex, FlexSpacer } from './components/assets/Wrapper';
import { Text } from './components/assets/Text';
import { Margin } from './components/assets/Format';
import ReactModal from 'react-modal';

import {
  Button,
  ButtonMenu,
  Column,
  Input,
  MenuItem,
  Option,
  Pagination,
  Picklist,
  Table,
} from 'react-rainbow-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisV,
  faSyncAlt,
  faSearch,
  faPlus,
  faTimes,
  faSearchMinus,
  faPlusCircle,
} from '@fortawesome/free-solid-svg-icons';
import _ from 'lodash';
import toast, { Toaster } from 'react-hot-toast';
import { Portal } from 'react-portal';
import { useDebounce } from 'use-debounce';
import moment from 'moment';
import { useIsMount } from './utils/hooks/useIsMount';

export interface Props<
  T extends Record<
    string,
    {
      pref: PreferencesContainerBase & { containerType: ContainerTypes };
      func: (arg0: ExclusiveContainerBase<any>) => JSX.Element;
    }
  >,
> {
  contents: T;
  getApi: AdminTableGetApi<{
    [P in keyof T]: T[P] extends ContainerBase<infer U> ? U : any;
  }>;
  postApi?: (data: {
    data: Record<string, any>;
  }) => Promise<{ result: boolean; message?: string }>;
  patchApi?: (data: {
    data: Record<string, any>;
    docId: string;
  }) => Promise<{ result: boolean; message?: string }>;
  deleteApi?: (data: {
    docId: string;
  }) => Promise<{ result: boolean; message?: string }>;
  title?: string;
  colorSettings?: { keyColor: string; backgroundColor: string };
}

type ApiType = ThenArgRecursive<
  ReturnType<AdminTableGetApi<Record<string, any>>>
>;

const getPaginationCount = (length: number, limit: number) => {
  return Math.ceil(length / limit);
};

const getVacantKey = (
  _query: Record<string, any>,
  contents: Record<string, any>,
): string | null => {
  const queryKeys = Object.keys(_query);
  for (const key of Object.keys(contents)) {
    if (queryKeys.indexOf(key) === -1) {
      return key as string;
    }
  }
  return null;
};

const limitHistory = [0, 0];

const _AdminTable = <T extends Record<string, any>>(props: Props<T>) => {
  const isMount = useIsMount();

  const [data, setData] = useState<ApiType>();
  const [isLoading, setIsLoading] = useState(false);
  const [isQueryTabOpen, setIsQueryTabOpen] = useState(false);

  const [pageIdx, setPageIdx] = useState(0);
  const [limit, setLimit] = useState(10);

  const [modifyIdx, setModifyIdx] = useState(-1);
  const [deleteIdx, setDeleteIdx] = useState(-1);
  const [isCreateEnabled, setIsCreateEnabled] = useState(false);
  const [modalFormData, setModalFormData] = useState<Record<string, any>>({});
  const [debouncedModalFormData] = useDebounce(modalFormData, 500);

  const [modifyError, setModifyError] = useState<Record<string, string>>({});

  const [sort, setSort] = useState<
    { target: string; direction: 'asc' | 'desc' } | undefined
  >(undefined);
  const [query, setQuery] = useState<Record<string, string | undefined>>();

  const [vacantKey, setVacantKey] = useState(
    getVacantKey(query || {}, props.contents),
  );

  const colorSettings = props.colorSettings || {
    keyColor: 'black',
    backgroundColor: 'white',
  };

  useEffect(() => {
    setVacantKey(getVacantKey(query || {}, props.contents));
    return () => {
      return;
    };
  }, [query]);

  const apiRequest = async () => {
    setIsLoading(true);
    setData(undefined);
    const getApiProps: Parameters<AdminTableGetApi<any>>[0] = {
      skip: pageIdx * limit,
      limit,
      order: sort,
    };
    if (isQueryTabOpen) {
      const finalQuery: Record<string, any> = {};
      for (const __ of Object.entries(query || {})) {
        const [__k, __v] = __;
        if (__v) {
          finalQuery[__k] = __v;
        }
      }
      getApiProps.query = finalQuery;
    }

    const res = await props.getApi(getApiProps);
    if (!res.result) {
      toast.error('Failed to fetch data');
    }
    setData(res);
    setIsLoading(false);
  };

  const apiRequestDebounce = useCallback(_.debounce(apiRequest, 500), []);

  useEffect(() => {
    if (isMount) return;
    // check modifyIdx and deleteIdx are -1
    if (modifyIdx * deleteIdx !== 1) {
      return;
    }

    apiRequest();
    return () => {
      return;
    };
  }, [modifyIdx, deleteIdx, isCreateEnabled]);

  useEffect(() => {
    apiRequest();
  }, [pageIdx, sort?.target, sort?.direction, isQueryTabOpen]);

  useEffect(() => {
    if (isMount) return;
    apiRequestDebounce();
    return () => {
      return;
    };
  }, [query]);

  useEffect(() => {
    if (isMount) return;
    limitHistory[1] = limitHistory[0];
    limitHistory[0] = limit;

    setPageIdx(Math.floor((pageIdx * limitHistory[1]) / limit));

    apiRequest();
    return () => {
      return;
    };
  }, [limit]);

  useEffect(() => {
    setPageIdx(0);
    return () => {
      return;
    };
  }, [sort]);

  useEffect(() => {
    for (const __ of Object.entries(modalFormData)) {
      const [__key, __value] = __;
      if (!props.contents[__key]?.pref?.verifier) continue;
      const e = props.contents[__key].pref.verifier(__value);
      if (e) {
        setModifyError({ ..._.omit(modifyError, [__key]), [__key]: e });
      } else {
        setModifyError(_.omit(modifyError, [__key]));
      }
    }
    return () => {
      return;
    };
  }, [debouncedModalFormData]);

  const AdditionalMenu = (_props: any) => {
    const { index } = _props;
    return (
      <ButtonMenu
        id="additional-menu"
        menuAlignment="right"
        menuSize="x-small"
        icon={<FontAwesomeIcon icon={faEllipsisV} />}
        buttonVariant="base"
        className="rainbow-m-left_xx-small">
        {props.patchApi && (
          <MenuItem label="Edit" onClick={() => setModifyIdx(index)} />
        )}
        {props.deleteApi && (
          <MenuItem label="Delete" onClick={() => setDeleteIdx(index)} />
        )}
      </ButtonMenu>
    );
  };

  const handleSort = (_e: any, field: string, direction: string) => {
    setSort({ target: field, direction: direction as 'asc' | 'desc' });
  };

  return (
    <>
      <Flex vertical>
        <Flex horizontal width={'100%'}>
          <Flex flex={1} left>
            <KeyColor>
              <Text fontSize={'24px'} fontWeight={900}>
                {props.title}
              </Text>
            </KeyColor>
          </Flex>
          <Flex right style={{ alignItems: 'flex-end' }}>
            <Picklist
              onChange={(value) =>
                setLimit(
                  parseInt((value?.name as string | undefined) || '10', 10),
                )
              }
              style={{ width: '100px' }}
              value={{ name: limit.toString(), label: limit.toString() }}
              label={'Row per page'}>
              {[
                '1',
                '5',
                '10',
                '20',
                '30',
                '40',
                '50',
                '60',
                '70',
                '80',
                '90',
                '100',
              ].map((v) => (
                <Option key={`PickListOption_${v}`} name={v} label={v} />
              ))}
            </Picklist>
            <Margin horizontal={'20px'} />
            {props.postApi && (
              <>
                <Button
                  variant={'base'}
                  style={{ marginBottom: '2px', width: '40px', height: '40px' }}
                  onClick={() => setIsCreateEnabled(true)}>
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    color={colorSettings.keyColor}
                  />
                </Button>
                <Margin horizontal={'20px'} />
              </>
            )}
            <Button
              variant={'base'}
              style={{ marginBottom: '2px', width: '40px', height: '40px' }}
              onClick={() => setIsQueryTabOpen(!isQueryTabOpen)}>
              <FontAwesomeIcon
                icon={!isQueryTabOpen ? faSearch : faSearchMinus}
                color={colorSettings.keyColor}
              />
            </Button>
            <Margin horizontal={'20px'} />
            <Button
              onClick={() => {
                setPageIdx(0);
                apiRequest();
              }}
              style={{ marginBottom: '2px', width: '40px', height: '40px' }}
              variant={'base'}>
              <FontAwesomeIcon
                icon={faSyncAlt}
                color={colorSettings.keyColor}
              />
            </Button>
            <Margin horizontal={'10px'} />
          </Flex>
        </Flex>
        <Margin vertical={'10px'} />
        {isQueryTabOpen && (
          <Flex
            width={'100%'}
            style={{
              border: '1px solid gray',
              borderRadius: '5px',
              padding: '20px 5px 20px 5px',
            }}
            vertical>
            <Flex width={'100%'} left>
              <KeyColor
                style={{
                  fontSize: '20px',
                  marginLeft: '10px',
                  fontWeight: 500,
                }}>
                Precise Search
              </KeyColor>
            </Flex>
            <Margin vertical={'20px'} />
            {Object.entries(query || {}).map(([_k]) => (
              <Flex width={'100%'} horizontal key={`AdminTable_search_${_k}`}>
                <Picklist
                  onChange={(value) => {
                    setQuery({
                      ..._.omit(query, [_k]),
                      [value.name as string]: undefined,
                    });
                  }}
                  style={{ flex: 1, margin: '10px' }}
                  value={{
                    name: _k,
                    label: `${_k[0].toUpperCase()}${_k.slice(1)}`,
                  }}>
                  {Object.keys(props.contents).map((v) => {
                    if (Object.keys(query || {}).indexOf(v) !== -1) return;
                    return (
                      <Option
                        key={`PickListOption_search_${v}`}
                        name={v}
                        label={`${[v[0].toUpperCase()]}${v.slice(1)}`}
                      />
                    );
                  })}
                </Picklist>
                <Input
                  style={{ flex: 2 }}
                  onChange={(e) => {
                    setQuery({ ...query, [_k]: e.target.value });
                  }}
                  value={(query || {})[_k]}
                />
                <Button
                  variant={'neutral'}
                  style={{ width: '40px', height: '40px', margin: '10px' }}
                  onClick={() => {
                    setQuery({ ..._.omit(query, [_k]) });
                  }}>
                  <FontAwesomeIcon
                    icon={faTimes}
                    color={colorSettings.keyColor}
                  />
                </Button>
              </Flex>
            ))}
            {vacantKey && (
              <Flex width={'100%'} horizontal center>
                {/* <FlexSpacer flex={1} /> */}
                <Button
                  variant={'border'}
                  onClick={() => {
                    setQuery({
                      ...query,
                      [vacantKey]: undefined,
                    });
                    setVacantKey(getVacantKey(query || {}, props.contents));
                  }}>
                  <KeyColor>
                    <FontAwesomeIcon
                      icon={faPlus}
                      color={colorSettings.keyColor}
                    />
                  </KeyColor>
                </Button>
                {/* <FlexSpacer flex={3.5} /> */}
              </Flex>
            )}
          </Flex>
        )}
        <Margin vertical={'10px'} />
        <Color.key>
          <Flex horizontal>
            <Table
              keyField="_id"
              data={data?.data}
              isLoading={isLoading}
              onSort={handleSort}
              sortDirection={sort?.direction}
              sortedBy={sort?.target}>
              {Object.entries(
                props.contents as Record<
                  string,
                  {
                    func: (__props: ExclusiveContainerBase<any>) => JSX.Element;
                    pref: Omit<
                      ContainerBase<any>,
                      keyof ExclusiveContainerBase<any>
                    >;
                  }
                >,
              ).map(([k, v]) => {
                return v.func({
                  isChanging: false,
                  onChange: (e: any) => {
                    setModalFormData({ ...modalFormData, [k]: e.target.value });
                  },
                  key: k,
                  error: modifyError[k],
                });
              })}
              <Column field={'status'} component={AdditionalMenu} width={60} />
            </Table>
          </Flex>
          <Margin vertical={'10px'} />
          <Pagination
            pages={getPaginationCount(data?.length || 0, limit)}
            onChange={(_e, page) => setPageIdx(page - 1)}
            activePage={pageIdx + 1}
            variant={'shaded'}
          />
        </Color.key>
      </Flex>
      <ReactModal
        isOpen={modifyIdx !== -1}
        onRequestClose={() => {
          setModifyIdx(-1);
        }}
        onAfterOpen={() => {
          const modifyFormStack: Record<string, any> = {};
          [...Object.keys(props.contents || {}), '_id'].forEach((key) => {
            const value = data?.data?.[modifyIdx][key];
            if (props.contents[key]?.pref?.containerType === 'datetime') {
              modifyFormStack[key] = moment(value)
                .local()
                .format('YYYY-MM-DD[T]HH:mm:ss');
            } else if (props.contents[key]?.pref?.containerType === 'date') {
              modifyFormStack[key] = moment(value).local().format('YYYY-MM-DD');
            } else {
              modifyFormStack[key] = value;
            }
          });
          setModalFormData(modifyFormStack);
        }}
        closeTimeoutMS={200}
        ariaHideApp={false}>
        <Flex vertical fitParent>
          <Flex vertical flex={9} width={'100%'}>
            <Text fontSize="24px">
              <Color.key>Modification</Color.key>
            </Text>
            <Margin vertical={'50px'} />
            {Object.entries(modalFormData).map(([key, value]) => {
              if (props.contents[key]?.pref?.editable === false) {
                return;
              }
              if (!props.contents[key]) return;
              return (
                <Flex
                  horizontal
                  key={`AdminTable_reactmodal_iter_${key}`}
                  width={'100%'}
                  style={{ marginTop: '20px', alignItems: 'flex-start' }}>
                  <FlexSpacer flex={1} />
                  <Flex width={'100px'} style={{ marginTop: '8px' }}>
                    <Color.key>{props.contents[key]?.pref?.title}</Color.key>
                  </Flex>
                  <Flex flex={20}>
                    {props.contents[key].func({
                      value,
                      isChanging: true,
                      error: modifyError[key],
                      onChange: (e: any) => {
                        setModalFormData({
                          ...modalFormData,
                          [key]: e.target.value,
                        });
                      },
                    })}
                  </Flex>
                  <FlexSpacer flex={1} />
                </Flex>
              );
            })}
          </Flex>
          <FlexSpacer flex={1} />
          <Flex horizontal>
            <Button
              variant={'border'}
              onClick={() => {
                if (Object.keys(modifyError).length) {
                  toast.error('Failed to save! Some values are invalid.');
                  return;
                }

                const dat: Record<string, any> = {};

                const whitelistKeys = Object.keys(props.contents);
                Object.entries(modalFormData).forEach(([k, v]) => {
                  if (whitelistKeys.indexOf(k) !== -1) {
                    if (props.contents[k].pref.containerType === 'datetime') {
                      dat[k] = moment
                        .utc(moment(v))
                        .format('YYYY-MM-DD[T]HH:mm:ss');
                    } else if (
                      props.contents[k].pref.containerType === 'number'
                    ) {
                      dat[k] = parseFloat(v);
                    } else {
                      dat[k] = v;
                    }
                  }
                });

                // eslint-disable-next-line no-unused-expressions
                props.patchApi &&
                  props
                    .patchApi({ data: dat, docId: modalFormData._id })
                    .then((v) => {
                      if (v.result) {
                        setModifyIdx(-1);
                        toast.success('Modified successfully!');
                      } else {
                        toast.error(
                          `Failed to modify document${
                            v.message ? ` - ${v.message}` : ''
                          }`,
                        );
                      }
                    });
              }}>
              Save
            </Button>
            <Margin horizontal={'20px'} />
            <Button variant={'border'} onClick={() => setModifyIdx(-1)}>
              Cancel
            </Button>
          </Flex>

          <FlexSpacer flex={0.5} />
        </Flex>
      </ReactModal>
      <ReactModal
        isOpen={deleteIdx !== -1}
        onRequestClose={() => {
          setDeleteIdx(-1);
        }}
        onAfterOpen={() => {
          const modifyFormStack: Record<string, any> = {};
          Object.entries(data?.data?.[deleteIdx] || {}).forEach(
            ([key, value]) => {
              modifyFormStack[key] = value;
            },
          );
          setModalFormData(modifyFormStack);
        }}
        closeTimeoutMS={200}
        ariaHideApp={false}>
        <Flex vertical center fitParent>
          <Flex vertical flex={9} width={'100%'}>
            <Text fontSize="24px">
              <Color.key>Deletion</Color.key>
            </Text>
            <Margin vertical={'50px'} />
            {deleteIdx !== -1 && (
              <Table
                keyField={'_id'}
                data={data?.data && [data?.data[deleteIdx]]}>
                {Object.entries(modalFormData).map(([key, value]) => {
                  if (!props.contents[key]) return;

                  const column = props.contents[key].func({
                    value,
                    isChanging: false,
                    key,
                    onChange: () => undefined,
                  });

                  return column;
                })}
              </Table>
            )}
          </Flex>
          <div style={{ flex: 1, minHeight: '20px' }} />
          <Flex horizontal>
            <Button
              variant={'border'}
              onClick={() => {
                const dat: Record<string, any> = {};

                const whitelistKeys = Object.keys(props.contents);
                Object.entries(modalFormData).forEach(([k, v]) => {
                  if (whitelistKeys.indexOf(k) !== -1) {
                    dat[k] = v;
                  }
                });
                // eslint-disable-next-line no-unused-expressions
                props.deleteApi &&
                  props
                    .deleteApi({ docId: data?.data?.[deleteIdx]._id })
                    .then((v) => {
                      if (v.result) {
                        setDeleteIdx(-1);
                        toast.success('Deleted successfully!');
                      } else {
                        toast.error(
                          `Failed to delete document${
                            v.message && ` - ${v.message}`
                          }`,
                        );
                      }
                    });
              }}>
              Delete
            </Button>
            <Margin horizontal={'20px'} />
            <Button variant={'border'} onClick={() => setDeleteIdx(-1)}>
              Cancel
            </Button>
          </Flex>

          <FlexSpacer flex={0.5} />
        </Flex>
      </ReactModal>
      <ReactModal
        isOpen={isCreateEnabled}
        onRequestClose={() => setIsCreateEnabled(false)}
        onAfterOpen={() => {
          const createFormStack: Record<string, any> = {};
          Object.entries(props.contents || {}).forEach(([key, _value]) => {
            if (props.contents[key]?.pref?.containerType === 'datetime') {
              createFormStack[key] = moment(0)
                .local()
                .format('YYYY-MM-DD[T]HH:mm:ss');
            } else {
              createFormStack[key] = '';
            }
          });
          setModalFormData(createFormStack);
        }}
        closeTimeoutMS={200}
        ariaHideApp={false}>
        <Flex vertical fitParent>
          <Flex vertical flex={9} width={'100%'}>
            <Text fontSize="24px">
              <Color.key>Creation</Color.key>
            </Text>
            <Margin vertical={'50px'} />
            {Object.entries(modalFormData).map(([key, value]) => {
              if (props.contents[key]?.pref?.editable === false) {
                return;
              }
              if (!props.contents[key]) return;
              return (
                <Flex
                  horizontal
                  key={`AdminTable_reactmodal_iter_${key}`}
                  width={'100%'}
                  style={{ marginTop: '20px', alignItems: 'flex-start' }}>
                  <FlexSpacer flex={1} />
                  <Flex width={'100px'} style={{ marginTop: '8px' }}>
                    <Color.key>{props.contents[key]?.pref?.title}</Color.key>
                  </Flex>
                  <Flex flex={20}>
                    {props.contents[key].func({
                      value,
                      isChanging: true,
                      error: modifyError[key],
                      onChange: (e: any) => {
                        setModalFormData({
                          ...modalFormData,
                          [key]: e.target.value,
                        });
                      },
                    })}
                  </Flex>
                  <FlexSpacer flex={1} />
                </Flex>
              );
            })}
          </Flex>
          <FlexSpacer flex={1} />
          <Flex horizontal>
            <Button
              variant={'border'}
              onClick={() => {
                if (Object.keys(modifyError).length) {
                  toast.error('Failed to save! Some values are invalid.');
                  return;
                }

                const dat: Record<string, any> = {};

                const whitelistKeys = Object.keys(props.contents);
                Object.entries(modalFormData).forEach(([k, v]) => {
                  if (whitelistKeys.indexOf(k) !== -1) {
                    if (props.contents[k].pref.containerType === 'datetime') {
                      dat[k] = moment
                        .utc(moment(v))
                        .format('YYYY-MM-DD[T]HH:mm:ss');
                    } else if (
                      props.contents[k].pref.containerType === 'number'
                    ) {
                      dat[k] = parseFloat(v);
                    } else {
                      dat[k] = v;
                    }
                  } else {
                    dat[k] = '';
                  }
                });

                // eslint-disable-next-line no-unused-expressions
                props.postApi &&
                  props.postApi({ data: dat }).then((v) => {
                    if (v.result) {
                      setIsCreateEnabled(false);
                      toast.success('Created successfully!');
                    } else {
                      toast.error(
                        `Failed to create document${
                          v.message ? ` - ${v.message}` : ''
                        }`,
                      );
                    }
                  });
              }}>
              Save
            </Button>
            <Margin horizontal={'20px'} />
            <Button
              variant={'border'}
              onClick={() => setIsCreateEnabled(false)}>
              Cancel
            </Button>
          </Flex>

          <FlexSpacer flex={0.5} />
        </Flex>
      </ReactModal>
    </>
  );
};

const AdminTable = function <T extends Record<string, any>>(props: Props<T>) {
  return (
    <>
      <Portal>
        <Toaster
          toastOptions={{
            position: 'top-right',
            duration: 2000,
          }}
        />
      </Portal>
      <_AdminTable {...props} />
    </>
  );
};

export default AdminTable;
