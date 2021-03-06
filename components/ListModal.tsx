import React, { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "react-query";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Textarea,
  FormHelperText,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";

import { List } from "../types";
import { createList, updateList } from "../utils/api";

type formState = {
  id?: string;
  name: string;
  description: string;
  isPrivate: boolean;
};

type commonProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (formState: any) => void; // Only used for tests
};

type createOrEditProps =
  | { isEditing?: false; listToEdit?: never }
  | { isEditing: true; listToEdit: List };

type props = commonProps & createOrEditProps;

const defaultFormState: formState = {
  name: "",
  description: "",
  isPrivate: false,
};

const transformToForm = ({ id, name, description, mode }: List): formState => ({
  id,
  name,
  description,
  isPrivate: mode === "private",
});

const transformToApi = ({
  isPrivate,
  ...list
}: formState): Pick<List, "name" | "description" | "mode"> => ({
  ...list,
  mode: isPrivate ? "private" : "public",
});

export default function ListModal({
  isOpen,
  onClose,
  onSubmit,
  isEditing = false,
  listToEdit,
}: props) {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [formState, setFormState] = useState(
    isEditing ? transformToForm(listToEdit!) : defaultFormState
  );

  // @TODO: Review if creation or edit mutation should be passed as prop
  const createListMutation = useMutation(createList, {
    onSuccess: (newList) => {
      onClose();
      setIsFormSubmitted(false);
      setFormState(defaultFormState);
      queryClient.setQueryData<List[]>("lists", (prevList) => [
        ...(prevList ? prevList : []),
        newList,
      ]);
    },
    onError: () => {
      toast({
        title: "Error",
        description: `There was an error creating the list`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const editListMutation = useMutation(updateList, {
    onSuccess: (editedList) => {
      onClose();
      setIsFormSubmitted(false);
      queryClient.setQueryData<List[]>("lists", (lists) =>
        (lists || []).map((list) =>
          list.id === editedList.id ? editedList : list
        )
      );
    },
    onError: () => {
      toast({
        title: "Error",
        description: `There was an error editing the list`,
        status: "error",
        isClosable: true,
      });
    },
  });

  const isLoading = isEditing
    ? editListMutation.isLoading
    : createListMutation.isLoading;

  const handleFormSubmit = () => {
    setIsFormSubmitted(true);
    if (formState.name.trim() === "") return;

    onSubmit && onSubmit(formState);
    isEditing
      ? editListMutation.mutate(transformToApi(formState))
      : createListMutation.mutate(transformToApi(formState));
  };

  const handleInputChange = useCallback((event) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    setFormState((oldFormState) => ({
      ...oldFormState,
      [name]: value,
    }));
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isEditing ? `Edit list` : "Create a new list"}
        </ModalHeader>
        <ModalCloseButton></ModalCloseButton>
        <ModalBody>
          <FormControl
            isRequired
            isInvalid={isFormSubmitted && formState.name.trim() === ""}
          >
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              value={formState.name}
              onChange={handleInputChange}
            />
            <FormErrorMessage>Enter a name to create a list</FormErrorMessage>
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              name="description"
              value={formState.description}
              onChange={handleInputChange}
            />
          </FormControl>

          <FormControl mt={4}>
            <Checkbox
              name="isPrivate"
              isChecked={formState.isPrivate}
              onChange={handleInputChange}
            >
              Private
            </Checkbox>
            <FormHelperText>
              When you make a list private, only you can see it
            </FormHelperText>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            ml="2"
            onClick={handleFormSubmit}
            isLoading={isLoading}
            colorScheme="blue"
          >
            {isEditing ? "Save" : "Create"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
