import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import NewListModal from "./NewListModal";
import TestsProviders from "../utils/TestsProviders";

const config = {
  wrapper: ({ children }: { children?: React.ReactNode }) => (
    <TestsProviders>{children}</TestsProviders>
  ),
};

const getModal = () =>
  screen.queryByRole("dialog", { name: /create a new list/i });
const getNameInput = () => screen.getByRole("textbox", { name: /name/i });
const getDescriptionInput = () =>
  screen.getByRole("textbox", { name: /description/i });
const getPrivateCheckbox = () =>
  screen.getByRole("checkbox", { name: /private/i });
const getSubmitBtn = () =>
  screen.getByRole("button", {
    name: /create/i,
  });

test("shouldn't display form if modal is not open", async () => {
  render(<NewListModal isOpen={false} onClose={() => {}} />, config);
  expect(getModal()).not.toBeInTheDocument();
});

test("should display main form elements", async () => {
  render(<NewListModal isOpen={true} onClose={() => {}} />, config);

  expect(getNameInput()).toHaveTextContent("");
  expect(getDescriptionInput()).toHaveTextContent("");
  expect(getPrivateCheckbox());
  expect(getSubmitBtn());
});

test("should show error and not submit the form if name is not completed", async () => {
  const onSubmit = jest.fn();
  render(
    <NewListModal isOpen={true} onClose={() => {}} onSubmit={onSubmit} />,
    config
  );
  userEvent.click(getSubmitBtn());
  expect(getNameInput()).toBeInvalid();
  expect(onSubmit).not.toHaveBeenCalled();
});

test("should submit the form if information is completed", async () => {
  const listData = {
    name: "Tech",
    description: "Cool people from the tech industry",
    isPrivate: true,
  };

  const onSubmit = jest.fn();
  render(
    <NewListModal isOpen={true} onClose={() => {}} onSubmit={onSubmit} />,
    config
  );
  userEvent.type(getNameInput(), listData.name);
  userEvent.type(getDescriptionInput(), listData.description);
  userEvent.click(getPrivateCheckbox());

  const submitBtn = screen.getByRole("button", {
    name: /create/i,
  });
  userEvent.click(submitBtn);
  expect(onSubmit).toHaveBeenCalledWith(listData);
});
