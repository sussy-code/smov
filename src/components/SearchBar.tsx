import { ButtonControl } from './Buttons/ButtonControl';
import { Icon, Icons } from './Icon';
import { TextInputControl, TextInputControlPropsNoLabel } from './TextInputs/TextInputControl';

export interface SearchBarProps extends TextInputControlPropsNoLabel {
  buttonText?: string;
  onClick?: () => void;
}

export function SearchBarInput(props: SearchBarProps) {
  return (
    <div>
      <TextInputControl onChange={props.onChange} value={props.value} />
      <ButtonControl onClick={props.onClick}>
        <Icon icon={Icons.SEARCH} />
        { props.buttonText || "Search" }
      </ButtonControl>
    </div>
  )
}
