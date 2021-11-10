import React from 'react';
import _Modal from 'react-modal';
const Modal = (props: { isOpen: boolean }) => {
  return (
    <div>
      <_Modal isOpen={props.isOpen} />
    </div>
  );
};

export default Modal;
