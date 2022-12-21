import { useNavigationItems } from './Navigation.hooks';
import {
  StyledCol,
  StyledContainer,
  StyledItem,
  StyledRow,
  StyledTitle,
} from './Navigation.styles';

export const Navigation = () => {
  const navigaionItems = useNavigationItems();

  return (
    <StyledContainer>
      <StyledRow>
        {navigaionItems.map(({ icon, label, action }) => (
          <StyledCol key={label}>
            <StyledItem onClick={action}>
              {icon}
              <StyledTitle> {label}</StyledTitle>
            </StyledItem>
          </StyledCol>
        ))}
      </StyledRow>
    </StyledContainer>
  );
};
