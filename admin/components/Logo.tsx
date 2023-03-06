import Link from 'next/link';
import Image from 'next/image';

const Logo = () => (
  <Link href='/'>
    <a className='logo'>
      <figure className='logo__figure'>
        <Image
          className='logo__image'
          src='/logo/felida-music-white@2x.png'
          alt='Felida Music | Admin'
          width={100}
          height={44}
        />
        <style jsx>{`
          .logo__figure {
            width: 100px;
            margin: 0.5em 10px 0.2em;
          }
          .logo__image {
            width: 100%;
            filter: brightness(0) invert(1);
          }
        `}</style>
      </figure>
    </a>
  </Link>
);

export default Logo;
