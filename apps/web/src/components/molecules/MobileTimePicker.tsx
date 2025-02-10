import { When } from '@smort-home/firestore';
import Picker from 'react-mobile-picker';

interface MobileTimePickerProps {
  time: When;
  onChange: (when: When) => void;
}

const hours = [...Array(12).keys()];
const minutes = [...Array(59).keys()];
const amOrPm = ['AM', 'PM'] as const;

export const MobileTimePicker = ({ time, onChange }: MobileTimePickerProps) => {
  return (
    <Picker value={time} onChange={onChange}>
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
