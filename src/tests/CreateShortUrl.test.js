import React from 'react'
import { shallow } from 'enzyme'
import CreateShortUrl from '../components/CreateShortUrl'

it('renders without crashing', () => {
  shallow(<CreateShortUrl />)
})
