import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { dataTestId } from '../InvitationsTable.const';
import { InvitationWithTooltip } from './InvitationWithTooltip';
import { InvitationWithTooltipProps } from './InvitationWithTooltip.types';

const defaultProps = {
  open: true,
  onClose: jest.fn(),
  invitationLink: 'example-link',
};

const renderComponent = (props: InvitationWithTooltipProps) => render(<InvitationWithTooltip {...props} />);

describe('InvitationWithTooltip', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('render component with provided invitation link and tooltip', () => {
    const { getAllByText, getByTestId } = renderComponent(defaultProps);

    const exampleLinkTexts = getAllByText('example-link');
    exampleLinkTexts.forEach((linkText) => expect(linkText).toBeInTheDocument());
    expect(getByTestId(`${dataTestId}-invitation-tooltip`)).toBeInTheDocument();
    expect(getByTestId(`${dataTestId}-invitation-link`)).toBeInTheDocument();
  });

  test('render component, but not render tooltip if open="false"', () => {
    const { getAllByText, getByTestId, queryByTestId } = renderComponent({
      ...defaultProps,
      open: false,
    });

    const exampleLinkTexts = getAllByText('example-link');
    exampleLinkTexts.forEach((linkText) => expect(linkText).toBeInTheDocument());
    expect(getByTestId(`${dataTestId}-invitation-link`)).toBeInTheDocument();
    expect(queryByTestId(`${dataTestId}-invitation-tooltip`)).not.toBeInTheDocument();
  });

  test('copies link to clipboard on copy button click', async () => {
    const clipboardWriteTextMock = jest.fn();
    Object.assign(navigator, {
      clipboard: { writeText: clipboardWriteTextMock },
    });

    const { getByTestId } = renderComponent(defaultProps);

    await userEvent.click(getByTestId(`${dataTestId}-tooltip-copy-btn`));
    expect(clipboardWriteTextMock).toHaveBeenCalledWith('example-link');
  });
});
