import userEvent from "@testing-library/user-event";

import { render, screen } from "../utils/test-utils";
import ListModal from "./ListModal";

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

describe("ListModal", () => {
  test("shouldn't display form if modal is not open", async () => {
    render(<ListModal isOpen={false} onClose={() => {}} />);
    expect(getModal()).not.toBeInTheDocument();
  });

  test("should display main form elements", async () => {
    render(<ListModal isOpen={true} onClose={() => {}} />);

    expect(getNameInput()).toHaveTextContent("");
    expect(getDescriptionInput()).toHaveTextContent("");
    expect(getPrivateCheckbox());
    expect(getSubmitBtn());
  });

  test("should show error and not submit the form if name is not completed", async () => {
    const onSubmit = jest.fn();
    render(<ListModal isOpen={true} onClose={() => {}} onSubmit={onSubmit} />);
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
    render(<ListModal isOpen={true} onClose={() => {}} onSubmit={onSubmit} />);
    userEvent.type(getNameInput(), listData.name);
    userEvent.type(getDescriptionInput(), listData.description);
    userEvent.click(getPrivateCheckbox());
    userEvent.click(getSubmitBtn());
    expect(onSubmit).toHaveBeenCalledWith(listData);
  });
});
