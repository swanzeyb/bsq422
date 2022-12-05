import { FunctionComponent } from 'react'
import Image from 'next/image'

type CardProps = {
  imgSrc: string,
  imgAlt: string,
  position: string,
  title: string,
  desc: string,
  link: string,
  type: string,
}

const Card: FunctionComponent<CardProps> = ({ imgSrc, imgAlt, position, title, desc, link, type }) => {
  return (
    <div className="grid md:grid-cols-11 gap-8 mb-16">
      <div className="ml-[-3px] md:col-span-4 col-span-7">
        <Image
          src={imgSrc} alt={imgAlt}
          width={512} height={384}
          placeholder="blur"
          blurDataURL={imgSrc}
        />
      </div>
      <div className="col-span-7">
        <p className="text-sm tracking-widest mb-3">{position}</p>
        <h3 className="text-3xl font-semibold mb-3">{title}</h3>
        <p className="font-Jakarta text-base mb-8 max-w-md">{desc}</p>
        <a href={link} target="_blank">
          See {type} {' '}
          <Image className="inline" src="/chevron-forward-sharp.svg" alt="See CEGN's Website" width={18} height={18} />
        </a>
      </div>
    </div>
  )
}

export default Card
