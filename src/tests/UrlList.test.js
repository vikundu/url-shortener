import React from 'react'
import { shallow } from 'enzyme'
import UrlList from '../components/UrlList'

it('renders without crashing', () => {
  shallow(<UrlList />)
})
