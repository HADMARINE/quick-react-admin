import React from 'react';
import styled from 'styled-components';
import { Text } from './Text';
import { ColorGen } from './Color';

//TODO: change color

interface Props {
  value?: ReactTypes.value;
  placeholder?: string;
  buttonStyle?: React.CSSProperties;
  inputStyle?: React.CSSProperties;
  onChange?: ReactTypes.onChange;
  name?: string;
  width?: string;
  height?: string;
  variant?: 'primary' | 'error';
  error?: string;
}

const theme: Record<string, React.CSSProperties> = {
  primary: { color: 'black', backgroundColor: 'white' },
  error: {
    color: 'black',
    backgroundColor: '#ffcabf',
    border: '1px solid red',
  },
};

const Wrapper = styled.div`
  margin: 10px 0 10px 0;
  display: flex;
  height: ${(props: Props) => props.height || '60px'};
  input[type='file'] {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
  label {
    display: flex;
    color: white;
    width: 100px;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: #f15c5c;
    cursor: pointer;
    border-radius: 3px;
    margin-left: 10px;
  }
  /* named upload */
  .upload-name {
    display: flex;
    flex: 8;
    height: 100%;
    font-size: 16px;
    background-color: white;
    border: none;
    border-radius: 3px;
    padding: 20px;
    box-sizing: border-box;
  }
`;

const FileUpload = (props: Props) => {
  return (
    <div>
      <Wrapper height={props.height}>
        <input
          style={theme[props.error ? 'error' : props.variant || 'primary']}
          className="upload-name"
          value={props.value || props.placeholder || '파일 선택'}
          disabled={true}
        />
        <label htmlFor="input_upload">업로드</label>
        <input
          type="file"
          id="input_upload"
          className="upload-hidden"
          name={props.name}
          onChange={props.onChange}
        />
      </Wrapper>
      {props.error && (
        <Text style={{ marginLeft: '5px', marginTop: '-10px' }}>
          <ColorGen color={'red'}>{props.error}</ColorGen>
        </Text>
      )}
    </div>
  );
};

export default FileUpload;
