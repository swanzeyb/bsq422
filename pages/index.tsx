import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Card from '../components/Card'

const Home: NextPage = () => {
  return (
    <div className="flex min-h-screen flex-row justify-center bg-richBlack text-white font-Raleway">
      <div className="flex-auto flex-row container md:px-16 px-8 pt-4">
        <Head>
          <title>Ben Swanzey</title>
          <link rel="icon" href="/favicon.ico" />
          <style> @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500&family=Raleway:wght@400;600;700&display=swap'); </style>
        </Head>

        <div>
          <nav className="flex flex-row justify-between">
            <Image src="/bs.svg" alt="Ben Swanzey Logo" width={128} height={20} />
            <ul className="flex flex-row text-sm font-semibold">
              <li>
                <a href="/swanzey_resume.pdf" target="_blank">Resume</a>
              </li>
              <li className="ml-8">
                <a href="mailto:swanzeyb2001@gmail.com" target="_blank">Contact</a>
              </li>
            </ul>
          </nav>
        </div>

        <main>
          {/* Hero Element */}
          <div className="text-center mt-24 mb-40"> 
            <h1 className="text-5xl font-bold mb-3 leading-tight">Fullstack Engineering Student</h1>
            <h4 className="font-Jakarta text-base tracking-wide">Student of Computer Science at Washington State University, Pullman WA.</h4>
            <div className="flex flex-col items-center mt-8">
              <Image src="/thumbnail.png" alt="Photo of Ben Swanzey" width={173} height={173} />
            </div>
          </div>

          {/* Experience Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Experience</h2>
            <div className="w-36 h-[3px] bg-gradient-primary mb-8"></div>
            <Card
              imgSrc="/cegn.png"
              imgAlt="Center of Excellence for Green Nanotechnologies (CEGN) Website Preview Thumbnail"
              position="CONTRACTOR"
              title="UCLA CEGN Website"
              desc="A NextJS and Headless Wordpress Jamstack website."
              link="https://www.figma.com/proto/wcTWSKCUMKObrA4IWt3gIQ/CEGN-For-Portfolio?page-id=0%3A1&node-id=2%3A2&viewport=923%2C25%2C0.15&scaling=scale-down"
            />
            <Card
              imgSrc="/cqse.png"
              imgAlt="Center for Quantum Science and Engineering (CQSE) Website Preview Thumbnail"
              position="CONTRACTOR"
              title="UCLA CQSE Website"
              desc="A responsive static website, made for ease of extensibility."
              link="https://www.cqse.ucla.edu/"
            />
          </div>

          {/* Projects Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">Projects</h2>
            <div className="w-36 h-[3px] bg-gradient-primary mb-8"></div>
            <Card
              imgSrc="/schedule_app.png"
              imgAlt="Thumbnail of a React Native app to convert pictures of a users work schedule to entries in their Google Calendar"
              position="SELF MOTIVATED"
              title="Work Schedule Utility App"
              desc="A React Native app that converts a photo of the users work schedule to entries in their Google Calendar."
              link="https://github.com/swanzeyb/schedule-app-rn#readme"
            />
          </div>

          {/* Get In Touch */}
          <div className="mt-24 mb-72">
          <div className="w-36 h-[3px] bg-gradient-primary mb-8"></div>
            <p className="text-sm tracking-widest mb-4">GET IN TOUCH</p>
            <h1 className="text-3xl tracking-wide mb-4">Want to work together or have any questions?</h1>
            <span className="text-seaGreen text-2xl font-Jakarta">
              <a href="mailto:swanzeyb2001@gmail.com" target="_blank">
                swanzeyb2001@gmail.com {' '}
                <Image className="inline" src="/share-outline.svg" alt="See CEGN's Website" width={18} height={18} />
              </a>
            </span>
          </div>
        </main>

        <footer>
          <div className="w-36 h-[3px] bg-gradient-primary mb-4"></div>
          <nav>
            <ul className="mb-4 flex flex-row text-sm font-semibold">
              <li className="mr-4">
                <a href="https://github.com/swanzeyb/bsq422" target="_blank">This Site On Github</a>
              </li>
              <li className="mr-4">
                <a href="/resume.pdf" target="_blank">Resume</a>
              </li>
              <li className="mr-4">
                <a href="mailto:swanzeyb2001@gmail.com" target="_blank">Contact</a>
              </li>
            </ul>
          </nav>
          <p className="mb-16 text-sm">Made with care by Ben Swanzey</p>
        </footer>
      </div>
    </div>
  )
}

export default Home
