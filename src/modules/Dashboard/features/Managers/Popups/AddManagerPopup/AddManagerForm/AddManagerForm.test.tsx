import { fireEvent, render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { mockedFullParticipant1, mockedFullParticipant2 } from 'shared/mock';
import { ParticipantTag, Roles } from 'shared/consts';
import { ApiLanguages } from 'api';

import { AddManagerForm } from './AddManagerForm';
import { AddManagerFormValues } from '../AddManagerPopup.types';
import { defaultValues } from '../AddManagerPopup.const';
import { AddManagerPopupSchema } from '../AddManagerPopup.schema';

const mockOnSubmit = vi.fn();
const dataTestid = 'test-id';

const mockedParticipants = [mockedFullParticipant1, mockedFullParticipant2].map(({ details }) => {
  const { respondentSecretId, respondentNickname, subjectId } = details[0];

  return {
    subjectId,
    secretId: respondentSecretId,
    nickname: respondentNickname,
    tag: 'Child' as ParticipantTag,
  };
});

const AddManagerFormTest = ({
  isWorkspaceNameVisible = false,
  role = Roles.Manager,
}: {
  isWorkspaceNameVisible?: boolean;
  role?: Roles;
}) => {
  const { control } = useForm<AddManagerFormValues>({
    resolver: yupResolver(AddManagerPopupSchema(isWorkspaceNameVisible)),
    defaultValues: {
      ...defaultValues,
      role,
    },
  });

  return (
    <AddManagerForm
      appletParticipants={mockedParticipants}
      appletRoles={[Roles.Manager, Roles.Editor, Roles.Coordinator, Roles.Reviewer]}
      isWorkspaceNameVisible={isWorkspaceNameVisible}
      onSubmit={mockOnSubmit}
      control={control}
      data-testid={dataTestid}
    />
  );
};

const labelNames = [
  'Role',
  'Email Address',
  'First Name',
  'Last Name',
  'Title',
  'Invitation Language',
];
const onlyReviewerLabelNames = ['This Reviewer Can View'];
const onlyWorkspaceLabelNames = ['Workspace Name'];
const reviewerLabelNames = [...labelNames, ...onlyReviewerLabelNames];
const workspaceLabelNames = [...labelNames, ...onlyWorkspaceLabelNames];

describe('AddManagerForm component tests', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('The form has expected fields with Manager role and workspace disabled', () => {
    render(<AddManagerFormTest />);

    labelNames.forEach((label) => expect(screen.getByLabelText(label)).toBeInTheDocument());
    onlyReviewerLabelNames.forEach((label) =>
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument(),
    );
    onlyWorkspaceLabelNames.forEach((label) =>
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument(),
    );
  });

  test('The form has expected fields with Reviewer role and workspace disabled', () => {
    render(<AddManagerFormTest role={Roles.Reviewer} />);

    reviewerLabelNames.forEach((label) => expect(screen.getByLabelText(label)).toBeInTheDocument());
    onlyWorkspaceLabelNames.forEach((label) =>
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument(),
    );
  });

  test('The form has expected fields with Manager role and workspace enabled', () => {
    render(<AddManagerFormTest isWorkspaceNameVisible />);

    workspaceLabelNames.forEach((label) =>
      expect(screen.getByLabelText(label)).toBeInTheDocument(),
    );
    onlyReviewerLabelNames.forEach((label) =>
      expect(screen.queryByLabelText(label)).not.toBeInTheDocument(),
    );
  });

  test('The onSubmit handler is called when the form is submitted', () => {
    const { getByTestId } = render(<AddManagerFormTest />);

    const form = getByTestId(`${dataTestid}-form`);
    fireEvent.submit(form);

    expect(mockOnSubmit).toHaveBeenCalled();
  });

  test('Invitation language dropdown lists every ApiLanguages value with its translated label', () => {
    render(<AddManagerFormTest />);

    const trigger = screen.getByTestId(`${dataTestid}-lang`).querySelector('[role="combobox"]');
    expect(trigger).not.toBeNull();
    fireEvent.mouseDown(trigger as Element);

    const expectedLabels: Record<ApiLanguages, string> = {
      [ApiLanguages.EN]: 'English',
      [ApiLanguages.FR]: 'French',
      [ApiLanguages.EL]: 'Greek',
      [ApiLanguages.ES]: 'Spanish',
      [ApiLanguages.PT]: 'Portuguese',
      [ApiLanguages.AF]: 'Afrikaans',
      [ApiLanguages.XH]: 'Xhosa',
      [ApiLanguages.ZU]: 'Zulu',
    };

    Object.values(ApiLanguages).forEach((lang) => {
      expect(screen.getByRole('option', { name: expectedLabels[lang] })).toBeInTheDocument();
    });
  });
});
