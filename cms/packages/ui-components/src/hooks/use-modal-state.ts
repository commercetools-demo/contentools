import { useState, useCallback } from 'react';

export interface ModalState {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleModal: () => void;
}

export const useModalState = (initialState: boolean = false): ModalState => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(initialState);

  const openModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const toggleModal = useCallback(() => {
    setIsModalOpen(prev => !prev);
  }, []);

  return {
    isModalOpen,
    openModal,
    closeModal,
    toggleModal,
  };
};
