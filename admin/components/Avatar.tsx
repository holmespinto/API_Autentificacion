import { FC } from 'react';
import { Image } from 'semantic-ui-react';

type AvatarProps = {
  picture?: string;
  name?: string;
};

const Avatar: FC<AvatarProps> = ({
  picture = 'https://react.semantic-ui.com/images/avatar/large/elliot.jpg',
  name,
}) => (
  <span className='avatar'>
    <Image src={picture} avatar alt='Avatar' />
    {name}
  </span>
);

export default Avatar;
