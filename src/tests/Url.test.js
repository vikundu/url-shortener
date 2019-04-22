import React from 'react'
import { shallow } from 'enzyme'
import Url from '../components/Url'

it('renders without crashing', () => {
  shallow(<Url />)
})
