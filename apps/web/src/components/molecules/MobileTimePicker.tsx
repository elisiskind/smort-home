import { When } from '@smort-home/firestore';
import Picker from 'react-mobile-picker';
import { useEagerServerState } from '../../hooks/useEagerServerState';

interface MobileTimePickerProps {
  time: When;
  onChange: (when: When) => void;
}

const hours = [...Array(12).keys()];
const minutes = [...Array(59).keys()];
const amOrPm = ['AM', 'PM'] as const;

export const MobileTimePicker = ({
  time: serverTime,
  onChange,
}: MobileTimePickerProps) => {
  const [value, setValue] = useEagerServerState(serverTime, onChange, 500);

  return (
    <Picker
      style={{
        touchAction: 'none',
      }}
      value={value}
      onChange={setValue}
    >
      <Picker.Column name={'hour'}>
        {hours.map((option) => (
          <Picker.Item key={option} value={option}>
            {`${option}`.padStart(2, '0')}
          </Picker.Item>
        ))}
      </Picker.Column>
      <Picker.Column name={'minute'}>
        {minutes.map((option) => (
          <Picker.Item key={option} value={option}>
            {`${option}`.padStart(2, '0')}
          </Picker.Item>
        ))}
      </Picker.Column>
      <Picker.Column name={'amOrPm'}>
        {amOrPm.map((option) => (
          <Picker.Item key={option} value={option}>
            {option}
          </Picker.Item>
        ))}
      </Picker.Column>
    </Picker>
  );
};
