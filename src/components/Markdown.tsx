import React from 'react';
import { Flex } from './assets/Wrapper';
import { Column, Input, Textarea } from 'react-rainbow-components';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styled from 'styled-components';
import { ContainerBase } from '..';

type Props = ContainerBase<string>;

const MarkdownWrapper = styled.div`
  flex: 1;
  color: black;
  height: 100%;
  overflow: scroll;
  margin-left: 10px;
  .markdown_wrapper_inside {
    height: 100%;
  }
`;

const TextEditor = styled.textarea`
  height: 100%;
  border-radius: 10px;
  flex: 1;
  padding: 10px;
  resize: none;
`;

const MarkdownContainer = (props: Props) => {
  return props.isChanging ? (
    <Flex
      horizontal
      flex={'1 1'}
      style={{
        height: '60vh',
        margin: '10px',
      }}>
      <TextEditor onChange={props.onChange} value={props.value} />
      <MarkdownWrapper>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          className={'markdown_wrapper_inside'}>
          {props.value || ''}
        </ReactMarkdown>
      </MarkdownWrapper>
    </Flex>
  ) : (
    <Column
      sortable={props.sortable || true}
      header={props.title}
      field={props.key}
      component={() => <span>[...]</span>}
    />
  );
};

export default MarkdownContainer;
